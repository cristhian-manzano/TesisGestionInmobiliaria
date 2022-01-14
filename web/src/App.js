// roboto - material ui
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// Libraries
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { ThemeConfig } from './theme';
import { DashboardLayout } from './layouts/dashboard/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/dashboard/Home';
import { Observation } from './pages/dashboard/observation/index';
import { Property } from './pages/dashboard/property/index';
import { Tenant } from './pages/dashboard/tenant/index';
import { NotFound } from './pages/NotFound';
import { HomePage } from './pages/HomePage';
import { SearchProperty } from './pages/SearchProperty';
import { SnackbarGlobal } from './store/context/SnackbarGlobal';
import { LoadingGlobal } from './store/context/LoadingGlobal';
import { AuthContextProvider } from './store/context/authContext';

// new
import { Create } from './pages/dashboard/property/Create';

// Testing
import { ProtectedRoutes } from './ProtectedRoutes';

const App = () => {
  return (
    <ThemeConfig>
      <AuthContextProvider>
        <SnackbarGlobal>
          <LoadingGlobal>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search-property" element={<SearchProperty />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<NotFound />} />

                <Route path="/dashboard" element={<ProtectedRoutes />}>
                  <Route path="" element={<DashboardLayout />}>
                    <Route index element={<Home />} />
                    <Route path="observation" element={<Observation />} />

                    <Route path="property" element={<Outlet />}>
                      <Route path="" element={<Property />} />
                      <Route path="create" element={<Create />} />
                    </Route>

                    <Route path="tenant" element={<Tenant />} />
                    <Route path="*" element={<h1>Página no encontrada</h1>} />
                  </Route>
                </Route>
              </Routes>
            </BrowserRouter>
          </LoadingGlobal>
        </SnackbarGlobal>
      </AuthContextProvider>
    </ThemeConfig>
  );
};

export default App;
