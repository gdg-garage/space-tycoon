FROM golang:1.18-alpine AS builder

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY database/ ./database
COPY handlers/ ./handlers
COPY space-tycoon ./space-tycoon
COPY *.go ./

RUN go build -o space-tycoon-server

FROM alpine

WORKDIR /app

COPY --from=builder /app/space-tycoon-server ./space-tycoon

ENTRYPOINT ["/app/space-tycoon"]

EXPOSE 80