export const MuiCard = {
  styleOverrides: {
    root: {
      borderRadius: 16,
      position: "relative",
      zIndex: 0, // Fix Safari overflow: hidden with border radius
    },
  },
};

export const MuiCardHeader = {
  defaultProps: {
    titleTypographyProps: { variant: "h6" },
    subheaderTypographyProps: { variant: "body2" },
  },
  styleOverrides: {
    root: {
      padding: "32px 24px",
    },
  },
};

export const MuiCardContent = {
  styleOverrides: {
    root: {
      padding: "32px 24px",
      "&:last-child": {
        paddingBottom: "32px",
      },
    },
  },
};
