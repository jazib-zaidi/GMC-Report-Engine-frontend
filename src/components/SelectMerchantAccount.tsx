import React from 'react';
import { Card, CardTitle } from './ui/card';

const SelectMerchantAccount = () => {
  return (
    <div>
      {' '}
      <Card className='p-6 flex flex-col space-y-4'>
        <CardTitle className='text-xl font-bold '>
          Select a Merchant Account to Get Started
        </CardTitle>
        <img className='' src='/playbook-screen.png' alt='AI Icon' />
      </Card>
    </div>
  );
};

export default SelectMerchantAccount;
