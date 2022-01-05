import { Dashboard, Group, RateReview, HomeWork } from '@mui/icons-material';

export const sidebarConfig = [
  {
    href: '/dashboard',
    icon: <Dashboard fontSize="small" />,
    title: 'Inicio'
  },
  {
    href: '/dashboard/tenant',
    icon: <Group fontSize="small" />,
    title: 'Inquilinos'
  },
  {
    href: '/dashboard/property',
    icon: <HomeWork fontSize="small" />,
    title: 'Inmuebles'
  },
  {
    href: '/dashboard/observation',
    icon: <RateReview fontSize="small" />,
    title: 'Observaciones'
  }
];
