import React, { useState, useEffect } from "react";
import { Card, Segment, Badge } from "components/ui";
import { Loading } from "components/shared";
import { Chart } from "components/shared";
import { COLORS } from "constants/chart.constant";
import isEmpty from "lodash/isEmpty";
import { useSelector } from "react-redux";

const ChartLegend = ({ label, value, badgeClass, showBadge = true }) => {
  return (
    <div className="flex gap-2">
      {showBadge && <Badge className="mt-2.5" innerClass={badgeClass} />}
      <div>
        <h5 className="font-bold">{value}</h5>
        <p>{label}</p>
      </div>
    </div>
  );
};

const TaskOverview = ({ data = {}, className }) => {
  console.log(`data`, data);
  const [timeRange, setTimeRange] = useState(["weekly"]);

  const [repaint, setRepaint] = useState(false);

  const sideNavCollapse = useSelector(
    state => state.theme.layout.sideNavCollapse
  );

  useEffect(() => {
  
    setRepaint(true);
    const timer1 = setTimeout(() => setRepaint(false), 300);

    return () => {
      clearTimeout(timer1);
    };
  }, [data, sideNavCollapse]);

  return (
    <Card className={className}>
      <div className="flex sm:flex-row flex-col md:items-center justify-between mb-6 gap-4">
        <h4>Task Overview</h4>
        <Segment
          value={timeRange}
          onChange={val => setTimeRange(val)}
          size="sm"
        >
          <Segment.Item value="monthly">Monthly</Segment.Item>
          <Segment.Item value="weekly">Weekly</Segment.Item>
          <Segment.Item value="daily">Daily</Segment.Item>
        </Segment>
      </div>
      {!isEmpty(data) && !repaint && (
        <>
          <div className="flex items-center justify-between mb-4">
            <div>
              <ChartLegend
                showBadge={false}
                label="Total Tasks"
                value={data.chart[timeRange[0]].total}
              />
            </div>
            <div className="flex gap-x-6">
              <ChartLegend
                badgeClass="bg-indigo-600"
                label={data.chart[timeRange[0]].series[0].name}
                value={data.chart[timeRange[0]].onGoing}
              />
              <ChartLegend
                badgeClass="bg-emerald-500"
                label={data.chart[timeRange[0]].series[1].name}
                value={data.chart[timeRange[0]].finished}
              />
            </div>
          </div>
          <div>
            <Chart
              series={data.chart[timeRange[0]].series}
              xAxis={data.chart[timeRange[0]].range}
              type="bar"
              customOptions={{
                colors: [COLORS[0], COLORS[2]],
                legend: { show: false },
              }}
            />
          </div>
        </>
      )}
      <Loading loading={repaint} type="cover">
        {repaint && <div className="h-[300px]" />}
      </Loading>
    </Card>
  );
};

export default TaskOverview;

// data exmpl
// {
//     "chart": {
//         "daily": {
//             "onGoing": 13,
//             "finished": 9,
//             "total": 21,
//             "series": [
//                 {
//                     "name": "On Going",
//                     "data": [
//                         20,
//                         19,
//                         18,
//                         14,
//                         12,
//                         10
//                     ]
//                 },
//                 {
//                     "name": "Finished",
//                     "data": [
//                         1,
//                         4,
//                         8,
//                         15,
//                         16,
//                         18
//                     ]
//                 }
//             ],
//             "range": [
//                 "6:00am",
//                 "9:00am",
//                 "12:00pm",
//                 "03:00pm",
//                 "06:00pm",
//                 "09:00pm"
//             ]
//         },
//         "weekly": {
//             "onGoing": 126,
//             "finished": 87,
//             "total": 213,
//             "series": [
//                 {
//                     "name": "On Going",
//                     "data": [
//                         45,
//                         52,
//                         68,
//                         84,
//                         103,
//                         112,
//                         126
//                     ]
//                 },
//                 {
//                     "name": "Finished",
//                     "data": [
//                         35,
//                         41,
//                         62,
//                         62,
//                         75,
//                         81,
//                         87
//                     ]
//                 }
//             ],
//             "range": [
//                 "21 Jan",
//                 "22 Jan",
//                 "23 Jan",
//                 "24 Jan",
//                 "25 Jan",
//                 "26 Jan",
//                 "27 Jan"
//             ]
//         },
//         "monthly": {
//             "onGoing": 270,
//             "finished": 113,
//             "total": 383,
//             "series": [
//                 {
//                     "name": "On Going",
//                     "data": [
//                         28,
//                         52,
//                         91,
//                         154,
//                         227,
//                         256,
//                         270
//                     ]
//                 },
//                 {
//                     "name": "Finished",
//                     "data": [
//                         22,
//                         31,
//                         74,
//                         88,
//                         97,
//                         107,
//                         113
//                     ]
//                 }
//             ],
//             "range": [
//                 "01 Jan",
//                 "05 Jan",
//                 "10 Jan",
//                 "15 Jan",
//                 "20 Jan",
//                 "25 Jan",
//                 "27 Jan"
//             ]
//         }
//     }
// }
