import React, { useEffect } from 'react';
import Container from './container';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import SelectMerchantAccount from '../SelectMerchantAccount';

const Playbook = () => {
  const navigate = useNavigate();
  const { merchantSelect } = useAuth();

  if (merchantSelect) {
    console.log(merchantSelect);
  } else {
    return <SelectMerchantAccount />;
  }

  return (
    <div className='container mx-auto px-4'>
      <h2 className='text-2xl font-bold mb-4'>Playbook</h2>
      <Container />
    </div>
  );
};

export default Playbook;
