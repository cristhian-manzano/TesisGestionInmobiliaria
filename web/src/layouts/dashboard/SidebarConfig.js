import {
  Dashboard,
  Group,
  RateReview,
  HomeWork,
  AddBusiness,
  Receipt,
  Paid,
  Payments
} from '@mui/icons-material';

import { ROLES } from '../../helpers/constants';

export const sidebarConfig = [
  {
    href: '/dashboard',
    icon: <Dashboard fontSize="small" />,
    title: 'Inicio',
    roles: [ROLES.ADMINISTRADOR, ROLES.ARRENDADOR, ROLES.ARRENDATARIO]
  },
  {
    href: '/dashboard/tenants',
    icon: <Group fontSize="small" />,
    title: 'Inquilinos',
    roles: [ROLES.ARRENDADOR]
  },
  {
    href: '/dashboard/properties',
    icon: <HomeWork fontSize="small" />,
    title: 'Inmuebles',
    roles: [ROLES.ARRENDADOR]
  },
  {
    href: '/dashboard/payments',
    icon: <Payments fontSize="small" />,
    title: 'Pagos',
    roles: [ROLES.ARRENDADOR, ROLES.ARRENDATARIO]
  },
  {
    href: '/dashboard/rents',
    icon: <AddBusiness fontSize="small" />,
    title: 'Alquileres',
    roles: [ROLES.ARRENDATARIO]
  },
  {
    href: '/dashboard/contracts',
    icon: <Receipt fontSize="small" />,
    title: 'Contratos',
    roles: [ROLES.ARRENDADOR, ROLES.ARRENDATARIO]
  },
  {
    href: '/dashboard/income',
    icon: <Paid fontSize="small" />,
    title: 'Ingresos',
    roles: [ROLES.ARRENDADOR]
  },
  {
    href: '/dashboard/observations',
    icon: <RateReview fontSize="small" />,
    title: 'Observaciones',
    roles: [ROLES.ARRENDADOR, ROLES.ARRENDATARIO]
  }
];
