import React, { Component } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
  Legend,
} from "recharts";
import {
  format,
  startOfWeek,
  startOfMonth,
  startOfDay,
  startOfHour,
  parseISO,
} from "date-fns";
import { enUS } from "date-fns/locale";
import {
  Paper,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip as MuiTooltip,
} from "@mui/material";

const transformData = (data, granularity) => {
  // Group data based on the granularity
  const groupedData = {};

  data.forEach((item) => {
    let dateKey = "";
    let dateLabel = "";
    let dateFormats = {
      dateAndTime: format(parseISO(item?.lastUpdatedDateTime), "Pp", {
        locale: enUS,
      }),
      formattedDate: format(parseISO(item?.lastUpdatedDateTime), "P", {
        locale: enUS,
      }),
      day: format(parseISO(item?.lastUpdatedDateTime), "EEE", { locale: enUS }),
      week: format(parseISO(item?.lastUpdatedDateTime), "wo", { locale: enUS }),
      month: format(parseISO(item?.lastUpdatedDateTime), "MMM", {
        locale: enUS,
      }),
      year: format(parseISO(item?.lastUpdatedDateTime), "YYY", {
        locale: enUS,
      }),
    };

    switch (granularity) {
      case "hour":
        dateKey = startOfHour(
          parseISO(item?.lastUpdatedDateTime)
        ).toISOString();
        dateLabel = dateFormats.dateAndTime;
        break;
      case "day":
        dateKey = startOfDay(parseISO(item?.lastUpdatedDateTime)).toISOString();
        dateLabel = `${dateFormats.formattedDate}, ${dateFormats.day}`;
        break;
      case "week":
        dateKey = startOfWeek(
          parseISO(item?.lastUpdatedDateTime)
        ).toISOString();
        dateLabel = dateFormats.week;
        break;
      case "month":
        dateKey = startOfMonth(
          parseISO(item?.lastUpdatedDateTime)
        ).toISOString();
        dateLabel = dateFormats.month;
        break;
      default:
        dateKey = item?.lastUpdatedDateTime;
    }

    if (!groupedData[dateKey]) {
      groupedData[dateKey] = {
        orderValue: item?.value,
        numOfOrders: 1,
        dateLabel,
        ...dateFormats,
      };
    } else {
      groupedData[dateKey].numOfOrders += 1;
      groupedData[dateKey].orderValue += item?.value;
    }
  });

  const groupedDates = Object.keys(groupedData);

  return groupedDates.map((key) => ({
    date: key,
    dateId: groupedDates.indexOf(key) + 1,
    ...groupedData[key],
  }));
};

const getAxisYDomain = (data, from, to, ref, offset) => {
  const refData = data.slice(from - 1, to);
  let [bottom, top] = [refData[0][ref], refData[0][ref]];

  refData.forEach((d) => {
    if (d[ref] > top) top = d[ref];
    if (d[ref] < bottom) bottom = d[ref];
  });

  return [(bottom | 0) - offset, (top | 0) + offset];
};

const CustomizedAxisTick = (props) => {
  const { x, y, payload, data } = props;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        fill="#666"
        textAnchor="end"
        transform="rotate(-35)"
      >
        {payload?.value % 1 === 0 ? data[payload.value - 1]?.dateLabel : ""}
      </text>
    </g>
  );
};

const getTooltipContent = (data, granularity) => {
  switch (granularity) {
    case "hour":
      return data?.dateLabel;
    case "day":
      return data?.dateLabel;
    case "week":
      return `${data?.dateLabel} week of ${data?.year}, ${data?.month}`;
    case "month":
      return `${data?.dateLabel}, ${data?.year}`;
    default:
      return "";
  }
};

const initialState = {
  data: [],
  left: "dataMin",
  right: "dataMax",
  refAreaLeft: "",
  refAreaRight: "",
  top: "dataMax+1",
  bottom: "dataMin-1",
  top2: "dataMax+20",
  bottom2: "dataMin-20",
  animation: true,
  granularity: "hour",
};

export default class TimeSeriesChart extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  zoom() {
    let { refAreaLeft, refAreaRight } = this.state;
    const { data } = this.state;
    if (refAreaLeft === refAreaRight || refAreaRight === "") {
      this.setState(() => ({
        refAreaLeft: "",
        refAreaRight: "",
      }));
      return;
    }

