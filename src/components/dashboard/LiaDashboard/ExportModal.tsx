import { Button } from '@/components/ui/Button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { DownloadIcon, Loader, Undo2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const ExportModal = ({ exporting, handleExportReport }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;

    if (exporting) {
      setProgress(0); // Reset progress when export starts

      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return 90;
          return prev + Math.random() * 3 + 1; // Increment between 1–4%
        });
      }, 800);
    } else if (!exporting && progress < 100) {
      setProgress(100); // Complete when exporting is done
    }

    return () => clearInterval(interval);
  }, [exporting]);

  return (
    <Drawer>
      <DrawerTrigger>
        <span className='flex gap-2' onClick={() => handleExportReport()}>
          {exporting ? (
            <>
              <Loader className='animate-spin' size={16} /> Exporting Report...
            </>
          ) : (
            <>
              <DownloadIcon size={16} /> Export Report
            </>
          )}
        </span>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <div className='rounded-md p-8 h-80 bg-white'>
            <div className='border-4 border-dashed border-gray-300 h-full flex items-center justify-center'>
              <div className='text-center'>
                <h3 className='text-xl text-gray-700 mb-4'>
                  {exporting ? (
                    <>
                      {' '}
                      Your custom LIA report is being generated and will open in
                      a new tab shortly. <br />
                      Please hold on...
                    </>
                  ) : (
                    <>Your report has been successfully exported.</>
                  )}
                </h3>

                <div className='w-full mb-4'>
                  <div className='bg-gray-200 rounded-full h-2.5'>
                    <div
                      className='bg-green-600 h-2.5 rounded-full transition-all duration-300 ease-out'
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className='text-sm text-gray-600 mt-1'>
                    Exporting report... {Math.floor(progress)}%
                  </p>
                </div>
                {!exporting && (
                  <DrawerClose>
                    <Button variant='outline'>
                      {' '}
                      <Undo2 /> Return to Dashboard
                    </Button>
                  </DrawerClose>
                )}
              </div>
            </div>
          </div>
        </DrawerHeader>
        <DrawerFooter></DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ExportModal;
