import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Label,
} from "recharts";
import { barChartType } from "../../utils";
import { Paper } from "@mui/material";

const getDataKey = (type) => {
  switch (type) {
    case barChartType.itemType:
      return "itemType";
    case barChartType.orderState:
      return "orderState";
    case barChartType.ranking:
      return "branchId";
    default:
      return "";
  }
};
const getLabelValue = (type) => {
  switch (type) {
    case barChartType.itemType:
      return "Item Type";
    case barChartType.orderState:
      return "Order State";
    case barChartType.ranking:
      return "Branch";
    default:
      return "";
  }
};

const CustomBarChart = ({ data = [], type = "" }) => {
  return (
    <Paper sx={{ p: 1, userSelect: "none" }}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={getDataKey(type)} height={50}>
            <Label
              value={getLabelValue(type)}
              offset={0}
              position="insideBottom"
            />
          </XAxis>
          <YAxis
            label={{
              value: "Number of Orders",
              angle: -90,
              position: "insideBottomLeft",
            }}
          />
          <Tooltip
            labelFormatter={
              type === barChartType.ranking && ((label) => `Branch #${label}`)
            }
          />
          <Bar dataKey="orders" fill="#c191a1" barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default CustomBarChart;
