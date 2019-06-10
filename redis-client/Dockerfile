FROM golang:1.11.2
RUN mkdir -p /go/src/redis-client
RUN go get github.com/go-redis/redis
RUN go get golang.org/x/net/websocket
RUN go get github.com/cespare/reflex
WORKDIR /go/src/redis-client
COPY main.go  .
CMD reflex  -d none -s -R vendor. -r \.go$ -- go run main.go
