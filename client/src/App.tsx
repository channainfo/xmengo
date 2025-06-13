import { AnimatePresence } from 'framer-motion';

// Routes
import AppRoutes from './routes';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SocketProvider } from './contexts/SocketContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ToastProvider } from './contexts/ToastContext';

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <AuthProvider>
        <SocketProvider>
          <NotificationProvider>
            <ToastProvider>
              <AnimatePresence mode="wait">
                <AppRoutes />
              </AnimatePresence>
            </ToastProvider>
          </NotificationProvider>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
