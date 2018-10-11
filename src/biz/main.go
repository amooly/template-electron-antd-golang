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
	if content, err := readFile(); err != nil {
		log.Println("读取文件失败", err)
		writeFailResult(w, "读取文件失败")
	} else {
		writeSuccessResult(w, content)
	}
}

func saveConfig(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Println(err)
		writeFailResult(w, "获取请求失败")
		return
	}
	if len(body) == 0 {
		log.Println("length of body is 0")
		writeFailResult(w, "配置数据为空")
		return
	}

	var tabs map[string]interface{}
	if err := json.Unmarshal(body, &tabs); err != nil {
		log.Println(err)
		writeFailResult(w, "配置解析失败")
		return
	}

	if tabsByte, err := json.Marshal(tabs); err != nil {
		log.Println(err)
		writeFailResult(w, "配置存储失败")
		return
	} else if _, err := writeFile(tabsByte); err != nil {
		log.Println(err)
		writeFailResult(w, "配置存储失败")
		return
	}
	writeSuccessResult(w, nil)
}

func getSql(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Println(err)
		writeFailResult(w, "获取请求失败")
		return
	}
	if len(body) == 0 {
		log.Println("length of body is 0")
		writeFailResult(w, "配置数据为空")
		return
	}
	var request SqlRequest
	if err := json.Unmarshal(body, &request); err != nil {
		log.Println("failed to unmarshal", err)
		writeFailResult(w, "请求非法")
		return
	}

	if len(request.CheckedTables) <= 0 {
		writeFailResult(w, "未选中对应表")
		return
	}

	if len(request.OrderNo) <= 0 {
		writeFailResult(w, "请输入单据号")
		return
	}

	writeSuccessResult(w, body)
}

func writeSuccessResult(w http.ResponseWriter, data []byte) {
	result := make(map[string]interface{})
	result["success"] = true
	result["data"] = string(data)

	if resultByte, err := json.Marshal(result); err != nil {
		panic("响应失败:" + err.Error())
	} else {
		w.Write(resultByte)
	}
}

func writeFailResult(w http.ResponseWriter, err string) {
	result := make(map[string]interface{})
	result["success"] = false
	result["err"] = err

	if resultByte, err := json.Marshal(result); err != nil {
		panic("响应失败:" + err.Error())
	} else {
		w.Write(resultByte)
	}
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
