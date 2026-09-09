import { useState, createContext, useContext, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import KnowledgeTree from './pages/KnowledgeTree';
import StorageControl from './pages/StorageControl';
import SearchPage from './pages/SearchPage';
import AIAssistant from './pages/AIAssistant';
import Reports from './pages/Reports';
import Archive from './pages/Archive';
import AuditLog from './pages/AuditLog';
import Settings from './pages/Settings';
import Workflows from './pages/Workflows';
import Meetings from './pages/Meetings';
import { StoreContext, getStore, StoreState } from './store';
import { ToastContainer } from './components/Modals';

interface AppContextType {
  darkMode: boolean;
  toggleDark: () => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  language: 'fa' | 'en';
  setLanguage: (l: 'fa' | 'en') => void;
}

export const AppContext = createContext<AppContextType>({
  darkMode: false,
  toggleDark: () => {},
  sidebarCollapsed: false,
  toggleSidebar: () => {},
  language: 'fa',
  setLanguage: () => {},
});

export const useApp = () => useContext(AppContext);

function App() {
  const store = getStore();
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [language, setLanguage] = useState<'fa' | 'en'>('fa');
  const [, setRender] = useState(0);

  // Force re-render when store changes
  useEffect(() => {
    const interval = setInterval(() => setRender(r => r + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleDark = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };
  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  return (
    <StoreContext.Provider value={store}>
      <AppContext.Provider value={{
        darkMode, toggleDark,
        sidebarCollapsed, toggleSidebar,
        language, setLanguage,
      }}>
        <HashRouter>
          <Routes>
            <Route path="/login" element={store.user ? <Navigate to="/" /> : <Login />} />
            <Route path="/" element={store.user ? <Layout /> : <Navigate to="/login" />}>
              <Route index element={<Dashboard />} />
              <Route path="documents" element={<Documents />} />
              <Route path="knowledge-tree" element={<KnowledgeTree />} />
              <Route path="storage" element={<StorageControl />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="ai" element={<AIAssistant />} />
              <Route path="reports" element={<Reports />} />
              <Route path="archive" element={<Archive />} />
              <Route path="audit" element={<AuditLog />} />
              <Route path="settings" element={<Settings />} />
              <Route path="workflows" element={<Workflows />} />
              <Route path="meetings" element={<Meetings />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <ToastContainer />
        </HashRouter>
      </AppContext.Provider>
    </StoreContext.Provider>
  );
}

export default App;
