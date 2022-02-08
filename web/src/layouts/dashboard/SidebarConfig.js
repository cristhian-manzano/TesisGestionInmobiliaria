import { Dashboard, Group, RateReview, HomeWork, AddBusiness, Paid } from '@mui/icons-material';

import { ROLES } from '../../helpers/constants';

export const sidebarConfig = [
  {
    href: '/dashboard',
    icon: <Dashboard fontSize="small" />,
    title: 'Inicio',
    roles: [ROLES.ADMINISTRADOR, ROLES.ARRENDADOR, ROLES.ARRENDATARIO]
  },
  {
    href: '/dashboard/tenant',
    icon: <Group fontSize="small" />,
    title: 'Inquilinos',
    roles: [ROLES.ARRENDADOR]
  },
  {
    href: '/dashboard/property',
    icon: <HomeWork fontSize="small" />,
    title: 'Inmuebles',
    roles: [ROLES.ARRENDADOR]
  },
  {
    href: '/dashboard/payments',
    icon: <Paid fontSize="small" />,
    title: 'Pagos',
    roles: [ROLES.ARRENDADOR, ROLES.ARRENDATARIO]
  },
  {
    href: '/dashboard/observation',
    icon: <RateReview fontSize="small" />,
    title: 'Observaciones',
    roles: [ROLES.ARRENDADOR, ROLES.ARRENDATARIO]
  }
];
