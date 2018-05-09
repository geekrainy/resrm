/*
 * File: index.js
 * Project: redux-resrm
 * File Created: Wednesday, 9th May 2018 12:49:02 pm
 * Author: geekrainy (geekrainy@gmail.com)
 * -----
 * Last Modified: Wednesday, 9th May 2018 3:25:57 pm
 * Modified By: geekrainy (geekrainy@gmail.com>)
 * -----
 * Copyright - 2018 https://rainylog.com, https://github.com/geekrainy
 */

import React from 'react';
import { Radio, DatePicker, Select, Button, Icon, Input, Form, Row, Col } from 'antd';
import './index.css';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

// TODO: 所有动态列表项的 key 值没有管理

/* 
 * field 说明
 * field 定义表头搜索表单结构
 * 若 field 内需要定义内容项，则包含 content，例如 select 类型，则需要在 content 内定义各选项，flag 值给出默认或禁用值
 *
 */

const fields = [{
  name: 'invNumber',
  type: 'input',
  label: '招标书编号',
  key: 1
}, {
  name: 'invItem',
  type: 'input',
  label: '招标事项',
  key: 2
}, {
  name: 'invCrew',
  type: 'input',
  label: '招标员',
  key: 3
}, {
  name: 'invType',
  type: 'select',
  label: '招标类型',
  content: {
    options: [{
      value: 'agent',
      label: '代理招标',
      flag: 'disabled'
    }, {
      value: 'invite',
      label: '邀请招标',
      flag: 'default'
    }, {
      value: 'public',
      label: '公开招标'
    }]
  }
}, {
  name: 'invDate',
  type: 'date',
  label: '招标日期起止',
  content: {
    
  }
}, {
  name: 'invChoose',
  type: 'radio',
  label: '选项',
  content: {
    options: [{
      value: 'A',
      label: 'A'
    }, {
      value: 'B',
      label: 'B'
    }, {
      balue: 'C',
      label: 'C'
    }]
  }
}]


// 表格搜索头组件
class TableSearch extends React.Component {
  // const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
  state = {
    expand: false,
  }

  // 搜索
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('Received value of form: ', values);
    });
  }

  // 重置
  handleReset = () => {
    this.props.form.resetFields();
  }

  // 展开更多
  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  }

  // Form.Item，自动生成？
  getFields(fields) {
    const count = this.state.expand ? fields.length : 3; // 定义默认展示数目
    const { getFieldDecorator } = this.props.form;

    const children = fields.map((item, index) => {
      let fieldContent;
      switch(item.type) {
        case 'input':
          // 构造 Input 类型
          fieldContent = (
            <Input placeholder={item.placeholder} />
          )
          break;
        case 'select':
          // 筛选 option 中的默认值
          const defaultOption = item.content.options.filter((option) => {
            return option.flag === 'default'
          })[0].value;

          // 生成 Option 列表值
          const selectOption = item.content.options.map((option) => {
            return (
              /* 检测选项 flag 值，确认是否被禁用 */
              <Option value={option.value} disabled={option.flag === 'disabled' ? true : false}>{option.label}</Option>
            )
          })

          // 构造 Select 类型
          fieldContent = (
            <Select defaultValue={defaultOption}>
              {selectOption}
            </Select>
          )
          break;
        case 'date':
          // 构造日期选框
          fieldContent = (
            <RangePicker />
          )
          break;
        case 'radio':
          // 构造单选框
          fieldContent = (
            <RadioGroup options={item.content.options} />
          )
          break;
        default:
          // 默认输入框
          fieldContent = (
            <Input placeholder={item.placeholder} />
          )
      }

      return (
        <Col span={8} key={item.key} style={index < count ? { display: 'block' } : { display: 'none' }}>
          <FormItem label={item.label} style={{ marginLeft: 24 }}>
            {getFieldDecorator(item.name, {
              rules: [{ message: 'Please input value!' }],
            })}{fieldContent}
          </FormItem>
        </Col>
      )
    })

    return children;
  }
  
  render () {
    return (
      <Form
        className="table-search"
        onSubmit={this.handleSearch}
      >
        <Row gutter={24}>
          <Col span={18}>
            {this.getFields(fields)}
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
              重置
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.toggle}>
              更多 <Icon type={this.state.expand ? 'up' : 'down' } />
            </Button>
          </Col>

        </Row>

      </Form>
    )
  }
}

const WrappedTableSearch = Form.create()(TableSearch);

export default WrappedTableSearch;