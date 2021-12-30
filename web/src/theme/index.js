import { CssBaseline } from "@mui/material";
import {
  ThemeProvider,
  createTheme,
  StyledEngineProvider,
} from "@mui/material/styles";

import { palette } from "./palette";
import { shadows } from "./shadows";
import { shape } from "./shape";
import { typography } from "./typography";

// Components
import { MuiButton, MuiButtonBase } from "./overrides/Button";
import { MuiCard, MuiCardContent, MuiCardHeader } from "./overrides/Card";
import { MuiOutlinedInput } from "./overrides/input";
import { useMemo } from "react";

export function ThemeConfig({ children }) {
  const themeOptions = useMemo(
    () => ({
      palette,
      shadows,
      shape,
      typography,
      components: {
        MuiButton,
        MuiButtonBase,
        MuiCard,
        MuiCardContent,
        MuiCardHeader,
        MuiOutlinedInput,
      },
    }),
    []
  );

  const theme = createTheme(themeOptions);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
