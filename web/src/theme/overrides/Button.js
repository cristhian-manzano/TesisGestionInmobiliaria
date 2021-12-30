export const MuiButton = {
  defaultProps: {
    disableElevation: true,
  },
  styleOverrides: {
    root: {
      textTransform: "none",
    },
    sizeSmall: {
      padding: "6px 16px",
    },
    sizeMedium: {
      padding: "8px 20px",
    },
    sizeLarge: {
      padding: "11px 24px",
    },
    textSizeSmall: {
      padding: "7px 12px",
    },
    textSizeMedium: {
      padding: "9px 16px",
    },
    textSizeLarge: {
      padding: "12px 16px",
    },
  },
};

export const MuiButtonBase = {
  defaultProps: {
    disableRipple: true,
  },
};
