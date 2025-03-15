import React, { useMemo } from 'react';
import { Chart, Tooltip, Legend, Point, Line, Interval } from 'bizcharts';
import dayjs from 'dayjs';
import { Box } from '@mui/material';

const DoubleAxes = (props) => {
  const calculateChartWidth = (dataLength) => {
    const minWidth = 1080;
    const maxWidthPerData = 50;
    return Math.max(minWidth, dataLength * maxWidthPerData);
  };

  function processData(data: any, fromDate: string, toDate: string): any {
    const result: any = [];
    const from = dayjs(fromDate);
    const to = dayjs(toDate);

    let currentDate = from;

    // Chuyển đổi dữ liệu thành map để tra cứu nhanh
    const dataMap = new Map(data.map((item) => [item.date, item.totalClick]));

    // Lặp qua từng ngày trong khoảng thời gian
    while (currentDate.isBefore(to) || currentDate.isSame(to)) {
      const dateStr = currentDate.format('YYYY-MM-DD');

      // Nếu ngày đó không có trong dữ liệu, thêm vào với totalClick = 0
      result.push({
        date: dateStr,
        totalClick: dataMap.get(dateStr) || 0,
      });

      currentDate = currentDate.add(1, 'day'); // Tăng ngày lên 1
    }

    return result;
  }

  const data = useMemo(
    () =>
      processData(
        props?.data,
        props?.filterDate?.fromDate.format('YYYY-MM-DD'),
        props?.filterDate?.toDate.format('YYYY-MM-DD')
      ),
    [props?.data, props?.filterDate?.fromDate, props?.filterDate?.toDate]
  );

  const scale = {
    totalClick: {
      min: 0,
      tickCount: 4,
      alias: 'Total Clicks',
      type: 'linear-strict',
    },
  };

  const colors = ['#6394f9', '#89de2b'];

  let chartInstance: any = null;

  return (
    <Box
      sx={{
        maxWidth: '100%',
        overflowX: 'auto',
        padding: 2,
        border: '1px solid #ddd',
        scrollBehavior: 'smooth',
      }}
    >
      <Chart
        scale={scale}
        width={calculateChartWidth(data.length)}
        autoFit={data.length <= 10}
        height={400}
        data={data}
        onGetG2Instance={(chart) => {
          chartInstance = chart;
        }}
      >
        <Legend
          custom
          allowAllCanceled
          items={[
            {
              value: 'totalClick',
              name: 'Total Clicks',
              marker: {
                symbol: 'square',
                style: { fill: colors[1], r: 5 },
              },
            },
          ]}
          onChange={(ev) => {
            const { item }: any = ev;
            const value = item.value;
            const checked = !item.unchecked;
            const geometries = chartInstance?.geometries;

            geometries.forEach((geometry) => {
              if (geometry.getYScale().field === value) {
                if (checked) {
                  geometry.show();
                } else {
                  geometry.hide();
                }
              }
            });
          }}
        />
        <Tooltip shared />
        <Interval position="date*totalClick" color={colors[1]} />
        <Line
          position="date*totalClick"
          color={colors[0]}
          size={3}
          shape="smooth"
          label="totalClick"
        />
        <Point position="date*totalClick" color={colors[0]} size={3} shape="circle" />
      </Chart>
    </Box>
  );
};

export default DoubleAxes;
