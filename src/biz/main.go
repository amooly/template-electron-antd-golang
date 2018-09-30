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
	var result map[string]interface{}

	if content, err := readFile(); err != nil {
		log.Println("读取文件失败", err)
		result = buildFailResult("读取文件失败")
	} else {
		result = buildSuccessResult(content)
	}

	if resultByte, err := json.Marshal(result); err != nil {
		panic("响应失败")
	} else {
		w.Write(resultByte)
	}
}

func saveConfig(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err)
	}
	if len(body) == 0 {
		panic("数据为空")
	}

	var tabs map[string]interface{}
	if err := json.Unmarshal(body, &tabs); err != nil {
		panic(err)
	}
	log.Println("config:", tabs)

	tabsByte, err := json.Marshal(tabs)
	if err != nil {
		panic(err)
	}

	if _, err := writeFile(tabsByte); err != nil {
		panic("写入失败")
	}
	result := buildSuccessResult(nil)
	if resultByte, err := json.Marshal(result); err != nil {
		panic("响应失败")
	} else {
		w.Write(resultByte)
	}
}

func getSql(w http.ResponseWriter, r *http.Request) {

}

func buildSuccessResult(data []byte) map[string]interface{} {
	result := make(map[string]interface{})
	result["success"] = true
	result["data"] = string(data)
	return result
}

func buildFailResult(err string) map[string]interface{} {
	result := make(map[string]interface{})
	result["success"] = false
	result["err"] = err
	return result
}

func readFile() ([]byte, error) {
	f, err := os.OpenFile(configPath, os.O_RDONLY, os.ModePerm)
	defer f.Close()
	if err != nil {
		return nil, err
	}
	contentByte, err := ioutil.ReadAll(f)
	if err != nil {
		return nil, nil
	}
	return contentByte, nil
}

func writeFile(content []byte) (int, error) {
	f, err := os.OpenFile(configPath, os.O_WRONLY, os.ModePerm)
	defer f.Close()
	if err != nil {
		return 0, err
	}
	return f.Write(content)
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
