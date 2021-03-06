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
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { Home } from './pages/dashboard/Home';
import { NotFound } from './pages/NotFound';
import { HomePage } from './pages/HomePage';
import { SearchProperty } from './pages/SearchProperty';
import { SnackbarGlobal } from './store/context/SnackbarGlobal';
import { LoadingGlobal } from './store/context/LoadingGlobal';
import { AuthContextProvider } from './store/context/authContext';

import { Profile } from './pages/dashboard/Profile';

// Admin
import { User } from './pages/dashboard/user/index';
import { Update as UpdateUser } from './pages/dashboard/user/update';

// new
import { Property } from './pages/dashboard/property/index';
import { Create as CreateProperty } from './pages/dashboard/property/Create';
import { Update as UpdateProperty } from './pages/dashboard/property/Update';
import { Details as DetailsProperty } from './pages/dashboard/property/Details';

import { Tenant } from './pages/dashboard/tenant/index';
import { Create as CreateTenant } from './pages/dashboard/tenant/Create';
import { Update as UpdateTenant } from './pages/dashboard/tenant/Update';
import { Details as DetailsTenant } from './pages/dashboard/tenant/Details';

import { Observation } from './pages/dashboard/observation/index';
import { Create as CreateObservation } from './pages/dashboard/observation/Create';
import { Details as DetailsObservation } from './pages/dashboard/observation/Details';

import { Payment } from './pages/dashboard/payment/index';
import { Create as CreatePayment } from './pages/dashboard/payment/Create';
import { Details as DetailsPayment } from './pages/dashboard/payment/Details';

import { Contract } from './pages/dashboard/contract/index';
import { Create as CreateContract } from './pages/dashboard/contract/Create';
import { Details as DetailsContract } from './pages/dashboard/contract/Details';

import { TenantRent } from './pages/dashboard/tenantRent/index';
import { Details as DetailsTenantRent } from './pages/dashboard/tenantRent/details';

import { Income } from './pages/dashboard/income/index';

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
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="*" element={<NotFound />} />

                <Route path="/dashboard" element={<ProtectedRoutes />}>
                  <Route path="" element={<DashboardLayout />}>
                    <Route index element={<Home />} />

                    <Route path="profile" element={<Profile />} />

                    <Route path="users" element={<Outlet />}>
                      <Route path="" element={<User />} />
                      <Route path="update/:id" element={<UpdateUser />} />
                      {/* <Route path="create" element={<CreateObservation />} />
                      <Route path=":id" element={<DetailsObservation />} /> */}
                    </Route>

                    <Route path="observations" element={<Outlet />}>
                      <Route path="" element={<Observation />} />
                      <Route path="create" element={<CreateObservation />} />
                      <Route path=":id" element={<DetailsObservation />} />
                    </Route>

                    <Route path="properties" element={<Outlet />}>
                      <Route path="" element={<Property />} />
                      <Route path=":id" element={<DetailsProperty />} />
                      <Route path="create" element={<CreateProperty />} />
                      <Route path="update/:id" element={<UpdateProperty />} />
                    </Route>

                    <Route path="tenants" element={<Outlet />}>
                      <Route path="" element={<Tenant />} />
                      <Route path=":id" element={<DetailsTenant />} />
                      <Route path="create" element={<CreateTenant />} />
                      <Route path="update/:id" element={<UpdateTenant />} />
                    </Route>

                    <Route path="rents" element={<Outlet />}>
                      <Route path="" element={<TenantRent />} />
                      <Route path=":id" element={<DetailsTenantRent />} />
                      {/* <Route path="create" element={<CreateTenant />} />
                      <Route path="update/:id" element={<UpdateTenant />} /> */}
                    </Route>

                    <Route path="payments" element={<Outlet />}>
                      <Route path="" element={<Payment />} />
                      <Route path="create" element={<CreatePayment />} />
                      <Route path=":id" element={<DetailsPayment />} />
                    </Route>

                    <Route path="contracts" element={<Outlet />}>
                      <Route path="" element={<Contract />} />
                      <Route path="create" element={<CreateContract />} />
                      <Route path=":id" element={<DetailsContract />} />
                    </Route>

                    <Route path="income" element={<Outlet />}>
                      <Route path="" element={<Income />} />
                    </Route>

                    <Route path="*" element={<h1>P??gina no encontrada</h1>} />
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
