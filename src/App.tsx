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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/' element={<Layout />}>
            <Route
              index
              element={<Navigate to='/focus-keyword-ai' replace />}
            />
            <Route path='dashboard' element={<DashboardPage />} />
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
