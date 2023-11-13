import { Container, Grid, Stack } from "@mui/material";
import TimeSelector from "../components/TimeSelector";
import CustomBarChart from "../components/CustomBarChart";
import TimeSeriesChart from "../components/TimeSeriesChart";
import {
  itemTypeData,
  orderStateData,
  rankingData,
} from "../data/mockChartData";
import { ordersData } from "../data/ordersData";
import { barChartType } from "../utils";

const Dashboard = () => {
  return (
    <Container maxWidth={false}>
      <Stack spacing={2}>
        <TimeSelector />
        <Grid container>
          <Grid item xs={12} md={4} pr={2}>
            <CustomBarChart data={itemTypeData} type={barChartType.itemType} />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomBarChart
              data={orderStateData}
              type={barChartType.orderState}
            />
          </Grid>
          <Grid item xs={12} md={4} pl={2}>
            <CustomBarChart data={rankingData} type={barChartType.ranking} />
          </Grid>
        </Grid>
        <TimeSeriesChart originalData={ordersData} />
      </Stack>
    </Container>
  );
};

export default Dashboard;
