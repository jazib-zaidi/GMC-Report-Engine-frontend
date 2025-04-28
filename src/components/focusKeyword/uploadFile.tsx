import React, { useState, useCallback, useEffect } from 'react';
import {
  File,
  FilePlus,
  AlertTriangle,
  CheckCircle,
  UploadCloud,
  XCircle,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import { Progress } from '../../utils/Progress';
import toast from 'react-hot-toast';

// Types
interface FileWithPath extends File {
  path: string;
}

// Animation Variants
const fileVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: 10, transition: { duration: 0.2 } },
};

const statusVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto', transition: { duration: 0.4 } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.3 } },
};

const ExcelImportScreen = ({ setUploadedData }) => {
  const [file, setFile] = useState<FileWithPath | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [optimizationStarted, setOptimizationStarted] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [progress, setProgress] = useState(0);

  // Handlers
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        const fileWithPath = selectedFile as FileWithPath;
        fileWithPath.path = selectedFile.name;
        setFile(fileWithPath);
        setUploadSuccess(null);
        setErrorMessage(null);
        setUploadProgress(0);
        setOptimizationStarted(false);
      }
    },
    []
  );

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.name.endsWith('.xlsx')) {
      const fileWithPath = droppedFile as FileWithPath;
      fileWithPath.path = droppedFile.name;
      setFile(fileWithPath);
      setUploadSuccess(null);
      setErrorMessage(null);
      setUploadProgress(0);
      setOptimizationStarted(false);
    } else {
      setErrorMessage('Please upload a valid Excel (.xlsx) file.');
    }
  }, []);
  const authToken = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      return `?token=${token}`;
    }
    toast.error('No Token found please login again');
    return '';
  };

  const handleFileUpload = useCallback(() => {
    if (!file) {
      setErrorMessage('Please select a file to upload.');
      return;
    }
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 5;
      });
    }, 500);

    setIsUploading(true);
    setErrorMessage(null);
    setUploadSuccess(null);
    setUploadProgress(0);
    setOptimizationStarted(false);

    const formData = new FormData();
    formData.append('file', file);

    import('axios').then(({ default: axios }) => {
      axios
        .post(
          `${import.meta.env.VITE_API_URL}/api/upload-xlsx${authToken()}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 70) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
            },
          }
        )
        .then((res) => {
          setUploadedData(res.data);
          setIsUploading(false);
          setUploadSuccess(true);
          setFile(null);
          setOptimizationStarted(true);
          setUploadProgress(0);
          setProgress(100);
        })
        .catch((error) => {
          console.error('Upload error:', error);
          setIsUploading(false);
          setUploadSuccess(false);
          setErrorMessage(
            error?.response?.data?.message || 'Failed to upload file.'
          );
          setUploadProgress(0);
        });
    });
  }, [file, setUploadedData]);

  const handleFileRemove = () => {
    setFile(null);
    setUploadSuccess(null);
    setErrorMessage(null);
    setUploadProgress(0);
    setOptimizationStarted(false);
  };

  useEffect(() => {
    if (optimizationStarted) {
      const timer = setTimeout(() => {
        setOptimizationStarted(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [optimizationStarted]);

  return (
    <div className='flex items-center justify-center'>
      <div className='w-full max-w-2xl space-y-8'>
        {/* Header */}
        <div className='text-center space-y-3'>
          <h1 className='text-4xl font-bold text-gray-900 tracking-tight'>
            Import Excel for Keyword Optimization
          </h1>
          <p className='text-gray-600 max-w-lg mx-auto'>
            Upload your Excel file to optimize your product data keyword.
          </p>
        </div>

        {/* Main Card */}
        <div className='bg-white rounded-2xl shadow-xl p-8 border border-gray-100'>
          {/* Upload Area */}
          <div
            className={cn(
              'border-2 border-dashed rounded-xl p-8 transition-all duration-200 text-center mb-6',
              isDragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300',
              file ? 'bg-blue-50/50 border-blue-200' : ''
            )}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type='file'
              accept='.xlsx'
              onChange={handleFileChange}
              className='hidden'
              id='file-input'
            />

            <div className='space-y-4'>
              <div className='flex justify-center'>
                {file ? (
                  <div className='bg-blue-100 rounded-full p-3'>
                    <File className='w-8 h-8 text-blue-600' />
                  </div>
                ) : (
                  <div className='bg-gray-100 rounded-full p-3'>
                    <UploadCloud className='w-8 h-8 text-gray-600' />
                  </div>
                )}
              </div>

              <div className='space-y-2'>
                {!file ? (
                  <>
                    <h3 className='text-lg font-semibold text-gray-800'>
                      Drag and drop your Excel file
                    </h3>
                    <p className='text-gray-500 text-sm'>or</p>
                    <label
                      htmlFor='file-input'
                      className='inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer'
                    >
                      <FilePlus className='w-4 h-4' />
                      Browse Files
                    </label>
                    <p className='text-xs text-gray-500 mt-2'>
                      Supports .xlsx files only
                    </p>
                  </>
                ) : (
                  <div className='space-y-3'>
                    <h3 className='text-lg font-semibold text-gray-800'>
                      File Selected
                    </h3>
                    <AnimatePresence>
                      <motion.div
                        variants={fileVariants}
                        initial='hidden'
                        animate='visible'
                        exit='exit'
                        className='flex items-center justify-between gap-2 px-4 py-3 rounded-lg bg-white border border-blue-200 mx-auto max-w-md'
                      >
                        <div className='flex items-center gap-2 truncate'>
                          <File className='w-5 h-5 text-blue-600 flex-shrink-0' />
                          <span
                            className='text-sm font-medium text-gray-800 truncate'
                            title={file.name}
                          >
                            {file.name}
                          </span>
                        </div>
                        <button
                          onClick={handleFileRemove}
                          className='text-gray-500 hover:text-red-500 transition-colors'
                        >
                          <XCircle className='w-5 h-5' />
                        </button>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status Messages */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                variants={statusVariants}
                initial='hidden'
                animate='visible'
                exit='exit'
                className='flex items-center gap-2 p-4 mb-6 rounded-lg bg-red-50 border border-red-200 text-red-800'
              >
                <AlertTriangle className='w-5 h-5 text-red-600 flex-shrink-0' />
                <p className='text-sm'>{errorMessage}</p>
              </motion.div>
            )}

            {uploadSuccess && (
              <motion.div
                variants={statusVariants}
                initial='hidden'
                animate='visible'
                exit='exit'
                className='flex items-center gap-2 p-4 mb-6 rounded-lg bg-green-50 border border-green-200 text-green-800'
              >
                <CheckCircle className='w-5 h-5 text-green-600 flex-shrink-0' />
                <p className='text-sm'>File uploaded successfully!</p>
              </motion.div>
            )}

            {optimizationStarted && (
              <motion.div
                variants={statusVariants}
                initial='hidden'
                animate='visible'
                exit='exit'
                className='flex items-center gap-2 p-4 mb-6 rounded-lg bg-green-50 border border-green-200 text-green-800'
              >
                <CheckCircle className='w-5 h-5 text-green-600 flex-shrink-0' />
                <p className='text-sm'>Product data </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upload Progress */}
          {isUploading && (
            <div className='mb-6 space-y-2'>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-gray-600 font-medium'>Uploading...</span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2 overflow-hidden'>
                <Progress value={progress} />
              </div>
            </div>
          )}

          {/* Processing Message */}
          {isUploading && uploadProgress === 100 && (
            <div className='flex items-start gap-3 p-4 mb-6 rounded-lg bg-blue-50 border border-blue-200 text-blue-800'>
              <Info className='w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5' />
              <div className='text-sm'>
                <p className='font-medium mb-1'>Processing Your Data</p>
                <p>
                  We are mapping Google Product Categories to the products in
                  your uploaded Excel file. Processing time depends on the
                  number of products.
                </p>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleFileUpload}
            disabled={isUploading || !file}
            className={cn(
              'w-full px-6 py-3.5 rounded-xl font-semibold text-white',
              'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700',
              'shadow-md hover:shadow-lg transition-all duration-300',
              'flex items-center justify-center gap-2',
              isUploading || !file ? 'opacity-50 cursor-not-allowed' : ''
            )}
          >
            {isUploading ? (
              <>
                <svg
                  className='animate-spin -ml-1 mr-2 h-5 w-5 text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <UploadCloud className='w-5 h-5' />
                {file ? 'Upload File' : 'Select a File to Begin'}
              </>
            )}
          </button>
        </div>

        {/* Features Section */}
      </div>
    </div>
  );
};

export default ExcelImportScreen;
