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
import CustomReportBuilder from './pages/CustomReportBuilderPage';
import FocusKeywordAI from './pages/FocusKeywordAI';
import XmlConverter from './pages/XmlConverter';
import OnlineDashboard from './components/dashboard/OnlineDashboard';
import LocalDashboard from './components/dashboard/LocalDashboard';
import StoreDetails from './components/dashboard/StoreDetails';

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
            {/* <Route path='reports' element={<CustomReportBuilder />} /> */}
            <Route path='insights/:insightType' element={<InsightsPage />} />
            <Route path='focus-keyword-ai' element={<FocusKeywordAI />} />
          </Route>

          {/* <Route path="*" element={<Navigate to="/dashboard" replace />} /> */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
