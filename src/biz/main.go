package main

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"os/user"
)

const (
	configFile = "config.json"
)

var configDir = "/.sql_generator"
var configPath string

// 初始化配置文件
func init() {
	if userInfo, err := user.Current(); err != nil {
		panic("获取用户信息失败：" + err.Error())
	} else {
		configDir = userInfo.HomeDir + configDir
		configPath = configDir + "/" + configFile
	}

	exist, err := pathExist(configDir)
	if err != nil {
		panic("读取配置目录失败：" + err.Error())
	}
	if !exist {
		err := os.Mkdir(configDir, os.ModePerm)
		if err != nil {
			panic("创建配置目录失败：" + err.Error())
		}
	}

	exist, err = pathExist(configPath)
	if err != nil {
		log.Fatal("读取配置失败", err)
	} else if !exist {
		f, err := os.Create(configPath)
		defer f.Close()
		if err != nil {
			log.Fatal("创建配置失败", err)
		}
	}
}

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
