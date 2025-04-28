import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Circle, Sparkles, AlertTriangle } from 'lucide-react';

interface OptimizationData {
  'Item ID': string;
  'Title': string;
  'Focus Keyword': string;
  'Description': string;
}

interface AIOptimizationScreenProps {
  initialData?: OptimizationData[];
}

const rowVariants = {
  hidden: { opacity: 0, y: -5, scale: 0.98, backgroundColor: 'transparent' },
  visible: (bgColor: string) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    backgroundColor: bgColor,
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
      onComplete: (definition: any) => {
        if (definition) {
          definition.custom = { backgroundColor: 'transparent' };
        }
      },
    },
    custom: { backgroundColor: 'transparent' },
  }),
  exit: {
    opacity: 0,
    y: 5,
    scale: 0.95,
    backgroundColor: 'transparent',
    transition: { duration: 0.15 },
  },
};

const shimmerVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 0.5,
    x: 10,
    transition: {
      duration: 0.7,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    },
  },
};

const AIOptimization: React.FC<AIOptimizationScreenProps> = ({
  initialData = [],
}) => {
  const [tableData, setTableData] = useState<OptimizationData[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedData, setUploadedData] = useState({});
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (initialData.length > 0) {
      setIsOptimizing(true);
      setError(null);
      setTableData([]);
      console.log(initialData);
      let rowIndex = 0;

      intervalRef.current = window.setInterval(() => {
        setTableData((prevData) => {
          if (rowIndex < initialData.length) {
            const newData = [initialData[rowIndex], ...prevData];
            rowIndex++;
            return newData;
          } else {
            setIsOptimizing(false);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            return prevData;
          }
        });
      }, 800);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [initialData]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className='p-4 sm:p-8 w-full'>
      <div className='mx-auto space-y-6'>
        <div className='text-center'>
          <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4'>
            AI Optimization
          </h1>
          <p className='text-gray-500 text-sm sm:text-base'>
            Optimizing product data with AI...
          </p>

          {error && (
            <div className='mt-4 text-red-500 flex items-center justify-center'>
              <AlertTriangle className='mr-2 h-5 w-5' />
              {error}
            </div>
          )}
        </div>

        <div className='bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 overflow-hidden'>
          <table className='w-full text-sm text-left text-gray-500'>
            <thead className='text-xs uppercase bg-gray-100 text-gray-700'>
              <tr>
                <th className='px-4 py-3'>Item ID</th>
                <th className='px-4 py-3'>Title</th>
                <th className='px-4 py-3'>Focus Keyword</th>
                <th className='px-4 py-3'>Description</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {tableData.map((row, index) => {
                  if (!row) return null;
                  let bgColor = 'transparent';
                  if (isOptimizing && index === 0) {
                    bgColor = 'rgba(56, 189, 248, 0.15)';
                  } else if (isOptimizing && index === 1) {
                    bgColor = 'rgba(167, 139, 250, 0.15)';
                  }

                  return (
                    <motion.tr
                      key={row['Item ID']}
                      variants={rowVariants}
                      initial='hidden'
                      animate='visible'
                      exit='exit'
                      custom={bgColor}
                      style={{
                        backgroundColor: bgColor,
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <td className='px-4 py-3 text-gray-600 font-mono'>
                        {isOptimizing && index === 0 ? (
                          <motion.span
                            variants={shimmerVariants}
                            initial='hidden'
                            animate='visible'
                            className='inline-block w-full h-4 bg-gradient-to-r from-gray-300 to-transparent rounded'
                          />
                        ) : (
                          row['Item ID']
                        )}
                      </td>
                      <td className='px-4 py-3 text-gray-900'>
                        {isOptimizing && index === 0 ? (
                          <motion.span
                            variants={shimmerVariants}
                            initial='hidden'
                            animate='visible'
                            className='inline-block w-full h-4 bg-gradient-to-r from-gray-300 to-transparent rounded'
                          />
                        ) : (
                          row.Title
                        )}
                      </td>
                      <td className='px-4 py-3 text-blue-600'>
                        {isOptimizing && index === 0 ? (
                          <motion.span
                            variants={shimmerVariants}
                            initial='hidden'
                            animate='visible'
                            className='inline-block w-full h-4 bg-gradient-to-r from-gray-300 to-transparent rounded'
                          />
                        ) : (
                          row['Focus Keyword']
                        )}
                      </td>
                      <td className='px-4 py-3 text-gray-700'>
                        {isOptimizing && index === 0 ? (
                          <motion.span
                            variants={shimmerVariants}
                            initial='hidden'
                            animate='visible'
                            className='inline-block w-full h-4 bg-gradient-to-r from-gray-300 to-transparent rounded'
                          />
                        ) : (
                          row.Description
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AIOptimization;
