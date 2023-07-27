import PropTypes from "prop-types";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { ThemeProvider } from "@mui/material";
import { useTheme } from "@mui/material";
import MainRoutes from "./routes/MainRoutes";

const App = (props) => {
  const theme = useTheme();
  const history = createBrowserHistory();

  return (
    <ThemeProvider theme={theme}>
      <Router location={history.location} navigator={history}>
        <MainRoutes />
      </Router>
    </ThemeProvider>
  );
};

App.propTypes = {};

export default App;
