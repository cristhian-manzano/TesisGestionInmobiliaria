// roboto - material ui
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

// Libraries
import { BrowserRouter as Router } from "react-router-dom";
// import Login from "./pages/Login";
import { DashboardLayout } from "./components/DashboarLayout";
import { ThemeConfig } from "./theme";

function App() {
  return (
    <>
      <ThemeConfig>
        <Router>
          {/* <Login /> */}
          <DashboardLayout>
            <div>Hola mundo</div>
          </DashboardLayout>
        </Router>
      </ThemeConfig>
    </>
  );
}

export default App;
