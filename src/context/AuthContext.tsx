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
  fetchReports: (
    gmcAccountId: string,
    date: any,
    filter: any,
    previousDateRange: any
  ) => Promise<any>;
  merchantAccounts: any[] | null;
  reportData: ReportData | null;
  setMerchantSelect: Dispatch<SetStateAction<MerchantSelect | null>>;
  merchantSelect: MerchantSelect | null;
  setReportData: Dispatch<SetStateAction<ReportData | null>>;
  // Feed audit
  auditFeed: (id: string) => Promise<any>;
  auditFeedData: any | null;
  setAuditFeedData: Dispatch<SetStateAction<any | null>>;
  // All products matrix
  fetchAllProductsMatrix: (merchantId: string) => Promise<any>;
  productsMatrix: any | null;
  setProductsMatrix: Dispatch<SetStateAction<any | null>>;
  // Products performance summary
  fetchProductsPerformanceSummary: (
    merchantId: string
  ) => Promise<ProductsPerformanceSummary | undefined>;
  productsPerformanceSummary: ProductsPerformanceSummary | null;
  productsPerformanceLoading: boolean;
  // Products matrix paginated by performance type
  fetchProductsMatrixPaginated: (
    type:
      | 'withImpressions'
      | 'withClicks'
      | 'withoutImpressions'
      | 'withoutClicks',
    pageSize?: number,
    pageToken?: string,
    merchantId?: string
  ) => Promise<
    | {
        message: string;
        merchantId: number;
        type: string;
        pageSize: number;
        nextPageToken?: string;
        items: any[];
      }
    | undefined
  >;
  // Date range
  setSelectedDateRange: Dispatch<SetStateAction<string | null>>;
  selectedDateRange: string | null;
  // Exports and tokens
  setExportData: Dispatch<
    SetStateAction<Record<string, { headers: string[]; data: any[] }>>
  >;
  exportData: Record<string, { headers: string[]; data: any[] }>;
  setToken: Dispatch<SetStateAction<string>>;
  token: string;
  setFilter: Dispatch<SetStateAction<any>>;
  filter: any;
  fetchGoogleProductCategory: (gmcAccountId: string) => Promise<any>;
  setPreviousDateRange: Dispatch<SetStateAction<any>>;
  previousDateRange: any;
  setCountry: Dispatch<SetStateAction<{ value: string; label: string }>>;
  country: { value: string; label: string };
  adsAccounts: any[] | null;
  fetchAdsAccounts: () => Promise<void>;
  fetchLiaReports: (
    adsAccountId: string,
    dateRange: any,
    channel?: string
  ) => Promise<any>;
  liaReportData: ReportData | null;
  setSelectedAdsAccount: Dispatch<SetStateAction<string | null>>;
  selectedAdsAccount: string | null;
  fetchLiaStoreData: (
    adsAccountId: string,
    dateRange: any,
    storeId: string
  ) => Promise<any>;
  liaStoreData: any[];
  setFormattedDateRange: Dispatch<
    SetStateAction<{ startDate: string; endDate: string }>
  >;
  formattedDateRange: { startDate: string; endDate: string };
  setLiaReportData: Dispatch<SetStateAction<ReportData | null>>;
  askAiInsigth: (adsAccountId: string, question: string) => Promise<any>;
  aiInsigthResponse: any;
  setLiaStoreData: Dispatch<SetStateAction<any[]>>;
  exportLiaSheet: (exportData: any) => Promise<any>;
  setShowFilterModal: Dispatch<SetStateAction<boolean>>;
  showFilterModal: boolean;
  startFetching: boolean;
  setStartFetching: Dispatch<SetStateAction<boolean>>;
  setTraffic: Dispatch<SetStateAction<string>>;
  traffic: string;
  allProducts: any[];
  setAllProducts: Dispatch<SetStateAction<any[]>>;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  sidebarOpen: boolean;
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

