import { CssBaseline } from "@mui/material";
import {
  ThemeProvider,
  createTheme,
  StyledEngineProvider,
} from "@mui/material/styles";

import { theme } from "./theme";

export function ThemeConfig({ children }) {
  const themeApp = createTheme(theme);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themeApp}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
