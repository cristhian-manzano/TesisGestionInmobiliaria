// roboto - material ui
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import DashboardLayout from "./components/DashboardLayout";

// Libraries
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import { ThemeConfig } from "./theme";

function App() {
  return (
    <>
      <ThemeConfig>
        {/* <Login /> */}
        <Router>
          <DashboardLayout>Hello world</DashboardLayout>
        </Router>
      </ThemeConfig>
    </>
  );
}

export default App;
