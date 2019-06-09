FROM golang:1.11.2
RUN mkdir -p /go/src/redis-client
WORKDIR /go/src/redis-client
COPY main.go  .
CMD go run main.go
