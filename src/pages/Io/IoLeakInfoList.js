import React, { PureComponent } from 'react';
import { Table } from 'antd';
import reqwest from 'reqwest';
import moment from 'moment';
import Const from '../Const';

const PAGE_COUNT = 10;
// var moment = require('moment');
class IoLeakInfoList extends PureComponent {
  state = {
    data: [],
    pagination: {defaultPageSize: PAGE_COUNT},
    loading: false,
  };

  columns = [{
    title: 'id',
    dataIndex: 'id',
    key: 'id',
    width: 100,
    render: text => <a href="javascript:;">{text}</a>,
  }, {
    title: 'leak信息',
    dataIndex: 'stack',
    key: 'stack',
    width: 300,
    render: (text, record) => {
      return (
        <a>{this.trimStackTrace(text)}</a>
      )
    }
  }, {
    title: '上报时间',
    dataIndex: 'insertTime',
    key: 'insertTime',
    width: 200,
    render: (text, record) => {
      return (
        <div>{moment(text * 1).format('YYYY-MM-DD HH:mm:ss')}</div>
      )
    }
  }];

  componentDidMount() {
    this.fetch();
  }

  trimStackTrace(stack) {
    // let stacks = stack.trim().split("\r\n");
    // const len = stacks.length
    // if(len > 5){
    //   stacks = stacks.slice(0,5)
    // }

    // let result = stacks.join("\r\n")
    // if(len>5){
    //   result = `${result}\r\n...`
    // }

    const result = stack.split("\n").map((item, i) => {
      return <span style={{display: 'block'}} key={i}>{item}</span>;
    });
    return result
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetch({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });
  };

  fetch = (params = {}) => {
    console.log('params:', params);
    this.setState({ loading: true });
    reqwest({
      url: `${Const.HOST}/api/getIoLeakInfoList`,
      method: 'get',
      data: {
        results: 10,
        ...params,
      },
      type: 'json',
    }).then((data) => {
      const pagination = { ...this.state.pagination };
      pagination.total = data.data.total;
      this.setState({
        loading: false,
        data: data.data.data,
        pagination,
      });
    });
  };

  render() {
    return (
      <Table
        columns={this.columns}
        dataSource={this.state.data}
        pagination={this.state.pagination}
        loading={this.state.loading}
        onChange={this.handleTableChange}
      />
    );
  }

}

export default IoLeakInfoList;
