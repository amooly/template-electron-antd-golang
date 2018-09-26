import React, {Component} from 'react';
import {Button, Checkbox, Col, Row} from 'antd';

export default class TableList extends Component {

    handleCheckedTables = (checkedTables) => {
        console.log('checked = ', checkedTables);
        this.props.onChange(checkedTables)
    };

    componentDidMount = () => {
        const tableList = this.props.table.tableList;
        let checkedTables = [];

        Object.keys(tableList).forEach((key) => {
            const table = tableList[key];
            console.log(table)
            if (table.checked) {
                checkedTables.push(key)
            }
        });

        this.handleCheckedTables(checkedTables)
    };

    handleAllSelectButton = () => {
        this.handleCheckedTables(Object.keys(this.props.table.tableList))
    };
    handleUnSelectButton = () => {
        this.handleCheckedTables([])
    };

    render() {
        const tableList = this.props.table.tableList;

        return (
            <div className="tableContent">
                <div className="optionGroup">
                    <Button disabled={this.props.checkedTables.length === Object.keys(tableList).length}
                            className="optionButton" onClick={this.handleAllSelectButton}>
                        全选
                    </Button>
                    <Button disabled={this.props.checkedTables.length === 0}
                            className="optionButton" onClick={this.handleUnSelectButton}>
                        全不选
                    </Button>
                </div>
                <Checkbox.Group className="checkboxGroup" onChange={this.handleCheckedTables}
                                value={this.props.checkedTables}>
                    <Row>
                        {
                            Object.keys(tableList).map((key) => {
                                const table = tableList[key];
                                return (
                                    <Col span={8} key={key} className="checkboxItem">
                                        <Checkbox value={key}>
                                            {table.name}
                                        </Checkbox>
                                    </Col>
                                )
                            })
                        }
                    </Row>
                </Checkbox.Group>
            </div>
        );
    }
}