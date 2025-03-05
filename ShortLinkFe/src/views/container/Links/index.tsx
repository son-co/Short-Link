import { API_URL, JWT } from '@/configs';
import { getCookie } from '@/state/utils/session';
import { Box, Divider, Typography } from '@mui/material';
import { Button, Card, DatePicker, Dropdown, Image, message, Pagination } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarFilled, CopyOutlined, SignalFilled } from '@ant-design/icons';
import * as PATH from '@/routes/routesConfig';

const { RangePicker } = DatePicker;

const LinksPage = () => {
  const token = getCookie(JWT);
  const [listData, setListData] = useState<any>([]);
  const navigate = useNavigate();
  const [currentData, setCurrentData] = useState<any>([]);
  const [filterDate, setFilterDate] = useState({});
  const [needLoadData, setNeedLoadData] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // Số phần tử trên mỗi trang

  // Xác định dữ liệu của trang hiện tại
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const callApi = (url = '', params = {}, method = 'GET', setData?) => {
    // Kiểm tra nếu có params và là phương thức GET
    if (params && method === 'GET') {
      const queryString = new URLSearchParams(params).toString();
      url += `?${queryString}`;
    }

    fetch(url, {
      method, // Phương thức HTTP (GET, POST, PUT, DELETE, ...)
      headers: {
        'Content-Type': 'application/json', // Định dạng nội dung là JSON
        Authorization: `Bearer ${token}`,
      },
      body: method !== 'GET' && params ? JSON.stringify(params) : null, // Chỉ thêm body nếu không phải GET
    })
      .then((response) => {
        if (response.status === 401) {
          // Xử lý lỗi 401 Unauthorized
          navigate(PATH.DASHBOARD_PATH);
          throw new Error('Unauthorized: Please check your token or login again.');
        }
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then((res) => {
        setData && setData(res);
      })
      .catch((error) => {
        console.error('Error:', error); // Xử lý lỗi
      })
      .finally(() => {
        // setSpin(false);
      });
  };

  useEffect(() => {
    callApi(`${API_URL}/api/v1/admin/short-link/get-list`, filterDate, 'GET', setListData);
  }, [filterDate]);

  useEffect(() => {
    if (listData?.length > 0) {
      const dataSlice = listData?.slice(startIndex, endIndex);
      setCurrentData(dataSlice);
    }
  }, [listData, startIndex, endIndex]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRangeChange = (dates: any, dateStrings: [string, string]) => {
    if (dates && dates[0] && dates[1]) {
      setNeedLoadData(true);
      setFilterDate({
        validDateFrom: dates[0].toISOString(),
        validDateTo: dates[1].toISOString(),
      });
    }

    if (!dates) {
      setNeedLoadData(true);
    }
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    message.info('Click on left button.');
  };

  const handleMenuClick: any = (e) => {
    message.info('Click on menu item.');
    console.log('click', e);
  };

  // http://8.222.220.102:8103/api/v1/admin/short-link/get-list?id&domain&shortUri&fullShortUrl&originUrl&validDateFrom&validDateTo

  const items: any = [
    {
      label: 'Domain',
      key: '1',
      icon: '',
    },
    {
      label: 'Short Uri',
      key: '2',
      icon: '',
    },
    {
      label: 'Short Url',
      key: '3',
      icon: '',
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <Box
      className="py-6 px-2 sm:px-5 xl:px-20 w-full "
      sx={{
        '.ant-card-body': {
          padding: '16px',
        },
      }}
    >
      <Box className="flex justify-between items-center mb-2 w-full">
        <Typography
          sx={{
            fontFamily: 'Archivo Black',
          }}
        >
          Short Links
        </Typography>
        <Button
          type="primary"
          style={{
            background: '#050D10',
          }}
          onClick={() => navigate(PATH.ADD_LINKS_PAGE)}
        >
          Create a link
        </Button>
      </Box>
      <Divider className="py-2" />
      <Box className="my-5 flex justify-between gap-5 w-full">
        <RangePicker format={'DD/MM/YYYY'} onChange={handleRangeChange} />

        <Box className="inline-block">
          <Dropdown.Button menu={menuProps} onClick={handleButtonClick}>
            Filter
          </Dropdown.Button>
        </Box>
      </Box>
      <Box className="h-full w-full flex flex-col gap-2">
        {currentData?.length > 0 ? (
          <>
            {currentData?.map((it, index) => (
              // Thay đổi cấu trúc Box chứa content
              <Card key={index} className="w-full">
                <Box className="border sm:hidden rounded-full flex items-center justify-center p-2 w-[40px] flex-shrink-0">
                  {it.favicon ? (
                    <Image preview={false} src={it.favicon} width={20} height={20} />
                  ) : (
                    <Image src="/thumbnail.png" preview={false} width={20} height={20} />
                  )}
                </Box>
                <Box className="flex items-start gap-3 w-full">
                  {/* Box avatar giữ nguyên */}
                  <Box className="border hidden rounded-full sm:flex items-center justify-center p-2 w-[40px] flex-shrink-0">
                    {it.favicon ? (
                      <Image preview={false} src={it.favicon} width={20} height={20} />
                    ) : (
                      <Image src="/thumbnail.png" preview={false} width={20} height={20} />
                    )}
                  </Box>

                  {/* Box content chính - thêm flex-1 và min-width-0 để handle text overflow */}
                  <Box className="flex-1 min-w-0">
                    <Box className="flex items-center justify-between w-full">
                      <Link to={it?.shortUrl} target="_blank" className="w-full">
                        <Typography
                          sx={{
                            fontFamily: 'Nunito',
                            fontSize: 16,
                            fontWeight: 700,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {it?.title || 'Title'}
                        </Typography>
                      </Link>
                    </Box>
                    <Box className="w-full">
                      <Link to={it?.fullShortUrl} target="_blank" className="block">
                        <Typography
                          sx={{
                            fontFamily: 'Nunito',
                            fontSize: 16,
                            fontWeight: 700,
                            color: '#0c3ebb',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {it?.fullShortUrl}
                        </Typography>
                      </Link>
                      <Link to={it?.originUrl} target="_blank" className="block">
                        <Typography
                          sx={{
                            fontFamily: 'Nunito',
                            fontSize: 13,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {it?.originUrl}
                        </Typography>
                      </Link>
                    </Box>
                    <Box className="flex items-center gap-3">
                      <Typography
                        sx={{
                          fontFamily: 'Nunito',
                          fontSize: 13,
                        }}
                      >
                        <CalendarFilled /> {moment(it?.validDate).format('MMM DD, YYYY')}
                      </Typography>

                      {/* <Typography
                        sx={{
                          fontFamily: 'Nunito',
                          fontSize: 13,
                        }}
                      >
                        <SignalFilled /> {it?.totalClick || 0} Clicks
                      </Typography> */}
                    </Box>
                  </Box>

                  {/* Box button copy - thêm flex-shrink-0 */}
                  <Box className="flex-shrink-0 hidden sm:flex flex-col justify-between gap-2">
                    <Button
                      onClick={() => {
                        if (it?.fullShortUrl) {
                          navigator.clipboard
                            .writeText(it.fullShortUrl)
                            .then(() => {
                              message.success('Copied to clipboard successfully');
                            })
                            .catch((err) => {
                              console.error('Failed to copy:', err);
                            });
                        }
                      }}
                    >
                      <CopyOutlined /> Copy
                    </Button>
                    <Box className="border rounded-md p-1 flex justify-center flex-col items-center">
                      Number Of Clicks
                      <Typography
                        sx={{
                          fontFamily: 'Nunito',
                          fontSize: 13,
                          display: 'flex',
                          gap: '5px',
                          justifyContent: 'between',
                          alignItems: 'center',
                        }}
                      >
                        <img src="/icons/click.svg" width={15} /> {it?.totalClick || 0}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box className="flex-shrink-0 block sm:hidden">
                  <Divider
                    sx={{
                      margin: '8px 0',
                    }}
                  />
                  <Box className="flex items-center gap-3">
                    <Button
                      onClick={() => {
                        if (it?.fullShortUrl) {
                          navigator.clipboard
                            .writeText(it.fullShortUrl)
                            .then(() => {
                              message.success('Copied to clipboard successfully');
                            })
                            .catch((err) => {
                              console.error('Failed to copy:', err);
                            });
                        }
                      }}
                    >
                      <CopyOutlined /> Copy
                    </Button>

                    <Box className="border rounded-md p-1 flex justify-center divide-x-2 gap-2">
                      <Typography>Number Of Clicks</Typography>
                      <Typography
                        sx={{
                          fontFamily: 'Nunito',
                          fontSize: 13,
                          display: 'flex',
                          gap: '5px',
                          justifyContent: 'between',
                          alignItems: 'center',
                        }}
                      >
                        <img src="/icons/click.svg" width={15} /> {it?.totalClick || 0}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Card>
            ))}
            <Box className="flex justify-end">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={listData.length}
                onChange={handlePageChange}
                style={{ marginTop: '20px', textAlign: 'center' }}
              />
            </Box>
          </>
        ) : (
          <Box className="flex justify-center">
            <Image src="/no_data.jpg" preview={false} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default LinksPage;