    // xAxis domain
    if (refAreaLeft > refAreaRight)
      [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];

    // yAxis domain
    const [bottom, top] = getAxisYDomain(
      data,
      refAreaLeft,
      refAreaRight,
      "numOfOrders",
      1
    );
    const [bottom2, top2] = getAxisYDomain(
      data,
      refAreaLeft,
      refAreaRight,
      "orderValue",
      50
    );

    this.setState(() => ({
      refAreaLeft: "",
      refAreaRight: "",
      data: data.slice(),
      left: refAreaLeft,
      right: refAreaRight,
      bottom,
      top,
      bottom2,
      top2,
    }));
  }

  zoomOut() {
    const { data } = this.state;
    this.setState(() => ({
      data: data.slice(),
      refAreaLeft: "",
      refAreaRight: "",
      left: "dataMin",
      right: "dataMax",
      top: "dataMax+1",
      bottom: "dataMin",
      top2: "dataMax+50",
      bottom2: "dataMin+50",
    }));
  }

  handleGranularity(e) {
    this.setState({ granularity: e?.target?.value }, () => {
      const transformedData = transformData(
        this.props.originalData,
        e?.target?.value
      );
      this.setState({ data: transformedData });
    });
  }

  componentDidMount() {
    const { granularity } = this.state;
    const transformedData = transformData(this.props.originalData, granularity);
    this.setState({ data: transformedData });
  }

  render() {
    const {
      data,
      left,
      right,
      refAreaLeft,
      refAreaRight,
      top,
      bottom,
      top2,
      bottom2,
      granularity,
    } = this.state;

    return (
      <Paper
        sx={{
          display: "flex",
          justifyContent: "space-around",
          py: 1,
          px: 2,
          userSelect: "none",
        }}
      >
        <ResponsiveContainer width="90%" height={600}>
          <LineChart
            data={data}
            onMouseDown={(e) => {
              this.setState({ refAreaLeft: e?.activeLabel });
            }}
            onMouseMove={(e) => {
              this.state.refAreaLeft &&
                this.setState({ refAreaRight: e?.activeLabel });
            }}
            onMouseUp={this.zoom.bind(this)}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              allowDataOverflow
              dataKey="dateId"
              domain={[left, right]}
              type="number"
              height={150}
              tick={<CustomizedAxisTick data={data} />}
              tickCount={data?.length}
            />
            <YAxis
              allowDataOverflow
              domain={[bottom, top]}
              type="number"
              yAxisId="1"
            />
            <YAxis
              orientation="right"
              allowDataOverflow
              domain={[bottom2, top2]}
              type="number"
              yAxisId="2"
            />
            <Tooltip
              labelFormatter={(label) =>
                getTooltipContent(data[label - 1], granularity)
              }
            />
            <Legend verticalAlign="top" height={36} />
            <Line
              yAxisId="1"
              name="Number of Orders"
              type="monotone"
              dataKey="numOfOrders"
              stroke="#2f004f"
              animationDuration={300}
            />
            <Line
              yAxisId="2"
              name="Order Value(Rupees)"
              type="monotone"
              dataKey="orderValue"
              stroke="#c191a1"
              animationDuration={300}
            />

            {refAreaLeft && refAreaRight ? (
              <ReferenceArea
                yAxisId="1"
                x1={refAreaLeft}
                x2={refAreaRight}
                strokeOpacity={0.3}
              />
            ) : null}
          </LineChart>
        </ResponsiveContainer>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <FormControl sx={{ my: 2, minWidth: 120 }} size="small">
            <InputLabel id="dropdown-label">Granularity</InputLabel>
            <Select
              labelId="dropdown-label"
              value={granularity}
              label="Granularity"
              onChange={this.handleGranularity.bind(this)}
            >
              <MenuItem value="hour">Hour</MenuItem>
              <MenuItem value="day">Day</MenuItem>
              <MenuItem value="week">Week</MenuItem>
              <MenuItem value="month">Month</MenuItem>
            </Select>
          </FormControl>
          <MuiTooltip title="Note: Drag the cursor across the chart area to zoom in!">
            <Button variant="outlined" onClick={this.zoomOut.bind(this)}>
              Zoom Out
            </Button>
          </MuiTooltip>
        </Box>
      </Paper>
    );
  }
}
