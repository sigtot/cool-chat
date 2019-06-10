package main

import (
	"encoding/json"
	"fmt"
	"github.com/go-redis/redis"
	"golang.org/x/net/websocket"
	"io"
	"net/http"
	"strings"
	"sync"
)

type message struct {
	Message string `json:"message"`
	Sender string `json:"sender"`
}

func readWriteToRedis(ws * websocket.Conn, topic string) {
	fmt.Println("New client")
	redisdb := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379", // use default Addr
		Password: "",               // no password set
		DB:       0,                // use default DB
	})

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
			quitRedis<- 0
		}()
		var msg message
		for {
			if err := websocket.JSON.Receive(ws, &msg); err != nil {
				if err == io.EOF {
					return
				}
				fmt.Printf("Could not receive json: %s\n", err.Error())
				continue
			}
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
		fmt.Println("No longer receiving from redis")
	}()

	wg.Wait()
	if err := pubsub.Close(); err != nil {
		panic(err)
	}
	if err := redisdb.Close(); err != nil {
		panic(err)
	}
	fmt.Println("Dropped client")
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
	fmt.Println("Starting websocket chat server")
	http.Handle("/", websocket.Handler(wsHandler))
	if err := http.ListenAndServe(":9000", nil); err != nil {
		panic("ListenAndServe: " + err.Error())
	}
}
