import React, { useMemo } from 'react';
import { Chart, Line, Point, Tooltip } from 'bizcharts';
import { Box } from '@mui/material';
import { Image, Typography } from 'antd';
import dayjs from 'dayjs';

function ChartStatistic(props) {
  const calculateChartWidth = (dataLength) => {
    const minWidth = 700;
    const maxWidthPerData = 50;
    return Math.max(minWidth, dataLength * maxWidthPerData);
  };

  const processData = (apiData: { date: string; totalClick: number }[]) => {
    if (!apiData || !props?.filterDate?.fromDate || !props?.filterDate?.toDate) {
      return [];
    }

    // Convert to dayjs objects for comparison
    const processedData = apiData.map((item) => ({
      ...item,
      date: dayjs(item.date),
    }));

    // Add start date if missing
    const hasFromDate = processedData.some((item) =>
      item.date.isSame(dayjs(props.filterDate.fromDate), 'day')
    );
    if (!hasFromDate) {
      processedData.unshift({
        date: dayjs(props.filterDate.fromDate),
        totalClick: 0,
      });
    }

    // Add end date if missing
    const hasToDate = processedData.some((item) =>
      item.date.isSame(dayjs(props.filterDate.toDate), 'day')
    );
    if (!hasToDate) {
      processedData.push({
        date: dayjs(props.filterDate.toDate),
        totalClick: 0,
      });
    }

    // Sort by date and convert back to string format
    return processedData
      .sort((a, b) => a.date.valueOf() - b.date.valueOf())
      .map((item) => ({
        ...item,
        date: item.date.format('YYYY-MM-DD'),
      }));
  };

  const processedData = useMemo(
    () => processData(props?.data),
    [props?.data, props?.filterDate?.fromDate, props?.filterDate?.toDate]
  );

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
      {processedData.length > 0 ? (
        <Chart
          key={`${props?.filterDate?.fromDate}-${props?.filterDate?.toDate}`}
          appendPadding={[10, 0, 0, 10]}
          width={calculateChartWidth(processedData.length)}
          autoFit={processedData.length <= 10}
          height={285}
          data={processedData}
          scale={{
            totalClick: {
              min: 0,
              type: 'linear',
              nice: true,
            },
            date: {
              type: 'time',
              range: [0, 1],
            },
          }}
        >
          <Line position="date*totalClick" size={2} shape="smooth" />
          <Point position="date*totalClick" size={4} />
          <Tooltip
            showCrosshairs
            follow={false}
            crosshairs={{
              type: 'xy',
            }}
          />
        </Chart>
      ) : (
        <Box className="flex justify-center flex-col items-center">
          <Image src="/no_data.jpg" height={285} preview={false} />
          <Typography>No data</Typography>
        </Box>
      )}
    </Box>
  );
}

export default ChartStatistic;
