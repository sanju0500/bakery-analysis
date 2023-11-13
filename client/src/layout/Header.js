import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

export default function Header() {
  return (
    <AppBar position="static">
      <Toolbar variant="dense" sx={{ backgroundColor: "#fff" }}>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography variant="h6" color="primary">
              STAR BAKERY
            </Typography>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <AccountCircleOutlinedIcon
              fontSize="large"
              sx={{ color: (theme) => theme.palette.primary.main }}
            />
            <Typography variant="body2" color="textPrimary" ml={1}>
              UserName
            </Typography>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
