import { ThemeProvider } from "@mui/material";
import { createTheme, ThemeOptions } from "@mui/material/styles";
import { AppContextProvider } from "./Context";

import "./App.css";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Router } from "./Router";

export const themeOptions: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: "#3fb56f",
    },
    secondary: {
      main: "#33a4de",
    },
  },
};

function App() {
  return (
    <ThemeProvider theme={createTheme(themeOptions)}>
      <AppContextProvider>
        <div className="App">
          <Router />
        </div>
      </AppContextProvider>
    </ThemeProvider>
  );
}

export default App;
