import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Header from "./layout/Header";
import Dashboard from "./layout/Dashboard";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#5f0a87",
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Dashboard />
    </ThemeProvider>
  );
};

export default App;
