import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Loader } from 'lucide-react';
import Button from './ui/Button';
import { Link } from 'react-router-dom';

const XmlToGoogleSheet = () => {
  const [xmlUrl, setXmlUrl] = useState('');
  const [sheetTitle, setSheetTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const authToken = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      return `?token=${token}`;
    }
    toast.error('No Token found please login again');
    return '';
  };
  const handleConvert = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/upload-feed-xml${authToken()}`,
        {
          xmlUrl,
          sheetTitle,
        },
        {
          withCredentials: true,
        }
      );

      setResponse(res.data);
    } catch (err) {
      setError(err.response?.data || 'Failed to create sheet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-2xl mx-auto p-6 bg-white shadow-md rounded-2xl border border-gray-200'>
      <h2 className='text-2xl font-bold mb-6 text-gray-800'>
        🧾 XML to Google Sheet
      </h2>

      <div className='mb-4'>
        <label className='block mb-1 font-semibold text-gray-700'>
          XML Shopping Feed URL
        </label>
        <input
          type='url'
          className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
          placeholder='https://example.com/feed.xml'
          value={xmlUrl}
          onChange={(e) => setXmlUrl(e.target.value)}
        />
      </div>

      <button
        onClick={handleConvert}
        disabled={loading || !xmlUrl}
        className='bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-200 disabled:opacity-50'
      >
        {loading ? (
          <span className='flex gap-x-2'>
            {' '}
            <Loader className='animate-spin' />
            Converting...
          </span>
        ) : (
          'Convert to Google Sheet'
        )}
      </button>

      {response && (
        <div className='mt-6 bg-green-100 border border-green-400 text-green-800 px-4 py-4 rounded-lg space-y-2'>
          <p className='font-semibold'>✅ Sheet created successfully!</p>

          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
            <input
              type='text'
              value={response.url}
              readOnly
              className='w-full sm:w-3/4 px-3 py-2 rounded border border-gray-300 text-gray-700 bg-white'
            />
            <button
              onClick={() => navigator.clipboard.writeText(response.url)}
              className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition'
            >
              📋 Copy Link
            </button>
          </div>

          <a
            href={response.url}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-block text-blue-700 underline font-medium'
          >
            🔗 Open Google Sheet
          </a>
        </div>
      )}

      {error && (
        <div className='mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg'>
          ❌ Error: {error.message || error}
        </div>
      )}
    </div>
  );
};

export default XmlToGoogleSheet;
