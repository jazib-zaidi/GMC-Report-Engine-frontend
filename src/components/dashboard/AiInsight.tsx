import { ArrowDown, Eraser, MoveDownRight, SendHorizontal } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AiTable from '../../utils/AiTable';
import Button from '../ui/Button';

const AiInsight = () => {
  const [search, setSearch] = useState('');
  const [isScroolBottom, setIsScroolBottom] = useState(false);
  const [chat, setChat] = useState<
    {
      question: string;
      answer: string | null;
      loading?: boolean;
      saved?: boolean;
    }[]
  >([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { askAiInsigth, selectedAdsAccount, aiInsigthResponse, loading } =
    useAuth();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);
  // Focus input on mount or when search clears
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Whenever aiInsigthResponse changes, update last message answer
  useEffect(() => {
    if (chat.length === 0) return;

    // Update last question with answer when response arrives
    if (!loading && aiInsigthResponse) {
      setChat((prev) =>
        prev.map((item, i) =>
          i === prev.length - 1
            ? {
                ...item,
                answer: aiInsigthResponse,
                loading: false,
                saved: false,
              }
            : item
        )
      );
    }
  }, [aiInsigthResponse, loading]);

  const handleSuggestionClick = (suggestion: string) => {
    setSearch(suggestion);
    inputRef.current?.focus();
  };

  const handleSearchClick = () => {
    if (search.trim() === '') return;

    // Add question with loading state, answer null initially
    setChat((prev) => [
      ...prev,
      { question: search, answer: null, loading: true, saved: false },
    ]);

    // Trigger AI call
    askAiInsigth(selectedAdsAccount?.customer_id, search);

    setSearch('');
    inputRef.current?.focus();
  };
  useEffect(() => {
    if (!selectedAdsAccount?.customer_id) return;
    if (chat.length > 0) {
      localStorage.setItem(
        `aiChat-${selectedAdsAccount.customer_id}`,
        JSON.stringify(chat)
      );
    }
  }, [chat, selectedAdsAccount?.customer_id]);

  useEffect(() => {
    if (!selectedAdsAccount?.customer_id) return;

    const savedChat = localStorage.getItem(
      `aiChat-${selectedAdsAccount.customer_id}`
    );
    if (savedChat) {
      try {
        setChat(JSON.parse(savedChat));
      } catch (e) {
        console.error('Failed to parse chat from localStorage', e);
      }
    }
  }, [selectedAdsAccount?.customer_id]);

  const questions = [
    'Which products have the highest ad spend but zero conversions?',
    'What are the top-performing products by ROAS?',
    'Which product have the lowest click-through rates?',
  ];

  const chatContainerRef = useRef(null);
  const handleScroll = () => {
    const container = chatContainerRef.current;
    if (!container) return;

    const isAtBottom =
      Math.abs(
        container.scrollHeight - container.scrollTop - container.clientHeight
      ) < 10;

    if (isAtBottom) {
      setIsScroolBottom(false);
      console.log('You are at the bottom');
    } else {
      setIsScroolBottom(true);
      console.log('Not at the bottom');
    }
  };

  const handleInsertInReport = (ans) => {
    const updatedChat = chat.map((item, i) => {
      return i === ans.idx ? { ...item, saved: true } : item;
    });

    setChat(updatedChat);

    // Save to localStorage under a separate key for saved items
    const reportKey = `aiSaved-${selectedAdsAccount?.customer_id}`;
    const existingSaved = JSON.parse(localStorage.getItem(reportKey) || '[]');

    localStorage.setItem(reportKey, JSON.stringify([...existingSaved, ans]));

    // Optional: confirmation message in the chat
    setChat((prev) => [
      ...prev,
      {
        question: 'Yes',
        answer: `✅ Your question - "${ans.question}" and response have been saved. You’ll find them in the final sheet when you export the report.`,
        loading: false,
        saved: true,
      },
    ]);
  };
  const handleDeclineSave = (idx: number, question: String) => {
    // Optional: mark it as acknowledged by updating `saved` to true
    const updatedChat = chat.map((item, i) =>
      i === idx ? { ...item, saved: true } : item
    );
    setChat(updatedChat);

    // Optional: Add feedback message
    setChat((prev) => [
      ...prev,
      {
        question: 'No',
        answer: `❌ AI Insight not saved to the report. for the question -> "${question}"`,
        loading: false,
        saved: true,
      },
    ]);
  };
  console.log(chat);
  return (
    <div className='bg-white shadow rounded-lg overflow-hidden   mx-auto'>
      <div className='px-4 py-5 sm:px-6 border-b border-gray-200 flex flex-col items-center'>
        {chat.length == 0 && (
          <div className=' sm:px-6  flex flex-col items-center'>
            <img className='w-20' src='/aiIcon.png' alt='AI Icon' />
            <h3 className='text-2xl leading-6 font-medium text-gray-900 mt-4'>
              Ask me anything!
            </h3>

            <div className='flex justify-center gap-3 mt-8 '>
              {questions.map((q, index) => (
                <div
                  key={index}
                  className='p-4 border border-gray-200 rounded-md shadow-sm cursor-pointer hover:bg-gray-50 max-w-xs'
                  onClick={() => handleSuggestionClick(q)}
                >
                  <p className='text-sm text-gray-500'>{q}</p>
                  <div className='flex items-end justify-end mt-2'>
                    <span className='flex items-center justify-center bg-blue-50 p-2 rounded-md'>
                      <MoveDownRight color='gray' size={15} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div
          ref={chatContainerRef}
          onScroll={handleScroll}
          className='space-y-6 w-full max-h-[400px] overflow-scroll'
        >
          {chat?.map(({ question, answer, loading, saved }, idx) => (
            <div key={idx} className='flex flex-col space-y-6'>
              {/* User question aligned right */}
              <div className='self-end max-w-[70%] '>
                <div className='flex items-center gap-x-2'>
                  <div className='border rounded-tl-xl rounded-tr-xl rounded-bl-xl p-2 bg-blue-100 shadow-sm text-sm'>
                    <p className='text-blue-900 whitespace-pre-wrap'>
                      {question}
                    </p>
                  </div>
                  <p className='font-semibold text-blue-800 w-8 h-8 flex items-center justify-center rounded-full  bg-[#f8b762]'>
                    F
                  </p>
                </div>
              </div>

              {/* AI answer aligned left */}
              <div className='self-start max-w-[70%] '>
                <div className='flex items-start gap-x-2 '>
                  <img
                    className='w-10 border rounded-full p-[6px]'
                    src='/aiIcon.png'
                    alt='AI Icon'
                  />
                  <div className='border rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-xl p-2 bg-white shadow-sm text-sm'>
                    <p className='text-gray-800 whitespace-pre-wrap '>
                      {loading ? (
                        <span className='text-gray-400 italic'>
                          Waiting for AI response...
                        </span>
                      ) : answer?.response?.length > 0 ? (
                        <div className=''>
                          <span className='block text-gray-800'>
                            {!answer?.errorMessage && (
                              <AiTable AiResponse={answer} />
                            )}

                            {!saved && (
                              <>
                                <hr />
                                <div className='mt-2 text-[13px]'>
                                  <p>Want to save this in the report?</p>
                                  <Button
                                    variant='outline'
                                    className='mr-2 p-x-4 text-sm h-7 mt-2'
                                    onClick={() =>
                                      handleDeclineSave(idx, question)
                                    }
                                  >
                                    No
                                  </Button>
                                  <Button
                                    className='bg-black p-x-4 text-sm h-7'
                                    variant='secondary'
                                    onClick={() =>
                                      handleInsertInReport({
                                        question,
                                        answer,
                                        idx,
                                      })
                                    }
                                  >
                                    Yes
                                  </Button>
                                </div>
                              </>
                            )}
                          </span>
                        </div>
                      ) : typeof answer === 'string' ? (
                        answer
                      ) : (
                        <span className=''>
                          {answer?.errorMessage || 'No Response'}
                        </span>
                      )}
                    </p>
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='relative w-full mt-8'>
          <input
            ref={inputRef}
            className='p-4 border border-gray-300 rounded-md shadow-md w-full'
            id='AI'
            type='text'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Ask Anything...'
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearchClick();
              }
            }}
            autoComplete='off'
          />

          <button
            onClick={handleSearchClick}
            className='absolute bottom-[11px] right-4 flex items-center justify-center bg-[#33a852] p-2 rounded-md mt-2 cursor-pointer hover:bg-green-700 transition'
            aria-label='Send question'
          >
            <SendHorizontal color='white' size={20} />
          </button>
          {isScroolBottom && (
            <button
              onClick={() =>
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
              }
              className='bg-white rounded-full p-1 shadow-md border border-gray-600 absolute left-1/2 -translate-x-1/2 top-[-35px]'
            >
              <ArrowDown size={22} color='black' />
            </button>
          )}
          {!isScroolBottom && chat.length > 0 && (
            <button
              onClick={() => {
                localStorage.setItem(
                  `aiChat-${selectedAdsAccount.customer_id}`,
                  JSON.stringify([])
                );
                setChat([]);
              }}
              className='bg-white rounded-full p-1 shadow-md border border-gray-600 absolute right-4  top-[-40px]'
            >
              <Eraser size={26} />
            </button>
          )}
        </div>
        <p className='text-sm text-gray-600 text-center mt-2 italic'>
          FeedOps AI can make mistakes. We are constantly in beta, so always
          double-check important insights.
        </p>
      </div>
    </div>
  );
};

export default AiInsight;
