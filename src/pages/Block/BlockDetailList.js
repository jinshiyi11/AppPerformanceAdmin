import React, { PureComponent } from 'react';
import { Table } from 'antd';
import reqwest from 'reqwest';

const PAGE_COUNT = 10;
class BlockDetailList extends PureComponent {
  state = {
    data: [],
    pagination: {defaultPageSize: PAGE_COUNT},
    loading: false,
  };

  columns = [{
    title: '卡顿时长(ms)',
    dataIndex: 'blockTime',
    key: 'blockTime',
    width: 120,
  }, {
    title: '版本',
    dataIndex: 'versionCode',
    key: 'versionCode',
    width: 120,
  }, {
    title: '上报时间',
    dataIndex: 'insertTime',
    key: 'insertTime',
    width: 200,
  }, {
    title: '设备',
    dataIndex: 'model',
    key: 'model',
    width: 100,
  }, {
    title: '系统版本',
    dataIndex: 'os',
    key: 'os',
    width: 100,
  }];

  componentDidMount() {
    this.fetch();
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

  fetch = (params = {id: this.props.location.query.id}) => {
    console.log('params:', params);
    this.setState({ loading: true });
    reqwest({
      url: 'http://10.113.21.105/api/getBlockDetailList',
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

  renderStackTrace = (record) => {
    const stack = record.stackTrace
    return stack.trim().split("\r\n").map((item, i) => {
      return <span style={{display: 'block'}} key={i}>{item}</span>;
    });
  }

  render() {
    return (
      <Table
        columns={this.columns}
        dataSource={this.state.data}
        pagination={this.state.pagination}
        loading={this.state.loading}
        onChange={this.handleTableChange}
        expandedRowRender={record => this.renderStackTrace(record)}
      />
    );
  }

}

export default BlockDetailList;
