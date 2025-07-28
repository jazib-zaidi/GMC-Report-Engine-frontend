import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Circle,
  Sparkles,
  AlertTriangle,
  Loader,
  SheetIcon,
  MoveLeftIcon,
  MoveLeft,
  ArrowLeft,
} from 'lucide-react';
import { cn } from '../utils/cn';
import ExcelImportScreen from '../components/focusKeyword/uploadFile';

import InsightsTable from '../components/insights/InsightsTable';
import ProductTable from '../components/focusKeyword/DetailTable';
import AIOptimization from '../components/focusKeyword/AiOptimization';
import {
  connect,
  googleSheet,
  keywordGenerated,
  onGenerationComplete,
  promptTokens,
  startGeneration,
} from '../socket';
import TokenDetailsModal from '../components/focusKeyword/TokenDetailsModal';
import CountrySelect from '../components/focusKeyword/CountrySelect';
import { useAuth } from '../context/AuthContext';

interface OptimizationData {
  'Item ID': string;
  'Title': string;
  'Focus Keyword': string;
  'Description': string;
}

const AIOptimizationScreen = () => {
  const [uploadedData, setUploadedData] = useState({});
  const [optimizationStarted, setOptimizationsStarted] = useState(false);
  const [receivedRows, setReceivedRows] = useState<OptimizationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [sheetUrl, setSheetUrl] = useState('');
  const [tokenDetails, setDetails] = useState({});
  const { country } = useAuth();

  const handleGoogleSheetNavigate = () => {
    window.open(sheetUrl, '_blank');
  };
  useEffect(() => {
    onGenerationComplete((data) => {});
    googleSheet((data) => {
      setSheetUrl(data.spreadsheetUrl);
    });

    promptTokens((data) => {
      setDetails(data);
    });

    keywordGenerated((data: OptimizationData) => {
      setReceivedRows((prevRows) => {
        // Check if the Item ID already exists in prevRows
        const isDuplicate = prevRows.some(
          (row) => row['Item ID'] === data['Item ID']
        );
        if (isDuplicate) {
          return prevRows; // If duplicate, don't add the new data
        }

        // Otherwise, add the new data to the array
        return [...prevRows, data];
      });

      setOptimizationsStarted(true);
    });
  }, []);

  const handleGenerate = () => {
    connect();
    setLoading(true);
    const token = localStorage.getItem('authToken');
    if (token) {
      startGeneration({ data: uploadedData?.data, token, country });
    }
  };
  // return <AIOptimization />;
  console.log(uploadedData);
  return uploadedData?.message !== 'File Uploaded' ? (
    <ExcelImportScreen setUploadedData={setUploadedData} />
  ) : (
    <div className='flex flex-col items-end gap-y-4'>
      {optimizationStarted ? (
        <div className='flex flex-col items-end gap-y-4 w-full'>
          {sheetUrl && (
            <div className='flex items-center justify-between w-full'>
              <TokenDetailsModal tokenDetails={tokenDetails} />
              <button
                onClick={handleGoogleSheetNavigate}
                className='px-4 py-1.5 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 flex  items-center gap-x-2'
              >
                <SheetIcon size={16} />
                Open in Google Sheet
              </button>
            </div>
          )}

          <ProductTable product={receivedRows.reverse()} isAi={true} />
        </div>
      ) : (
        <div className='flex flex-col  gap-y-4 w-full'>
          <div className=''>
            <Button
              onClick={() => {
                setUploadedData({});
              }}
              variant='outline'
            >
              <ArrowLeft /> Go Back
            </Button>
          </div>
          <div className='flex items-center justify-between'>
            <div className='w-60'>
              <CountrySelect showLabel={false} />
            </div>
            <button
              disabled={loading}
              onClick={handleGenerate}
              className=' bg-gradient-to-r from-[#a457f7] via-[#3f80f6] to-[#a457f7] rounded-[0.48rem] flex gap-2 py-[0.55rem] px-[0.9rem] text-white border-none bg-[length:300%]'
            >
              {loading ? (
                <Loader className='animate-spin' />
              ) : (
                <svg
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M9.6 5.613C7.91 5.466 6.98 4.874 6.484 3.7C6.305 3.277 6.18 2.783 6.1 2.2C6.1 2.1 6 2 5.9 2C5.8 2 5.7 2.1 5.7 2.2C5.62 2.783 5.495 3.277 5.316 3.7C4.821 4.874 3.891 5.466 2.2 5.613C2.1 5.613 2 5.713 2 5.813C2 5.913 2.1 6.013 2.2 6.013C4.3 6.413 5.4 7.2 5.7 9.4C5.7 9.5 5.8 9.6 5.9 9.6C6 9.6 6.1 9.5 6.1 9.4C6.4 7.2 7.5 6.413 9.6 6.013C9.7 6.013 9.8 5.913 9.8 5.813C9.8 5.713 9.7 5.613 9.6 5.613ZM19.469 11.865C15.469 11.065 13.743 9.135 12.943 5.236C12.9161 5.1305 12.8549 5.03688 12.7692 4.96976C12.6834 4.90265 12.5779 4.86581 12.469 4.865C12.3593 4.86587 12.253 4.90333 12.1669 4.97143C12.0809 5.03954 12.02 5.1344 11.994 5.241C11.985 5.247 12.001 5.226 11.994 5.241C11.194 9.241 9.369 11.065 5.469 11.865C5.33639 11.865 5.20921 11.9177 5.11545 12.0114C5.02168 12.1052 4.969 12.2324 4.969 12.365C4.969 12.4976 5.02168 12.6248 5.11545 12.7186C5.20921 12.8123 5.33639 12.865 5.469 12.865C9.469 13.665 11.186 15.552 11.986 19.452C12.0049 19.5667 12.0637 19.6711 12.1521 19.7467C12.2405 19.8223 12.3527 19.8642 12.469 19.865C12.5806 19.864 12.6885 19.8252 12.7751 19.7549C12.8618 19.6846 12.922 19.587 12.946 19.478C12.941 19.488 12.952 19.47 12.946 19.478C13.746 15.478 15.569 13.665 19.469 12.865C19.6016 12.865 19.7288 12.8123 19.8226 12.7186C19.9163 12.6248 19.969 12.4976 19.969 12.365C19.969 12.2324 19.9163 12.1052 19.8226 12.0114C19.7288 11.9177 19.6016 11.865 19.469 11.865ZM21.465 5.8C21.465 5.716 21.404 5.66 21.321 5.644L21.265 5.631C20.097 5.326 19.389 4.607 19.192 3.523C19.192 3.48242 19.1759 3.44351 19.1472 3.41481C19.1185 3.38612 19.0796 3.37 19.039 3.37V3.374C18.955 3.374 18.899 3.436 18.883 3.518L18.87 3.574C18.565 4.742 17.846 5.45 16.762 5.647C16.7214 5.647 16.6825 5.66312 16.6538 5.69181C16.6251 5.72051 16.609 5.75942 16.609 5.8H16.613C16.613 5.884 16.675 5.94 16.758 5.956L16.813 5.969C17.981 6.274 18.689 6.993 18.886 8.077C18.886 8.161 18.955 8.23 19.039 8.23V8.226C19.123 8.226 19.179 8.164 19.195 8.081L19.209 8.026C19.513 6.858 20.232 6.15 21.316 5.953C21.336 5.953 21.3557 5.94903 21.3741 5.9413C21.3925 5.93358 21.4092 5.92226 21.4231 5.90801C21.4371 5.89376 21.4481 5.87687 21.4555 5.85832C21.4628 5.83978 21.4654 5.81995 21.465 5.8ZM7.919 18.715C6.919 18.415 6.337 17.933 6.137 16.933C6.137 16.8752 6.11403 16.8197 6.07315 16.7789C6.03227 16.738 5.97682 16.715 5.919 16.715C5.86118 16.715 5.80573 16.738 5.76485 16.7789C5.72397 16.8197 5.701 16.8752 5.701 16.933C5.401 17.933 4.919 18.515 3.919 18.715C3.86118 18.715 3.80573 18.738 3.76485 18.7789C3.72397 18.8197 3.701 18.8752 3.701 18.933C3.701 18.9908 3.72397 19.0463 3.76485 19.0871C3.80573 19.128 3.86118 19.151 3.919 19.151C4.919 19.451 5.501 19.933 5.701 20.933C5.701 20.9908 5.72397 21.0463 5.76485 21.0871C5.80573 21.128 5.86118 21.151 5.919 21.151C5.97682 21.151 6.03227 21.128 6.07315 21.0871C6.11403 21.0463 6.137 20.9908 6.137 20.933C6.437 19.933 6.919 19.351 7.919 19.151C7.97682 19.151 8.03227 19.128 8.07315 19.0871C8.11403 19.0463 8.137 18.9908 8.137 18.933C8.137 18.8752 8.11403 18.8197 8.07315 18.7789C8.03227 18.738 7.97682 18.715 7.919 18.715Z'
                    fill='white'
                  ></path>
                </svg>
              )}
              Optimize With AI
            </button>
          </div>
          <ProductTable product={uploadedData?.data} />
        </div>
      )}
    </div>
  );
};

export default AIOptimizationScreen;
