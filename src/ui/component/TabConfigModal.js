import React, {Component} from 'react';
import {Form, Input, Modal} from 'antd';

const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 12}
};

export default class TabConfigModal extends Component {

    handleOk = () => {
        this.props.onOk();
    };

    handleCancel = () => {
        this.props.onCancel();
    };

    render() {
        return (
            <div>
                <Modal
                    title="Tab配置"
                    visible={this.props.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <FormItem
                        {...formItemLayout}
                        label="Key">
                        <Input/>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="Tab名称">
                        <Input/>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="默认字段名">
                        <Input/>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="默认库名">
                        <Input/>
                    </FormItem>
                </Modal>
            </div>
        );
    }

};