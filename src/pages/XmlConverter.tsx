import React from 'react';
import XmlToGoogleSheet from '../components/XmlToGoogleSheet';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const XmlConverter = () => {
  return (
    <div className=''>
      <Button onClick={() => {}} variant='outline'>
        <Link to={'/dashboard'}>
          <div className='flex items-center gap-x-3'>
            <ArrowLeft /> Go Back
          </div>
        </Link>
      </Button>
      <XmlToGoogleSheet />;
    </div>
  );
};

export default XmlConverter;
