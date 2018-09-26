import React, {Component} from 'react';
import {Button, Checkbox, Form, Input} from 'antd';

export default class SearchBar extends Component {

    render() {
        return (
            <Form layout="inline" className="searchBar">
                <Form.Item>
                    <Input placeholder="输入单号" style={{width: '300px'}} value={this.props.orderNo}
                           onChange={(e) => {
                               this.props.onChange({
                                   orderNo: e.target.value,
                               })
                           }}/>
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit"
                            type="primary"
                            icon="rocket"
                            onClick={this.props.onSubmit}>
                        生成SQL
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Checkbox checked={this.props.showDbIndex}
                              onChange={(e) => {
                                  console.log(e.target.checked)
                                  this.props.onChange({
                                      showDbIndex: e.target.checked
                                  })
                              }}>
                        库名
                    </Checkbox>
                </Form.Item>
            </Form>
        );
    }
}