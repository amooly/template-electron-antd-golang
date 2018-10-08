import React from 'react';
import {Button, Drawer, message, Tabs} from 'antd';
import SearchBar from './SearchBar';
import TableList from './TableList';
import Preference from "./Preference";

const axios = require('axios');

const TabPane = Tabs.TabPane;

export default class MainTab extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            /**
             * 是否展示库索引
             */
            showDbIndex: false,
            /**
             * 待搜索的单号
             */
            orderNo: '',
            /**
             * 当前tab面板
             */
            tabKey: '',
            /**
             * 配置信息
             */
            config: {},
            /**
             * 当前选中的列表
             */
            checkedTables: [],
            /**
             * 配置框visible
             */
            preferenceVisible: false
        }
    }

    componentDidMount = () => {
        axios.get('http://127.0.0.1:1507/Config', {})
            .then((response) => {
                console.log("recevie", response.data);
                let model = response.data.data;
                let config = JSON.parse((model));
                this.setState({
                    config: config,
                    tabKey: Object.keys(config)[0]
                })
            })
            .catch(function (error) {
                message.error('获取配置异常，请重试启动');
                console.log(error);
            });
    };

    /**
     * 搜索组件变更
     */
    handleSearch = (data) => {
        this.setState(data)
    };

    /**
     * 列表选择
     */
    handleCheckedTables = (checkedTables) => {
        this.setState({
            checkedTables: checkedTables
        })
    };

    handlePreference = (visible) => {
        this.setState({
            preferenceVisible: visible
        })
    };

    /**
     * 生成sql
     */
    handleGenerateSql = () => {
        /**
         * 调用后端生成sql
         */
        console.log("生成sql");
        const data = {
            showDbIndex: this.state.showDbIndex,
            orderNo: this.state.orderNo,
            tabKey: this.state.tabKey,
            checkedTables: this.state.checkedTables
        };

        console.log("send data", data);
        axios.post('http://127.0.0.1:1507/Sql', {data})
            .then((response) => {
                console.log("recevie", response);
                let model = response.data.data;
                console.log(model)
            })
            .catch(function (error) {
                message.error('生成Sql异常，请重试启动');
                console.log(error);
            });
    };

    render() {
        let config = this.state.config;

        const operations = (
            <Button style={{marginRight: '10px'}}
                    onClick={() => {
                        this.handlePreference(true)
                    }}>
                配置
            </Button>
        );


        return (
            <div>
                <Tabs tabBarExtraContent={operations} activeKey={this.state.tabKey}
                      onChange={(activeKey) => {
                          this.setState({
                              tabKey: activeKey
                          })
                      }}>
                    {
                        Object.keys(config).map((key) => {
                            const table = config[key];
                            return (
                                <TabPane tab={table.name} key={key}>
                                    <SearchBar
                                        orderNo={this.state.orderNo}
                                        showDbIndex={this.state.showDbIndex}
                                        onChange={this.handleSearch}
                                        onSubmit={this.handleGenerateSql}/>
                                    <TableList
                                        table={table}
                                        onChange={this.handleCheckedTables}
                                        checkedTables={this.state.checkedTables}/>
                                </TabPane>
                            );
                        })
                    }
                </Tabs>
                <Drawer
                    title="配置"
                    width='100%'
                    destroyOnClose={true}
                    visible={this.state.preferenceVisible}
                    onClose={() => {
                        this.handlePreference(false)
                    }}>
                    <Preference/>
                </Drawer>
            </div>
        );
    }
}
