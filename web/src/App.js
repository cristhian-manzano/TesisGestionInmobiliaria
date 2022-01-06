// roboto - material ui
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// Libraries
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeConfig } from './theme';
import { DashboardLayout } from './layouts/dashboard/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/dashboard/Home';
import { Observation } from './pages/dashboard/Observation';
import { Property } from './pages/dashboard/Property';
import { Tenant } from './pages/dashboard/Tenant';
import { NotFound } from './pages/NotFound';
import { HomePage } from './pages/HomePage';

const App = () => {
  return (
    <ThemeConfig>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Home />} />
            <Route path="observation" element={<Observation />} />
            <Route path="property" element={<Property />} />
            <Route path="tenant" element={<Tenant />} />
            <Route path="*" element={<h1>Página no encontrada</h1>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeConfig>
  );
};

export default App;
