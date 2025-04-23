import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { TabRoute } from '../../types';

interface TabNavigationProps {
  routes: TabRoute[];
  defaultRoute: string;
  children: React.ReactNode;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  routes,
  defaultRoute,
  children,
}) => {
  return (
    <Tabs defaultValue={defaultRoute} className='w-full'>
      <div className='border-b border-gray-200  top-0 bg-white z-10'>
        <TabsList className='bg-transparent  p-0 -mb-px'>
          {routes.map((route) => (
            <TabsTrigger
              key={route.id}
              value={route.id}
              className='border-b-2 border-transparent data-[state=active]:border-primary-600 px-4 py-2 rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none'
            >
              {route.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {children}
    </Tabs>
  );
};

export default TabNavigation;
