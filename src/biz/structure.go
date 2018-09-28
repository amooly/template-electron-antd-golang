package main

type Config struct {
	tabs map[string]Tab
}

// 每个tab页的配置
type Tab struct {
	name      string
	field     string
	dbName    string
	parser    Parser
	tableList map[string]Table
}

// 库索引和表索引的解析格式
type Parser struct {
	tableIndex string
	dbIndex    string
}

// 表配置
type Table struct {
	name       string
	annotation string
	checked    bool
	field      string
	parser     Parser
	sql        string
}
