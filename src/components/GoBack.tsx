import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const GoBack = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Goes back one step in the history stack
  };

  return (
    <Button onClick={handleGoBack} variant='outline'>
      <ArrowLeft /> Go Back
    </Button>
  );
};

export default GoBack;
