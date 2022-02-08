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

import { Profile } from './pages/dashboard/Profile';

// new
import { Create as CreateProperty } from './pages/dashboard/property/Create';
import { Update as UpdateProperty } from './pages/dashboard/property/Update';
import { Details as DetailsProperty } from './pages/dashboard/property/Details';

import { Create as CreateTenant } from './pages/dashboard/tenant/Create';
import { Update as UpdateTenant } from './pages/dashboard/tenant/Update';
import { Details as DetailsTenant } from './pages/dashboard/tenant/Details';

import { Create as CreateObservation } from './pages/dashboard/observation/Create';
import { Update as UpdateObservation } from './pages/dashboard/observation/Update';
import { Details as DetailsObservation } from './pages/dashboard/observation/Details';

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
                    <Route path="profile" element={<Profile />} />

                    <Route path="observation" element={<Outlet />}>
                      <Route path="" element={<Observation />} />
                      <Route path="create" element={<CreateObservation />} />
                      <Route path="update/:id" element={<UpdateObservation />} />
                      <Route path=":id" element={<DetailsObservation />} />
                    </Route>

                    <Route path="property" element={<Outlet />}>
                      <Route path="" element={<Property />} />
                      <Route path=":id" element={<DetailsProperty />} />
                      <Route path="create" element={<CreateProperty />} />
                      <Route path="update/:id" element={<UpdateProperty />} />
                    </Route>

                    <Route path="tenant" element={<Outlet />}>
                      <Route path="" element={<Tenant />} />
                      <Route path=":id" element={<DetailsTenant />} />
                      <Route path="create" element={<CreateTenant />} />
                      <Route path="update/:id" element={<UpdateTenant />} />
                    </Route>

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
