import { Box, Typography } from '@mui/material';
import { Button, Card, message, Modal } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { CalendarFilled, CopyOutlined } from '@ant-design/icons';
import { Image } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { getIsShowModal, getShortLinkDetail } from '@/state/ducks/appData/selectors';
import * as PATH from '@/routes/routesConfig';

const ViewLinks = (props) => {
  const navigate = useNavigate();
  const [isShowModal, setIsShowModal] = useState(props?.getIsShowModal || false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!props?.getShortLinkDetail) {
      navigate(PATH.LINKS_PAGE);
    } else {
      setIsShowModal(props?.getIsShowModal);
    }
  }, [props?.getShortLinkDetail]);

  return (
    <Box className="py-6 px-2 md:px-20 w-full h-full">
      <Button type="text" onClick={() => navigate(PATH.LINKS_PAGE)} className="mb-4">
        Back to list
      </Button>
      <Card className="w-full">
        <Box className="flex items-start gap-3">
          <Box className="border rounded-full flex items-center justify-center p-2 w-[40px] ">
            {props?.getShortLinkDetail?.favicon ? (
              <Image
                preview={false}
                src={props?.getShortLinkDetail?.favicon}
                width={20}
                height={20}
              />
            ) : (
              <Image src="/thumbnail.png" preview={false} width={20} height={20} />
            )}
          </Box>
          <Box className="w-full">
            <Box className="flex items-center justify-between w-full">
              <Link to={props?.shortUrl} target="_blank">
                <Typography
                  sx={{
                    fontFamily: 'Nunito',
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                >
                  {props?.getShortLinkDetail?.title || 'Title'}
                </Typography>
              </Link>
              <Box>
                <Button
                  onClick={() => {
                    if (props?.getShortLinkDetail?.data?.fullShortUrl) {
                      navigator.clipboard
                        .writeText(props?.getShortLinkDetail?.data?.fullShortUrl)
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
              </Box>
            </Box>
            <Link to={props?.getShortLinkDetail?.data?.fullShortUrl} target="_blank">
              <Typography
                sx={{
                  fontFamily: 'Nunito',
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#0c3ebb',
                }}
              >
                {props?.getShortLinkDetail?.data?.fullShortUrl}
              </Typography>
            </Link>
            <Link to={props?.getShortLinkDetail?.data?.originUrl} target="_blank">
              <Typography
                sx={{
                  fontFamily: 'Nunito',
                  fontSize: 13,
                }}
              >
                {props?.getShortLinkDetail?.data?.originUrl}
              </Typography>
            </Link>
            <Box>
              <Typography
                sx={{
                  fontFamily: 'Nunito',
                  fontSize: 13,
                }}
              >
                <CalendarFilled />{' '}
                {moment(props?.getShortLinkDetail?.validDate).format('YYYY-MM-DD HH:mm:ss')}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Card>

      <Modal
        open={isShowModal}
        width={500}
        footer={null}
        onCancel={() => {
          setIsShowModal(false);
          dispatch({ type: 'HIDE_MODAL' });
        }}
      >
        <Box className="flex flex-col gap-3">
          <Typography
            sx={{
              fontFamily: 'Archivo Black',
              fontSize: 20,
            }}
          >
            Your link is ready! 🎉
          </Typography>

          <Typography
            sx={{
              fontFamily: 'Nunito',
              fontSize: 16,
            }}
          >
            Copy the link below to share it.
          </Typography>

          <Box
            className="px-5 py-10 bg-[#eef0f5] cursor-pointer rounded-xl flex justify-center items-center"
            onClick={() => {
              if (props?.getShortLinkDetail?.data?.fullShortUrl) {
                navigator.clipboard
                  .writeText(props?.getShortLinkDetail?.data.fullShortUrl)
                  .then(() => {
                    message.success('Copied to clipboard successfully');
                  })
                  .catch((err) => {
                    console.error('Failed to copy:', err);
                  });
              }
            }}
          >
            <Typography
              sx={{
                fontFamily: 'Archivo Black',
                color: '#89DE2B',
              }}
            >
              {props?.getShortLinkDetail?.data?.fullShortUrl}
            </Typography>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default connect((state: any) => ({
  getShortLinkDetail: getShortLinkDetail(state),
  getIsShowModal: getIsShowModal(state),
}))(ViewLinks);
