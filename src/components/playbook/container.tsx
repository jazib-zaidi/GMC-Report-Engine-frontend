const playbookItem = [
  {
    id: 1,
    title: 'Audit Shopping Feed',

    url: '/playbook/feed-audit',
    description:
      'Feed Validations automatically review your product data to ensure it meets Google and channel requirements. Checks include title and description length, missing or incomplete attributes, formatting errors, and invalid URLs. By catching these issues early, you can prevent disapprovals.',
    buttonText: 'Audit Feed',
  },
  {
    id: 2,
    title: 'Cohort Analysis & Performance Report',

    url: '/dashboard',
    description:
      'Cohort Analysis provides insights into how different groups of products perform over time. Performance Report also includes Local Inventory Ads performance metrics.',
    buttonText: 'View Report',
  },
  {
    id: 3,
    title: 'View Product Data with DataBridge',

    url: '/playbook/data-bridge',
    description:
      'DataBridge is a standalone tool that allows you to view product data directly from your data sources. It also helps you map relevant attributes for seamless integration. The tool supports major platforms including Shopify, Magento, BigCommerce, and Salesforce. ',
    buttonText: 'View DataBridge',
  },
];

import { pl } from 'date-fns/locale';
import { useEffect } from 'react';
import { Item } from './container/item';

const Container = () => {
  const items = playbookItem.map((item) => (
    <Item key={item.id} playbookItem={item} />
  ));

  return <div className='grid grid-cols-3 gap-2'>{items}</div>;
};

export default Container;
