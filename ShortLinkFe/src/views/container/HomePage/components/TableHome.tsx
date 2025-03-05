import React, { useState } from 'react';
import { Divider, Radio, Table } from 'antd';
import { TableColumnsType, TableProps, Pagination } from 'antd';
import { Box } from '@mui/material';

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: '短链接信息',
    dataIndex: 'name',
    width: 300,
    render: (text: string) => <a>{text}</a>,
  },
  {
    title: '短链接网址',
    dataIndex: 'age',
    width: 200,
  },
  {
    title: '访问次数',
    width: 120,
    dataIndex: 'address',
  },
  {
    title: '访问人数',
    dataIndex: 'name1',
    width: 120,
    render: (text: string) => <a>{text}</a>,
  },
  {
    title: 'IP数',
    dataIndex: 'age',
    width: 120,
  },
  {
    title: '操作',
    dataIndex: 'address',
    fixed: 'right',
    width: 180,
  },
];

// rowSelection object indicates the need for row selection
const rowSelection: TableProps<DataType>['rowSelection'] = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: (record: DataType) => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  }),
};

const TableHome = () => {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Handle page change
  const handlePageChange = (page: number, pageSize: number) => {
    setCurrent(page);
    setPageSize(pageSize);
  };
  return (
    <Box
      sx={{
        '.ant-table-content::WebkitScrollbar': {
          display: 'none',
        },
        '.ant-table-content': {
          scrollbarWidth: 'thin',
          scrollbarColor: '#eaeaea transparent',
          scrollbarGutter: 'stable',
        },
        '.ant-table-expanded-row-fixed': {
          height: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
      }}
    >
      <Table<DataType>
        rowSelection={{ type: 'checkbox', ...rowSelection }}
        columns={columns}
        dataSource={[]}
        scroll={{ x: 'max-content' }}
        locale={{
          emptyText: ' 暂无链接', // Custom "No Data" message
        }}
      />
      <Box className="flex justify-center py-5">
        <Pagination
          current={current}
          pageSize={pageSize}
          total={0} // You can set this to the total number of records
          onChange={handlePageChange}
          showSizeChanger
          pageSizeOptions={['10', '20', '30']}
          showTotal={(total) => `Total ${total} items`}
        />
      </Box>
    </Box>
  );
};

export default TableHome;
