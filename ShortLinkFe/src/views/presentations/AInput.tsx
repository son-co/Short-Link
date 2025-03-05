import { Box, Typography } from '@mui/material';
import { Form, Input } from 'antd';
import React from 'react';

const AInput = (props) => {
  const { addonBeforeWidth, addonAfterWidth, rules, require, message, ...rest } = props;
  return (
    <Box
      className="w-full"
      sx={{
        '.ant-input-affix-wrapper-lg': {
          padding: '0',
        },
        '.ant-input-group-addon:nth-of-type(1)': {
          minWidth: addonBeforeWidth || '50px',
          background: '#fff',
          padding: '0px',
        },
        '.ant-input-group-addon:nth-of-type(2)': {
          maxWidth: addonAfterWidth || '50px',
          background: '#fff',
          padding: '0px',
        },
        '.ant-input': {
          borderBottomRightRadius: '4px',
          borderTopRightRadius: '4px',
          height: '32px',
          borderRadius: '4px',
        },
        '.ant-input-affix-wrapper': {
          padding: '0 8px !important',
        },
        '.ant-input:focus': {
          border: 'none',
          outline: 'none',
        },
        'input:focus': {
          outline: 'none',
          border: 'none',
        },
        // display: 'flex',
        // width: '100%',
      }}
    >
      {props.label && (
        <>
          <Typography sx={{ marginBottom: '12px', whiteSpace: 'nowrap' }}>
            {require && (
              <span className="mr-1" style={{ color: 'red', fontWeight: 'bold' }}>
                *
              </span>
            )}
            {props.label}
          </Typography>
        </>
      )}

      <Form.Item
        className="w-full"
        name={props.name || 'input'}
        rules={rules || [{ required: require || false, message: message || 'Field is required' }]}
      >
        <Input //
          showCount={props.showCount || false}
          maxLength={props.maxLength || 999999999}
          size={props.size || 'large'}
          addonBefore={props.addonBefore || false}
          placeholder={props.placeholder || 'Enter your data'}
          addonAfter={props.addonAfter || false}
          value={props?.value || ''}
          {...rest}
        />
      </Form.Item>
    </Box>
  );
};

export default AInput;
