import { alpha } from "@mui/material/styles";

const GREY = {
  0: "#FFFFFF",
  100: "#F9FAFB",
  200: "#F4F6F8",
  300: "#DFE3E8",
  400: "#C4CDD5",
  500: "#919EAB",
  600: "#637381",
  700: "#454F5B",
  800: "#212B36",
  900: "#161C24",
  500_8: alpha("#919EAB", 0.08),
  500_12: alpha("#919EAB", 0.12),
  500_16: alpha("#919EAB", 0.16),
  500_24: alpha("#919EAB", 0.24),
  500_32: alpha("#919EAB", 0.32),
  500_48: alpha("#919EAB", 0.48),
  500_56: alpha("#919EAB", 0.56),
  500_80: alpha("#919EAB", 0.8),
};

export const palette = {
  common: { black: "#000", white: "#fff" },
  primary: {
    main: "#5048E5",
    light: "#828DF8",
    dark: "#3832A0",
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: "#10B981",
    light: "#3FC79A",
    dark: "#0B815A",
    contrastText: "#FFFFFF",
  },
  success: {
    light: "#43C6B7",
    main: "#14B8A6",
    dark: "#0E8074",
    contrastText: "#FFFFFF",
  },
  info: {
    main: "#2196F3",
    light: "#64B6F7",
    dark: "#0B79D0",
    contrastText: "#FFFFFF",
  },
  warning: {
    main: "#FFB020",
    light: "#FFBF4C",
    dark: "#B27B16",
    contrastText: "#FFFFFF",
  },
  error: {
    main: "#D14343",
    light: "#DA6868",
    dark: "#922E2E",
    contrastText: "#FFFFFF",
  },

  grey: GREY,

  neutral: {
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },

  divider: "#E6E8F0",

  text: {
    primary: "#121828",
    secondary: "#65748B",
    disabled: "rgba(55, 65, 81, 0.48)",
  },

  background: {
    default: "#F9FAFC",
    paper: "#FFFFFF",
  },

  action: {
    active: "#6B7280",
    focus: "rgba(55, 65, 81, 0.12)",
    hover: "rgba(55, 65, 81, 0.04)",
    selected: "rgba(55, 65, 81, 0.08)",
    disabledBackground: "rgba(55, 65, 81, 0.12)",
    disabled: "rgba(55, 65, 81, 0.26)",
  },
};
