import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import LandingPage from './pages/LandingPage';
import HistoryPage from './pages/HistoryPage';
import ComparisonPage from './pages/ComparisonPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import ToastProvider from './providers/ToastProvider';

function App() {
  return (
    <ToastProvider>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/comparison" element={<ComparisonPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </AppLayout>
      </Router>
    </ToastProvider>
  );
}

export default App;
