import { AcUnit, AccessAlarmRounded, AccountCircle } from "@mui/icons-material";

// ----------------------------------------------------------------------

const sidebarConfig = [
  {
    title: "dashboard",
    path: "/dashboard/app",
    icon: <AcUnit />,
  },
  {
    title: "user",
    path: "/dashboard/user",
    icon: <AccessAlarmRounded />,
  },
  {
    title: "product",
    path: "/dashboard/products",
    icon: <AccountCircle />,
  },
  {
    title: "blog",
    path: "/dashboard/blog",
    icon: <AccountCircle />,
  },
  {
    title: "login",
    path: "/login",
    icon: <AcUnit />,
  },
];

export default sidebarConfig;
