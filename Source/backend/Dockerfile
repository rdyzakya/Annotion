FROM golang:alpine AS build

WORKDIR /go/src/app

COPY . .
RUN go mod download
RUN GOOS=linux go build -ldflags="-s -w" -o ./server ./main.go

FROM alpine:3.10
WORKDIR /usr/bin
COPY --from=build /go/src/app/server .
COPY --from=build /go/src/app/.env .
RUN chmod +x ./server
EXPOSE 8010
ENTRYPOINT ["./server"]