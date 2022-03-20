FROM golang:1.18-alpine AS builder

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY *.go ./

RUN go build -o space-tycoon

FROM alpine

WORKDIR /app

COPY --from=builder /app/space-tycoon ./

ENTRYPOINT ["/app/space-tycoon"]

EXPOSE 80