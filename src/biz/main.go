package main

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"io/ioutil"
	"log"
	"net/http"
	"os"
)

const (
	configDir  = "~/Library/com.amooly.SQL Generator"
	configFile = "config.json"
	configPath = configDir + "/" + configFile
)

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/Config", queryConfig).Methods("GET")
	r.HandleFunc("/Config", saveConfig).Methods("POST")
	r.HandleFunc("/Sql", getSql).Methods("POST")
	log.Fatal(http.ListenAndServe(":1507", r))
}

func queryConfig(w http.ResponseWriter, r *http.Request) {

	content, err := readFile()
	if err != nil {
		log.Fatal("读取文件失败", err)
	}
	if err := json.NewEncoder(w).Encode(content); err != nil {
		panic(err)
	}
}

func saveConfig(w http.ResponseWriter, r *http.Request) {

}

func getSql(w http.ResponseWriter, r *http.Request) {

}

func readFile() (string, error) {
	exist, err := pathExist(configDir)
	if err != nil {
		return "", err
	}
	if !exist {
		os.Mkdir(configDir, os.ModePerm)
		return "", nil
	}

	exist, err = pathExist(configPath)
	if err != nil {
		return "", nil
	} else if !exist {
		f, err := os.Create(configPath)
		defer f.Close()
		if err != nil {
			return "", err
		}
	}

	f, err := os.OpenFile(configPath, os.O_RDONLY, 0600)
	defer f.Close()
	if err != nil {
		return "", err
	}
	contentByte, err := ioutil.ReadAll(f)
	if err != nil {
		return "", nil
	}
	return string(contentByte), nil
}

func pathExist(path string) (bool, error) {
	_, err := os.Stat(path)
	if err != nil {
		if os.IsNotExist(err) {
			return false, nil
		}
		return false, err
	}
	return true, nil
}
