/*
 * File: index.js
 * Project: redux-resrm
 * File Created: Wednesday, 9th May 2018 12:51:06 pm
 * Author: geekrainy (geekrainy@gmail.com)
 * -----
 * Last Modified: Wednesday, 9th May 2018 12:51:09 pm
 * Modified By: geekrainy (geekrainy@gmail.com>)
 * -----
 * Copyright - 2018 https://rainylog.com, https://github.com/geekrainy
 */

import React from 'react';
import { Table, Button, Icon, Input, Checkbox, Form, Row, Col } from 'antd';
import './index.css';
import WrappedTableSearch from '../tablesearch';
const FormItem = Form.Item;


class EditableCell extends React.Component {
  state = {
    type: this.props.type,
    value: this.props.value,
    checked: this.props.checked || '',
    editable: false
  }

  handleChange = (e) => {
    const value = e.target.value;
    this.setState({ value });
  }

  handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    console.log(e.target.checked)
    this.setState({ checked });
  }

  check = () => {
    this.setState({ editable: false });
    if (this.props.onChange) {
      this.props.onChange(this.props.value);
    }
  }

  edit = () => {
    this.setState({ editable: true })
  }

  render () {
    const { type, value, editable, checked } = this.state;
    // 根据不同类型返回相应的 table cell
    switch(type) {
      case 'input':
        var cell = editable ?
        (
          <div className="editable-cell-input-wrapper">
            <Input
              value={value}
              onChange={this.handleChange}
              onPressEnter={this.check}
            />
            <Icon
              type="check"
              className="editable-cell-icon-check"
              onClick={this.check}
            />
          </div>
        )
        :
        (
          <div className="editable-cell-text-wrapper">
            {value || ''}
            <Icon
              type="edit"
              className="editable-cell-icon"
              onClick={this.edit}
            />
          </div>
        )
        break;

      case 'checkbox':
        var cell = editable ?
        (
          <div className="editable-cell-checkbox-wrapper">
            <Checkbox
              onChange={this.handleCheckboxChange}
            >
              Checkbox
            </Checkbox>
            <Icon
              type="check"
              className="editable-cell-icon-check"
              onClick={this.check}
            />
          </div>
        )
        :
        (
          <div className="editable-cell-checkbox-wrapper">
              <Checkbox
                onChange={this.handleCheckboxChange}
                disabled
              >
                Checkbox
              </Checkbox>
              <Icon
                type="edit"
                className="editable-cell-icon"
                onClick={this.edit}
              />
          </div>
        )
        break;
      default:
        var cell = (
          <div className="editable-cell-text-wrapper">
            {value || ''}
            <Icon
              type="edit"
              className="editable-cell-icon"
              onClick={this.edit}
            />
          </div>
        )
        break;
    }
      
    return (
      <div className="editable-cell">
        {cell}
      </div>
    )
  }


}

class SrmTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => (
        <EditableCell
          value={text}
          onChange={this.onCellChange(record.key, 'status')}
          type='input'
        />
      )
    }, {
      title: '招标书编号',
      dataIndex: 'id',
      key: 'id',
      filterDropdown: (
        <div className="custom-filter-dropdown">
          <Input
            ref={ele => this.searchInput = ele}
            placeholder="搜索招标书编号"
            defaultValue={this.state.searchText}
            onChange={this.onInputChange}
            onPressEnter={this.onSearch}
          />
          <Button type="primary" onClick={this.onSearch}>Search</Button>
        </div>
      ),
      filterIcon: <Icon type="smile-o" stylue={{ color: this.state.filtered ? '#108ee9' : '#aaa' }} />,
      filterDropdownVisible: this.state.filterDropdownVisible,
      onFilterDropdownVisibleChange: (visible) => {
        this.setState({
          filterDropdownVisible: visible,
        }, () => this.searchInput && this.searchInput.focus());
      },
      render: (text, record) => <a href="javascript:;">{record.id}</a>
    }, {
      title: '选中',
      dataIndex: 'check',
      key: 'check',
      render: (check, record) => (
        <EditableCell
          onChange={this.onCellChange(record.key, 'check')}
          type='checkbox'
        />
      )
    }, {
      title: '链接',
      dataIndex: 'link',
      key: 'link',
      render: (check, record) => <a href="javascript:;">{record.link}</a>
    }];
    
  }

  state = {
    filterDropdownVisible: false,
    searchText: '',
    filtered: false,
    selectedRowKeys: [],
    loading: false,
    dataSource: [{
      key: '1',
      id: 'dsklajfkdsf',
      status: '新建',
      check: 'true',
      link: 'test',
    }, {
      key: '2',
      id: 'dksaljfkdjg',
      status: '新建',
      check: 'true',
      link: 'test',
    }],
  }

  start = () => {
    this.setState({loading: true});

    // ajax
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      });
    }, 1000);
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys })
  }

  onCellChange = (key, dataIndex) => {
    return (value) => {
      const dataSource = [...this.state.dataSource];
      const target = dataSource.find(item => item.key === key);
      if (target) {
        target[dataIndex] = value;
        this.setState({ dataSource });
      }
    }
  }

  onInputChange = (e) => {
    this.setState({ searchText: e.target.value });
  }
  
  onSearch = () => {
    const { searchText } = this.state;
    const dataSource = [...this.state.dataSource];
    const reg = new RegExp(searchText, 'gi');
    this.setState({
      filterDropdownVisible: false,
      filtered: !!searchText,
      dataSource: dataSource.map((record) => {
        const match = record.id.match(reg);
        if (!match) {
          return null;
        }
        return {
          ...record,
          id: (
            <span>
              {record.id.split(reg).map((text, i) => (
                i > 0 ? [<span className="highlight">{match[0]}</span>, text] : text
              ))}
            </span>
          ),
        };
      }).filter(record => !!record)
    });
  }

  render () {
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    const { dataSource } = this.state;
    const columns = this.columns;

    return (
      <div>
        <WrappedTableSearch />
        <Button
          type="primary"
          onClick={this.start}
          disabled={!hasSelected}
          loading={loading}
        >
          Reload
        </Button>

        <Table rowSelection={rowSelection} dataSource={dataSource} columns={columns} />
      </div>
    )
  }
}

export default SrmTable;
