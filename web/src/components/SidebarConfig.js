import { Dashboard, Group, RateReview, HomeWork } from '@mui/icons-material';

export const sidebarConfig = [
  {
    href: '/',
    icon: <Dashboard fontSize="small" />,
    title: 'Inicio'
  },
  {
    href: '/inquilinos',
    icon: <Group fontSize="small" />,
    title: 'Inquilinos'
  },
  {
    href: '/inmuebles',
    icon: <HomeWork fontSize="small" />,
    title: 'Inmuebles'
  },
  {
    href: '/observaciones',
    icon: <RateReview fontSize="small" />,
    title: 'Observaciones'
  }
];
