import { API_URL, JWT } from '@/configs';
import { getCookie } from '@/state/utils/session';
import { Box, Divider, InputBase, Typography } from '@mui/material';
import {
  Button,
  Card,
  DatePicker,
  Dropdown,
  Image,
  Input,
  message,
  Pagination,
  Select,
  Spin,
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CalendarFilled,
  CopyOutlined,
  EyeFilled,
  EyeInvisibleFilled,
  GlobalOutlined,
  SignalFilled,
} from '@ant-design/icons';
import * as PATH from '@/routes/routesConfig';
import fetchApi from '../Groups/fetch';

const { RangePicker } = DatePicker;

const LinksPage = () => {
  const token = getCookie(JWT);
  const [listData, setListData] = useState<any>([]);
  const navigate = useNavigate();
  const [currentData, setCurrentData] = useState<any>([]);
  const [needLoadData, setNeedLoadData] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // Số phần tử trên mỗi trang
  const [spin, setSpin] = useState(false);
  const [filterDate, setFilterDate] = useState({});
  const [searchValue, setSearchValue] = useState<any>({});
  const [isFilter, setIsFilter] = useState(true);
  const [isClearFilter, setIsClearFilter] = useState(false);
  const [isOpenDropDown, setIsOpenDropDown] = useState(false);
  const [groupData, setGroupData] = useState<any>([]);

  // Xác định dữ liệu của trang hiện tại
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const callApi = (url = '', params = {}, method = 'GET', setData?) => {
    setSpin(true);

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
          navigate(PATH.LOGIN_PATH);
          throw new Error('Unauthorized: Please check your token or login again.');
        }
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then((res) => {
        setSpin(false);
        setData && setData(res);
      })
      .catch((error) => {
        console.error('Error:', error); // Xử lý lỗi
      })
      .finally(() => {
        setSpin(false);
        setIsFilter(false);
        setIsClearFilter(false);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchApi({
        url: `${API_URL}/api/v1/admin/group-link/get-list`,
        method: 'GET',
        isToken: true,
      });
      setGroupData(data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    isFilter &&
      callApi(
        `${API_URL}/api/v1/admin/short-link/get-list`,
        isClearFilter ? filterDate : { ...filterDate, ...searchValue },
        'GET',
        setListData
      );
  }, [filterDate, isFilter, isClearFilter, needLoadData]);

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

  // http://8.222.220.102:8103/api/v1/admin/short-link/get-list?id&domain&shortUri&fullShortUrl&originUrl&validDateFrom&validDateTo

  const overlayContent = (
    <Box
      className="flex flex-col gap-3 p-4 bg-white shadow-lg rounded-md"
      sx={{
        '.ant-picker': {
          height: '36px !important',
        },
      }}
    >
      {/* Title Input */}
      <Box className="flex flex-col ">
        <span>Title</span>
        <Input
          allowClear
          style={{ width: '100%' }}
          onClick={(e) => e.stopPropagation()}
          className="rounded-md"
          placeholder="Enter title"
          value={searchValue?.title}
          onChange={(event) =>
            setSearchValue((prev) => ({
              ...prev,
              title: event?.target?.value,
            }))
          }
        />
      </Box>

      <Box className="flex flex-col">
        <span>Title User Created</span>
        <Input
          allowClear
          style={{ width: '100%' }}
          onClick={(e) => e.stopPropagation()}
          className="rounded-md"
          value={searchValue?.titleUserCreated}
          placeholder="Enter title"
          onChange={(event) =>
            setSearchValue((prev) => ({
              ...prev,
              titleUserCreated: event?.target?.value,
            }))
          }
        />
      </Box>

      {/* Date Picker */}
      <Box className="flex flex-col">
        <span>Date</span>
        <DatePicker
          onChange={(event) => {
            setSearchValue((prev: any) => {
              if (!event) {
                const { validDateTo, validDateFrom, ...rest } = prev; // Loại bỏ 2 key
                return rest;
              }
              return {
                ...prev,
                validDateTo: event.toISOString(),
                validDateFrom: event.toISOString(),
              };
            });
          }}
          style={{ width: '100%' }}
          onClick={(e) => e.stopPropagation()}
        />
      </Box>

      <Box className="flex flex-col">
        <span>Groups</span>
        <Select
          onChange={(e) => {
            setSearchValue((prev) => ({
              ...prev,
              groupId: e,
            }));
          }}
          placeholder="Choose group"
          value={searchValue?.groupId}
          className="rounded-md h-[36px]"
          options={groupData?.map((it) => ({
            label: it?.groupName,
            value: it?.id,
          }))}
        ></Select>
      </Box>

      {/* Filter Button */}
      <Box className="w-full flex gap-3">
        <Button
          type="primary"
          onClick={() => {
            setIsFilter(true);
            setIsOpenDropDown(false);
          }}
        >
          Filter
        </Button>

        <Button
          onClick={() => {
            setSearchValue({});
            setIsFilter(true);
            setIsOpenDropDown(false);
            setIsClearFilter(true);
          }}
        >
          Clear
        </Button>
        <Button
          type="text"
          variant="dashed"
          onClick={() => {
            setIsOpenDropDown(false);
          }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );

  const handleAccessLink = (isAccess, shortUri) => {
    callApi(`${API_URL}/api/v1/admin/update-state-short-url/${isAccess}/${shortUri}`, {}, 'PUT');
    setIsFilter(true);
    setNeedLoadData(!needLoadData);
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

        <Dropdown overlay={overlayContent} open={isOpenDropDown} trigger={['click']}>
          <Button onClick={() => setIsOpenDropDown(true)}>Filter</Button>
        </Dropdown>
      </Box>
      <Spin spinning={spin}>
        <Box className="h-full w-full flex flex-col gap-2">
          {currentData?.length > 0 ? (
            <>
              {currentData?.map((it, index) => (
                // Thay đổi cấu trúc Box chứa content
                <Card key={index} className="w-full">
                  <Box className="flex gap-3">
                    <Box className="border sm:hidden rounded-full flex items-center justify-center p-2 w-[40px] flex-shrink-0">
                      {it.favicon ? (
                        <Image preview={false} src={it.favicon} width={20} height={20} />
                      ) : (
                        <Image src="/thumbnail.png" preview={false} width={20} height={20} />
                      )}
                    </Box>
                    <Box className="flex sm:hidden items-center justify-between w-full">
                      <Link to={it?.shortUrl} target="_blank" className="w-full">
                        <Typography
                          sx={{
                            fontFamily: 'Nunito',
                            fontSize: 18,
                            fontWeight: 700,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            color: '#89de2b',
                          }}
                        >
                          {it?.titleUserCreated || 'Title'}
                        </Typography>
                      </Link>
                    </Box>
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
                      <Box className=" hidden md:flex items-center justify-between w-full">
                        <Link to={it?.shortUrl} target="_blank" className="w-full">
                          <Typography
                            sx={{
                              fontFamily: 'Nunito',
                              fontSize: 18,
                              fontWeight: 700,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              color: '#89de2b',
                            }}
                          >
                            {it?.titleUserCreated || 'Title'}
                          </Typography>
                        </Link>
                      </Box>
                      <Box className="flex items-center justify-between w-full">
                        <Link to={it?.shortUrl} target="_blank" className="w-full">
                          <Typography
                            sx={{
                              fontFamily: 'Nunito',
                              fontSize: 14,
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
                      <Box className="flex flex-col lg:flex-row lg:items-center md:gap-3">
                        <Typography
                          sx={{
                            fontFamily: 'Nunito',
                            fontSize: 13,
                          }}
                        >
                          <CalendarFilled /> {moment(it?.validDate).format('YYYY-MM-DD HH:mm:ss')}
                        </Typography>{' '}
                        <Typography
                          sx={{
                            fontFamily: 'Nunito',
                            fontSize: 13,
                          }}
                        >
                          Total short link extra: {it?.totalShortLinkExtra}
                        </Typography>
                        <Button
                          type="text"
                          onClick={() =>
                            handleAccessLink(
                              it?.isAccess === null || it?.isAccess === undefined
                                ? true
                                : !it?.isAccess,
                              it?.shortUri
                            )
                          }
                        >
                          {it?.isAccess ? (
                            <>
                              <EyeInvisibleFilled /> Hidden
                            </>
                          ) : (
                            <>
                              <EyeFilled /> Show
                            </>
                          )}
                        </Button>
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
                          if (
                            it?.fullShortUrl &&
                            typeof navigator !== 'undefined' &&
                            navigator.clipboard
                          ) {
                            navigator.clipboard
                              .writeText(it?.fullShortUrl)
                              .then(() => {
                                message.success('Copied to clipboard successfully');
                              })
                              .catch((err) => {
                                console.error('Failed to copy:', err);
                              });
                          } else if (it?.fullShortUrl) {
                            // Fallback method if clipboard API is not available
                            try {
                              const textarea = document.createElement('textarea');
                              textarea.value = it?.fullShortUrl;
                              textarea.style.position = 'fixed'; // Prevent scrolling to bottom
                              document.body.appendChild(textarea);
                              textarea.focus();
                              textarea.select();
                              const successful = document.execCommand('copy');
                              document.body.removeChild(textarea);
                              if (successful) {
                                message.success('Copied to clipboard successfully');
                              } else {
                                console.error('Copy command was unsuccessful');
                              }
                            } catch (err) {
                              console.error('Failed to copy with fallback:', err);
                            }
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
                          if (
                            it?.fullShortUrl &&
                            typeof navigator !== 'undefined' &&
                            navigator.clipboard
                          ) {
                            navigator.clipboard
                              .writeText(it?.fullShortUrl)
                              .then(() => {
                                message.success('Copied to clipboard successfully');
                              })
                              .catch((err) => {
                                console.error('Failed to copy:', err);
                              });
                          } else if (it?.fullShortUrl) {
                            // Fallback method if clipboard API is not available
                            try {
                              const textarea = document.createElement('textarea');
                              textarea.value = it?.fullShortUrl;
                              textarea.style.position = 'fixed'; // Prevent scrolling to bottom
                              document.body.appendChild(textarea);
                              textarea.focus();
                              textarea.select();
                              const successful = document.execCommand('copy');
                              document.body.removeChild(textarea);
                              if (successful) {
                                message.success('Copied to clipboard successfully');
                              } else {
                                console.error('Copy command was unsuccessful');
                              }
                            } catch (err) {
                              console.error('Failed to copy with fallback:', err);
                            }
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
              {/* <Image src="/no_data.jpg" preview={false} /> */}
              No data to display
            </Box>
          )}
        </Box>
      </Spin>
    </Box>
  );
};

export default LinksPage;
