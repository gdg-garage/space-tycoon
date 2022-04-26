package main

import (
	"encoding/json"
	log "github.com/sirupsen/logrus"
	"io/ioutil"
	"net/http"
)

func rootHandler(w http.ResponseWriter, req *http.Request) {
	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.Warningf("Error reading body: %v\n", err)
		http.Error(w, "can't read request body", http.StatusBadRequest)
		return
	}
	r, err := json.Marshal(map[string]string{"greeting": "hello", "body": string(body)})
	if err != nil {
		log.Warningf("Json marshall failed %v\n", err)
		http.Error(w, "response failed", http.StatusInternalServerError)
		return
	}
	_, err = w.Write(r)
	if err != nil {
		log.Warningf("response write failed %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
	}
}

func main() {
	http.HandleFunc("/", rootHandler)

	port := ":80"
	log.Infof("Listening on %s", port)
	err := http.ListenAndServe(port, nil)
	if err != nil {
		log.Fatal(err)
	}
}
