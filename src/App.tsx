import React from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import InsightsPage from './pages/InsightsPage';
import FocusKeywordAI from './pages/FocusKeywordAI';
import XmlConverter from './pages/XmlConverter';
import OnlineDashboard from './components/dashboard/OnlineDashboard';
import LocalDashboard from './components/dashboard/LocalDashboard';
import StoreDetails from './components/dashboard/StoreDetails';
import Playbook from './components/playbook/playbook';
import AuditFeed from './components/playbook/container/AuditFeed';
import DataBridge from './pages/DataBridge';
import FeedAudit from './components/playbook/feed_audit/container';
import FeedAuditProducts from './components/playbook/feed_audit/FeedAuditProducts';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/' element={<Layout />}>
            <Route index element={<Navigate to='/dashboard' replace />} />
            <Route path='dashboard' element={<DashboardPage />} />
            <Route path='Online' element={<OnlineDashboard />} />
            <Route path='LOCAL' element={<LocalDashboard />} />
            <Route path='/LOCAL/:storeId' element={<StoreDetails />} />
            <Route path='xml-converter' element={<XmlConverter />} />
            <Route path='insights/:insightType' element={<InsightsPage />} />
            <Route path='focus-keyword-ai' element={<FocusKeywordAI />} />
            <Route path='playbook' element={<Playbook />} />
            <Route path='playbook/audit-feed' element={<AuditFeed />} />
            <Route path='playbook/feed-audit' element={<FeedAudit />} />
            <Route
              path='playbook/feed-audit/products'
              element={<FeedAuditProducts />}
            />
            <Route path='playbook/data-bridge' element={<DataBridge />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
