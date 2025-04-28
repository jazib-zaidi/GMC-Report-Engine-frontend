import { InfoIcon } from 'lucide-react';
import { useState } from 'react';

export default function TokenDetailsModal({ tokenDetails }) {
  const [isOpen, setIsOpen] = useState(false);

  const explanations = {
    estimatedCredits:
      'How many credits were used (approx 1 credit = 1000 tokens).',
    totalPromptTokens: 'Tokens used by your input text (your prompts).',
    totalCompletionTokens:
      'Tokens used by AI to generate the reply (completion).',
    totalTokens: 'Total = Prompt Tokens + Completion Tokens.',
    totalCost: 'Estimated cost of this request in USD dollars.',
  };

  return (
    <div className='p-4'>
      {/* Button to open modal */}
      <button
        onClick={() => setIsOpen(true)}
        className='px-4 py-1.5 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 flex items-center gap-x-2'
      >
        <InfoIcon size={14} /> Show Token Details
      </button>

      {/* Modal */}
      {isOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40'>
          <div className='bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md relative'>
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className='absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-xl'
            >
              &times;
            </button>

            <h2 className='text-2xl font-bold mb-4 '>Token Usage Details</h2>
            <hr />

            {/* Table */}
            <div className='space-y-4'>
              <div className='mb-6 p-4 bg-blue-50 rounded-lg text-center'>
                <p className='text-sm text-blue-600  font-medium'>
                  ESTIMATED COST
                </p>
                <p className='text-3xl font-bold text-blue-700 0'>
                  ${tokenDetails.totalCost}
                </p>
                <div className='flex justify-center items-center mt-1 text-sm text-blue-600 '>
                  <span>{tokenDetails.estimatedCredits} credits</span>
                  <div className='relative group ml-2'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-4 w-4 cursor-help'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z'
                        clipRule='evenodd'
                      />
                    </svg>
                    <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none bg-gray-800 text-white text-xs rounded py-1 px-2 w-48 text-center'>
                      {explanations.estimatedCredits}
                    </div>
                  </div>
                </div>
              </div>

              {Object.entries(tokenDetails).map(([key, value]) => (
                <div key={key} className='border-b pb-2'>
                  <div className='flex justify-between items-center'>
                    <span className='font-semibold capitalize'>
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span className='text-blue-600'>{value}</span>
                  </div>
                  <p className='text-gray-500 text-sm mt-1'>
                    {explanations[key]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
