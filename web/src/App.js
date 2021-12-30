// roboto - material ui
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

// Libraries
import Login from "./pages/Login";
import { ThemeConfig } from "./theme";

function App() {
  return (
    <>
      <ThemeConfig>
        <Login />
      </ThemeConfig>
    </>
  );
}

export default App;
