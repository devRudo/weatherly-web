import PropTypes from "prop-types";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { ThemeProvider } from "@mui/material";
import { useTheme } from "@mui/material";
import MainRoutes from "./routes/MainRoutes";
import Page from "./components/Page";

const App = (props) => {
  const theme = useTheme();
  const history = createBrowserHistory();

  return (
    <Page>
      <Router location={history.location} navigator={history}>
        <MainRoutes />
      </Router>
    </Page>
  );
};

App.propTypes = {};

export default App;
