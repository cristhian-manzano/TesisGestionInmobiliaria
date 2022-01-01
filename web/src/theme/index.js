import { CssBaseline } from '@mui/material';
import PropTypes from 'prop-types';
import { ThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles';
import { theme } from './theme';

export const ThemeConfig = ({ children }) => {
  const themeApp = createTheme(theme);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themeApp}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

ThemeConfig.propTypes = {
  children: PropTypes.node.isRequired
};
