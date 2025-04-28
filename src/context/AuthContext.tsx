import React, { createContext, useContext, useState, useEffect } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { User } from '../types';
import {
  getUser,
  authenticateWithGoogle,
  logoutUser,
} from '../utils/authUtils';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
type MerchantSelect = {
  id: string;
  name: string;
};
interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => void;
  fetchMerchantAccounts: () => void;
  fetchReports: (gmcAccountId: string) => Promise<any>;
  merchantAccounts: Array<T> | null;
  reportData: ReportData | null;
  setMerchantSelect: Dispatch<SetStateAction<MerchantSelect | null>>;
  merchantSelect: MerchantSelect | null;
  setReportData: Dispatch<SetStateAction<[] | null>>;
}

type ReportSummary = {
  impressions: string;
  clicks: string;
};

type ChangeSummary = {
  change: string;
  percent: string;
};

type ReportData = {
  current: {
    summary: ReportSummary;
    data: any[];
    chartData: any[];
  };
  previous: {
    summary: ReportSummary;
    data: any[];
    chartData: any[];
  };
  change: {
    impressions: ChangeSummary;
    clicks: ChangeSummary;
  };
};
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [merchantAccounts, setMerchantAccounts] = useState<[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<string | null>(
    null
  );
  const [merchantSelect, setMerchantSelect] = useState<MerchantSelect | null>(
    null
  );
  const [filter, setFilter] = useState({});
  const [exportData, setExportData] = useState<
    Record<string, { headers: string[]; data: any[] }>
  >({});
  const [token, setToken] = useState('');
  useEffect(() => {
    // Check if user is already logged in
    const savedUser = getUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const authToken = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      return `?token=${token}`;
    }
    toast.error('No Token found please login again');
    return '';
  };

  const login = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const user = await authenticateWithGoogle();
      setUser(user);
    } catch (error) {
      setError('Failed to authenticate with Google');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMerchantAccounts = async () => {
    const url = `${
      import.meta.env.VITE_API_URL
    }/api/merchant_account_list${authToken()}`;

    try {
      if (!user) return;

      const response = await axios.get(url, {
        withCredentials: true,
      });

      const merchantAccounts = response.data.accounts;

      setMerchantAccounts(merchantAccounts);
    } catch (error) {
      console.error('Error fetching merchant accounts:', error);
    }
  };

  const fetchReports = async (gmcAccountId: string, date, filter) => {
    const url = `${
      import.meta.env.VITE_API_URL
    }/api/fetch_reports${authToken()}`;
    try {
      const response = await axios.post(
        url,
        {
          gmcAccountId,
          date,
          filter,
        },
        {
          withCredentials: true,
        }
      );

      setReportData(response.data);

      return response.data;
    } catch (error: any) {
      if (error.response) {
        toast.error('Please enter a value to filter!');
        console.error(
          'API Error:',
          error.response.data?.message || 'Unknown error'
        );
      } else if (error.request) {
        // No response from server
        console.error('Network Error: No response received');
      } else {
        // Other error
        console.error('Error:', error.message);
      }
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        logout,
        merchantAccounts,
        fetchMerchantAccounts,
        fetchReports,
        reportData,
        setMerchantSelect,
        merchantSelect,
        setReportData,
        setSelectedDateRange,
        selectedDateRange,
        setExportData,
        exportData,
        setToken,
        token,
        setFilter,
        filter,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
