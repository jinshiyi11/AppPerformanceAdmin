import React, { PureComponent } from 'react';
import { Table } from 'antd';
import reqwest from 'reqwest';

const PAGE_COUNT = 30;
class BlockInfoList extends PureComponent {
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
    title: '卡顿时长(ms)',
    dataIndex: 'blockTime',
    key: 'blockTime',
    width: 120,
  }, {
    title: '最近上报',
    dataIndex: 'insertTime',
    key: 'insertTime',
    width: 200,
  }, {
    title: '发生次数',
    dataIndex: 'occurCount',
    key: 'occurCount',
    width: 100,
  }, {
    title: '堆栈',
    dataIndex: 'stackTrace',
    key: 'stackTrace',
    render: (text, record) => {
      return (
      <a href={`/block/blockDetail?id=${record.id}`}>{this.trimStackTrace(text)}</a>
    )
    },
  }];

  componentDidMount() {
    this.fetch();
  }

  trimStackTrace(stack) {
    let stacks = stack.trim().split("\r\n");
    const len = stacks.length
    if(len > 5){
      stacks = stacks.slice(0,5)
    }

    let result = stacks.join("\r\n")
    if(len>5){
      result = `${result}...`
    }
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
      url: 'http://10.113.21.55/api/getBlockInfoList',
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

export default BlockInfoList;
