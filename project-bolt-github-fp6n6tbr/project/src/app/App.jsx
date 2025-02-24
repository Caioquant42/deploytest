import { useRoutes } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
// ROOT THEME PROVIDER
import { MatxTheme } from "./components";
// ALL CONTEXTS
import SettingsProvider from "./contexts/SettingsContext";
import { AuthProvider } from "./contexts/FirebaseAuthContext";
// ERROR BOUNDARY
import ErrorBoundary from "./components/ErrorBoundary";
// ROUTES
import routes from "./routes";
// FAKE SERVER
import "../__api__";

export default function App() {
  const content = useRoutes(routes);

  return (
    <ErrorBoundary>
      <SettingsProvider>
        <AuthProvider>
          <MatxTheme>
            <CssBaseline />
            {content}
          </MatxTheme>
        </AuthProvider>
      </SettingsProvider>
    </ErrorBoundary>
  );
}