import React, { createContext, useContext, useState, useEffect } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { User } from '../types';
import {
  getUser,
  authenticateWithGoogle,
  logoutUser,
} from '../utils/authUtils';
import axios from 'axios';
import toast from 'react-hot-toast';
type MerchantSelect = {
  id: string;
  name: string;
};
import { format, subDays } from 'date-fns';
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
  const [adsAccounts, setAdsAccounts] = useState<[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [liaReportData, setLiaReportData] = useState<ReportData | null>(null);
  const [selectedAdsAccount, setSelectedAdsAccount] = useState<string | null>(
    null
  );
  const [selectedDateRange, setSelectedDateRange] = useState<string | null>(
    null
  );
  const [liaStoreData, setLiaStoreData] = useState([]);
  const [previousDateRange, setPreviousDateRange] = useState(null);
  const [merchantSelect, setMerchantSelect] = useState<MerchantSelect | null>(
    null
  );
  const [traffic, setTraffic] = useState('');
  const [filter, setFilter] = useState({});
  const [auditFeedData, setAuditFeedData] = useState<Function | null>(null);
  const [allProducts, setAllProducts] = useState([]);
  const [exportData, setExportData] = useState<
    Record<string, { headers: string[]; data: any[] }>
  >({});
  const [showFilterModal, setShowFilterModal] = useState(true);
  const [startFetching, setStartFetching] = useState(false);
  const [token, setToken] = useState('');
  useEffect(() => {
    const savedUser = getUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);
  const [aiInsigthResponse, setAiInsigthResponse] = useState(null);
  const [country, setCountry] = useState({ value: 'AU', label: 'Australia' });
  const [formattedDateRange, setFormattedDateRange] = useState({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });
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

  const auditFeed = async (feedUrl, fetchAll = false) => {
    const url = `${import.meta.env.VITE_API_URL}/api/audit-feed${authToken()}`;
    try {
      const response = await axios.get(url, {
        withCredentials: true,
      });
      console.log(response.data);
      setAuditFeedData(response.data);
      setAllProducts(response.data.items);
    } catch (error) {
      console.error('Error auditing feed:', error);
    }
  };

  const fetchAdsAccounts = async () => {
    const url = `${
      import.meta.env.VITE_API_URL
    }/api/list-ads-Accounts${authToken()}`;

    try {
      if (!user) return;

      const response = await axios.get(url, {
        withCredentials: true,
      });

      const adsAccounts = response.data.accounts;

      setAdsAccounts(adsAccounts);
    } catch (error) {
      toast.error('Your Access token is expired please sign in again');
      console.error('Error fetching ads accounts:', error);
    }
  };

  const fetchGoogleProductCategory = async (gmcAccountId) => {
    const url = `${
      import.meta.env.VITE_API_URL
    }/api/get-google-product-category${authToken()}&gmcAccountId=${gmcAccountId}`;

    try {
      if (!user) return;
      const response = await axios.get(url, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching merchant accounts:', error);
    }
  };

  const fetchReports = async (
    gmcAccountId: string,
    date,
    filter,
    previousDateRange
  ) => {
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
          previousDateRange,
        },
        {
          withCredentials: true,
        }
      );

      setReportData(response.data);

      return response.data;
    } catch (error: any) {
      if (error.response) {
        toast.error('Please Login Again');
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
  const fetchLiaReports = async (
    adsAccountId,
    dateRange,
    channel = 'LOCAL'
  ) => {
    const url = `${import.meta.env.VITE_API_URL}/api/lia-report${authToken()}`;
    try {
      const response = await axios.post(
        url,
        {
          adsAccountId,
          dateRange,
          channel,
        },
        {
          withCredentials: true,
        }
      );

      setLiaReportData(response.data);

      return response.data;
    } catch (error: any) {
      if (error.response) {
        toast.error('Please Login Again');
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
  const fetchLiaStoreData = async (adsAccountId, dateRange, storeId) => {
    const url = `${
      import.meta.env.VITE_API_URL
    }/api/list-store-data${authToken()}`;
    try {
      const response = await axios.post(
        url,
        {
          adsAccountId,
          dateRange,
          storeId,
        },
        {
          withCredentials: true,
        }
      );

      setLiaStoreData(response.data);

      return response.data;
    } catch (error: any) {
      if (error.response) {
        toast.error('Please Login Again');
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

  const askAiInsigth = async (adsAccountId, question) => {
    const url = `${import.meta.env.VITE_API_URL}/api/ai-insigth${authToken()}`;
    try {
      const response = await axios.post(
        url,
        {
          adsAccountId,
          question,
        },
        {
          withCredentials: true,
        }
      );

      setAiInsigthResponse(response.data);

      return response.data;
    } catch (error: any) {
      if (error.response) {
        toast.error('Please Login Again');
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

  const exportLiaSheet = async (exportData) => {
    const url = `${
      import.meta.env.VITE_API_URL
    }/api/lia-report-sheet${authToken()}`;
    try {
      const response = await axios.post(
        url,
        {
          exportData,
        },
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error: any) {
      if (error.response) {
        toast.error('Please Login Again');
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
        fetchGoogleProductCategory,
        setPreviousDateRange,
        previousDateRange,
        setCountry,
        country,
        adsAccounts,
        fetchAdsAccounts,
        fetchLiaReports,
        liaReportData,
        setSelectedAdsAccount,
        selectedAdsAccount,
        fetchLiaStoreData,
        liaStoreData,
        setFormattedDateRange,
        formattedDateRange,
        setLiaReportData,
        askAiInsigth,
        aiInsigthResponse,
        setLiaStoreData,
        exportLiaSheet,
        auditFeed,
        auditFeedData,
        setShowFilterModal,
        showFilterModal,
        startFetching,
        setStartFetching,
        setTraffic,
        traffic,
        allProducts,
        setAllProducts,
        setAuditFeedData,
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
