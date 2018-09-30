package main

type Config struct {
	Tabs map[string]Tab
}

// 每个tab页的配置
type Tab struct {
	Name      string
	Field     string
	DbName    string
	Parser    Parser
	TableList map[string]Table
}

// 库索引和表索引的解析格式
type Parser struct {
	TableIndex string
	DbIndex    string
}

// 表配置
type Table struct {
	Name       string
	Annotation string
	Checked    bool
	Field      string
	Parser     Parser
	Sql        string
}
