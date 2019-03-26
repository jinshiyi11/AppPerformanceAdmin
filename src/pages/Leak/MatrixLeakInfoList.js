import React, { PureComponent } from 'react';
import { Table } from 'antd';
import reqwest from 'reqwest';

const PAGE_COUNT = 10;
class MatrixLeakInfoList extends PureComponent {
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
    title: '泄漏的Activity',
    dataIndex: 'activity',
    key: 'activity',
    width: 220,
  }, {
    title: 'tag',
    dataIndex: 'tag',
    key: 'tag',
    width: 200,
  }, {
    title: 'process',
    dataIndex: 'process',
    key: 'process',
    width: 100,
  }, {
    title: '发生时间',
    dataIndex: 'time',
    key: 'time',
    render: (text, record) => {
      return (
        <div>{new Date(text * 1).toLocaleString()}</div>
      )
    },
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

  fetch = (params = {}) => {
    console.log('params:', params);
    this.setState({ loading: true });
    reqwest({
      url: 'http://10.113.21.105/api/getMatrixLeakInfoList',
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

export default MatrixLeakInfoList;
