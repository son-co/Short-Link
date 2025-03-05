import { BrowserRouter as Router } from 'react-router-dom';
import { LayoutProvider } from './contexts/LayoutContext';
import AppRoutes from './routes';
import LayoutContainer from '@/components/layout/LayoutContainer';
import './App.css';
import './index.css';
import store, { persistor } from '@/state/store';

import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    xxl: true; // Thêm breakpoint mới
  }
}

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 576, // Thay đổi giá trị sm thành 500px
      md: 768,
      lg: 992,
      xl: 1281,
      xxl: 1536,
    },
  },
});

const App = () => {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <ThemeProvider theme={theme}>
            <LayoutProvider>
              <LayoutContainer>
                <AppRoutes />
              </LayoutContainer>
            </LayoutProvider>
          </ThemeProvider>
        </Router>
      </PersistGate>
    </ReduxProvider>
  );
};

export default App;