// Products Performance Summary type (from API shape)
export type ProductsPerformanceSummary = {
  message: string;
  merchantId: number;
  totalItems: number;
  summary: {
    productsWithImpressions: {
      count: number;
      totalImpressions: number;
    };
    productsWithoutImpressions: {
      count: number;
    };
    productsWithClicks: {
      count: number;
      totalClicks: number;
    };
    productsWithoutClicks: {
      count: number;
    };
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
  const [liaStoreData, setLiaStoreData] = useState<any[]>([]);
  const [previousDateRange, setPreviousDateRange] = useState(null);
  const [merchantSelect, setMerchantSelect] = useState<MerchantSelect | null>(
    null
  );
  const [traffic, setTraffic] = useState('');
  const [filter, setFilter] = useState({});
  const [auditFeedData, setAuditFeedData] = useState<any | null>(null);
  const [productsMatrix, setProductsMatrix] = useState<any | null>(null);
  const [productsPerformanceSummary, setProductsPerformanceSummary] =
    useState<ProductsPerformanceSummary | null>(null);
  const [productsPerformanceLoading, setProductsPerformanceLoading] =
    useState<boolean>(false);
  const [allProducts, setAllProducts] = useState<any[]>([]);
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
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

  const auditFeed = async (id: string) => {
    const url = `${
      import.meta.env.VITE_API_URL
    }/api/audit-feed${authToken()}&merchantId=${id}`;
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

  const fetchAllProductsMatrix = async (merchantId: string) => {
    const url = `${
      import.meta.env.VITE_API_URL
    }/api/fetch-all-products-matrix${authToken()}&merchantId=${merchantId}`;
    try {
      const response = await axios.get(url, {
        withCredentials: true,
      });
      setProductsMatrix(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching all products matrix:', error);
    }
  };

  // Fetch Products Performance Summary
  const fetchProductsPerformanceSummary = async (
    merchantId: string
  ): Promise<ProductsPerformanceSummary | undefined> => {
    const url = `${
      import.meta.env.VITE_API_URL
    }/api/fetch-all-products-matrix${authToken()}&merchantId=${merchantId}`;
    try {
      setProductsPerformanceLoading(true);
      const response = await axios.get(url, {
        withCredentials: true,
      });
      setProductsPerformanceSummary(response.data);
      return response.data as ProductsPerformanceSummary;
    } catch (error) {
      console.error('Error fetching products performance summary:', error);
    } finally {
      setProductsPerformanceLoading(false);
    }
  };

  // Fetch Products Matrix Paginated by performance type
  const fetchProductsMatrixPaginated = async (
    type:
      | 'withImpressions'
      | 'withClicks'
      | 'withoutImpressions'
      | 'withoutClicks',
    pageSize = 100,
    pageToken?: string,
    merchantIdParam?: string
  ) => {
    const mId = merchantIdParam || (merchantSelect as any)?.merchantId || '';
    const url = `${
      import.meta.env.VITE_API_URL
    }/api/fetch-products-matrix-paginated${authToken()}&merchantId=${mId}&type=${type}&pageSize=${pageSize}${
      pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''
    }`;
    try {
      const response = await axios.get(url, {
        withCredentials: true,
      });
      return response.data as {
        message: string;
        merchantId: number;
        type: string;
        pageSize: number;
        nextPageToken?: string;
        items: any[];
      };
    } catch (error) {
      console.error('Error fetching products matrix paginated:', error);
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

  const fetchGoogleProductCategory = async (gmcAccountId: string) => {
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
    date: any,
    filter: any,
    previousDateRange: any
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
    adsAccountId: string,
    dateRange: any,
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
  const fetchLiaStoreData = async (
    adsAccountId: string,
    dateRange: any,
    storeId: string
  ) => {
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

  const askAiInsigth = async (adsAccountId: string, question: string) => {
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

  const exportLiaSheet = async (exportData: any) => {
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
        fetchAllProductsMatrix,
        productsMatrix,
        setProductsMatrix,
        fetchProductsPerformanceSummary,
        productsPerformanceSummary,
        productsPerformanceLoading,
        fetchProductsMatrixPaginated,
        setShowFilterModal,
        showFilterModal,
        startFetching,
        setStartFetching,
        setTraffic,
        traffic,
        allProducts,
        setAllProducts,
        setAuditFeedData,
        setSidebarOpen,
        sidebarOpen,
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
