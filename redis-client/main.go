package main

import (
	"encoding/json"
	"github.com/go-redis/redis"
	"golang.org/x/net/websocket"
	"io"
	"log"
	"net/http"
	"strings"
	"sync"
)

type message struct {
	ClientMsgId int    `json:"clientMsgId"`
	ServerMsgId int    `json:"serverMsgId"`
	Message     string `json:"message"`
	Sender      string `json:"sender"`
}

type recvNotification struct {
	ClientMsgId int `json:"clientMsgId"`
	ServerMsgId int `json:"serverMsgId"`
}

func readWriteToRedis(ws *websocket.Conn, topic string) {
	log.Printf("New client on topic %s\n", topic)
	redisdb := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379", // use default Addr
		Password: "",               // no password set
		DB:       0,                // use default DB
	})

	if redisdb.Exists(topic).Val() != 1 {
		log.Printf("First time seeing topic %s: Initializing message counter at 1.\n", topic)
		redisdb.Set(topic, 1, 0)
	}

	pubsub := redisdb.Subscribe(topic)

	// Wait for confirmation that subscription is created before publishing anything.
	_, err := pubsub.Receive()
	if err != nil {
		panic(err)
	}

	wg := sync.WaitGroup{}
	wg.Add(1)
	quitRedis := make(chan int)
	go func() {
		defer func() {
			wg.Done()
			quitRedis <- 0
		}()
		var msg message
		for {
			if err := websocket.JSON.Receive(ws, &msg); err != nil {
				if err == io.EOF {
					return
				}
				log.Printf("Could not receive json: %s\n", err.Error())
				continue
			}

			msg.ServerMsgId = int(redisdb.Incr(topic).Val())
			websocket.JSON.Send(ws, recvNotification{ClientMsgId: msg.ClientMsgId, ServerMsgId: msg.ServerMsgId})

			msgStr, err := json.Marshal(msg)
			if err != nil {
				panic(err)
			}
			redisdb.Publish(topic, msgStr)
		}
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		pubsubCh := pubsub.Channel()

		for {
			select {
			case redisMsg := <-pubsubCh:
				var msg message
				if err := json.Unmarshal([]byte(redisMsg.Payload), &msg); err != nil {
					panic("Could not unmarshal redis message: " + err.Error())
				}
				websocket.JSON.Send(ws, msg)
			case <-quitRedis:
				return
			}
		}
	}()

	wg.Wait()
	if err := pubsub.Close(); err != nil {
		panic(err)
	}
	if err := redisdb.Close(); err != nil {
		panic(err)
	}
	log.Printf("Dropped client on topic %s\n", topic)
}
func wsHandler(ws *websocket.Conn) {
	urlSplit := strings.Split(ws.Request().URL.Path, "/")
	if len(urlSplit) == 2 && urlSplit[0] == "" {
		readWriteToRedis(ws, urlSplit[1])
	} else {
		ws.Close() // I don't think this actually does anything but whatever
	}
}

func main() {
	log.Println("Starting websocket chat server")
	http.Handle("/", websocket.Handler(wsHandler))
	if err := http.ListenAndServe(":9000", nil); err != nil {
		panic("ListenAndServe: " + err.Error())
	}
}
