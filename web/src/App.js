// roboto - material ui
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// Libraries
import { BrowserRouter as Router } from 'react-router-dom';
// import Login from "./pages/Login";
// import { DashboardLayout } from './components/DashboarLayout';
import { ThemeConfig } from './theme';

import { Register } from './pages/Register';

const App = () => {
  return (
    <ThemeConfig>
      <Router>
        {/* <Login /> */}
        {/* <DashboardLayout>
          <div>Hola mundo</div>
        </DashboardLayout> */}

        <Register />
      </Router>
    </ThemeConfig>
  );
};

export default App;
