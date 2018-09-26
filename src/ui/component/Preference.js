import React, {Component} from 'react';
import {Button, Card, Icon, Modal, Row, Table, Tag} from 'antd';
import tables from "../mock/tables";
import TabConfigModal from "./TabConfigModal";

export default class Preference extends Component {

    constructor(props) {
        super(props);
        this.state = {
            /**
             * 配置信息
             */
            config: {},
            /**
             * tab页配置的对话框的可见性
             */
            tabConfigModalVisible: false,
            /**
             * 表配置的对话框可见性
             */
            tableConfigModalVisible: false
        }
    }

    componentDidMount = () => {
        this.setState({
            config: tables
        });
        console.log("preference mount");
    };

    handleTabConfigVisible = (visible) => {
        this.setState({
            tabConfigModalVisible: visible
        })
    };

    handleTabConfigOk = () => {
        this.handleTabConfigVisible(false);
    };

    handleTabConfigCancel = () => {
        this.handleTabConfigVisible(false);
    };

    render() {
        const config = this.state.config;

        const tableListContent = Object.keys(config).map((key) => {
            const cfg = config[key];
            let tableList = cfg.tableList;

            const cardTitle = (
                <div>
                    <span>{cfg.name}</span>&nbsp;&nbsp;
                    <Tag color="blue">
                        编辑
                    </Tag>
                </div>);
            const gridConent = Object.keys(tableList).map((key) => {
                let table = tableList[key];
                return (
                    <Card.Grid className="cardGrid" key={key}>{table.name}</Card.Grid>
                );
            });
            return (
                <Card title={cardTitle} headStyle={{backgroundColor: '#ebedf0'}} className="card" key={cfg.name}>
                    {gridConent}
                    <Card.Grid className="cardGrid"><Icon type="plus" theme="outlined"/></Card.Grid>
                </Card>
            )
        });

        return (
            <div>
                <Button
                    onClick={() => {
                        this.handleTabConfigVisible(true)
                    }}>
                    新增Tab页
                </Button>
                <TabConfigModal
                    visible={this.state.tabConfigModalVisible}
                    onOk={this.handleTabConfigOk}
                    onCancel={this.handleTabConfigCancel}/>
                {
                    tableListContent
                }
                <div style={{textAlign: 'center', marginTop: '20px'}}>
                    <Button type="primary" style={{marginRight: '20px'}}>保存</Button>
                    <Button>取消</Button>
                </div>
            </div>
        );
    }
}