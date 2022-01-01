import { AcUnitSharp, AccountBalance, AccessAlarm, AccountCircle } from '@mui/icons-material';

export const sidebarConfig = [
  {
    href: '/',
    icon: <AcUnitSharp fontSize="small" />,
    title: 'Dashboard'
  },
  {
    href: '/customers',
    icon: <AccountBalance fontSize="small" />,
    title: 'Customers'
  },
  {
    href: '/products',
    icon: <AccessAlarm fontSize="small" />,
    title: 'Products'
  },
  {
    href: '/account',
    icon: <AccountBalance fontSize="small" />,
    title: 'Account'
  },
  {
    href: '/settings',
    icon: <AccessAlarm fontSize="small" />,
    title: 'Settings'
  },
  {
    href: '/login',
    icon: <AccessAlarm fontSize="small" />,
    title: 'Login'
  },
  {
    href: '/register',
    icon: <AccountCircle fontSize="small" />,
    title: 'Register'
  },
  {
    href: '/404',
    icon: <AccountBalance fontSize="small" />,
    title: 'Error'
  }
];
