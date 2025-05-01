import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function CustomReportBuilder() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const {
    exportData,
    selectedDateRange,
    reportData,
    merchantSelect,
    previousDateRange,
  } = useAuth();

  const [reportName, setReportName] = useState(
    `FeedOps ${merchantSelect?.name} Google Merchant Center Report for ${selectedDateRange?.startDate} - ${selectedDateRange?.endDate}`
  );
  const authToken = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      return `?token=${token}`;
    }
    toast.error('No Token found please login again');
    return '';
  };

  const handleExport = async () => {
    try {
      setLoading(true);

      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 300);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/google-sheet${authToken()}`,
        {
          reportName,
          selectedDateRange,
          previousDateRange,
          reportData,
        },
        {
          withCredentials: true,
        }
      );

      clearInterval(progressInterval);
      setProgress(100);

      window.open(response.data.url, '_blank');

      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 1000);
    } catch (error) {
      console.error('Export failed:', error);
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className=' '>
      <div className=' mx-auto'>
        <div className='mb-6'>
          <label
            htmlFor='reportName'
            className='block text-lg text-gray-800 mb-2'
          >
            Name of the report
          </label>
          <input
            type='text'
            id='reportName'
            className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Enter name of report'
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
          />
        </div>
        {/* Sidebar Option */}
        {/* Report Builder Section */}
        <div className='mb-8'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>
            Report builder
          </h2>

          <div className='rounded-md p-8 h-80  bg-white'>
            <div className='border-4 border-dashed border-gray-300 h-full flex items-center justify-center'>
              <div className='text-center'>
                <h3 className='text-xl text-gray-700 mb-4'>
                  You’re almost there! Your custom report is ready to be
                  exported.
                </h3>

                {/* Loading Progress Bar */}
                {loading && (
                  <div className='w-full mb-4'>
                    <div className='bg-gray-200 rounded-full h-2.5'>
                      <div
                        className='bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out'
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className='text-sm text-gray-600 mt-1'>
                      Exporting report... {progress}%
                    </p>
                  </div>
                )}

                <button
                  onClick={handleExport}
                  disabled={loading}
                  className={`bg-blue-600 hover:bg-blue-700 text-white py-2 px-8 rounded-md transition duration-200 ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Exporting...' : 'Export Your Custom Report'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
