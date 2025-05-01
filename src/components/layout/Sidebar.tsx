import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { ChevronDown, ChevronUp } from 'lucide-react';

import {
  BarChart2,
  Package,
  Tag,
  Layers,
  ShoppingCart,
  X,
  Menu,
  LayoutDashboard,
  PackageSearch,
  TableProperties,
  BrainCircuit,
} from 'lucide-react';
import { SidebarItem } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}
const dashboard = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='100%'
    height='100%'
    viewBox='0 0 20 20'
    fit=''
    preserveAspectRatio='xMidYMid meet'
    focusable='false'
  >
    <path
      id='Shape'
      d='M16,20H15a4,4,0,0,1-4-4V13a4,4,0,0,1,4-4h1a4,4,0,0,1,4,4v3A4,4,0,0,1,16,20Zm-1-9a2,2,0,0,0-2,2v3a2,2,0,0,0,2,2h1a2,2,0,0,0,2-2V13a2,2,0,0,0-2-2ZM5,20H4a4,4,0,0,1-4-4V14a4,4,0,0,1,4-4H5a4,4,0,0,1,4,4v2A4,4,0,0,1,5,20ZM4,12a2,2,0,0,0-2,2v2a2,2,0,0,0,2,2H5a2,2,0,0,0,2-2V14a2,2,0,0,0-2-2ZM3.5,8A3.5,3.5,0,0,1,0,4.5v-1a3.5,3.5,0,1,1,7,0v1A3.5,3.5,0,0,1,3.5,8Zm0-6A1.5,1.5,0,0,0,2,3.5v1a1.5,1.5,0,1,0,3,0v-1A1.5,1.5,0,0,0,3.5,2Zm13,5h-4a3.5,3.5,0,1,1,0-7h4a3.5,3.5,0,0,1,0,7Zm-4-5a1.5,1.5,0,1,0,0,3h4a1.5,1.5,0,0,0,0-3Z'
    ></path>
  </svg>
);
const sidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
  {
    id: 'insights-product',
    label: 'Product Insights',
    icon: PackageSearch,
    path: '/insights/product',
    children: [
      {
        id: 'Insights-by-Product',
        label: 'Insights by Product',
        path: '/insights/product',
      },
      {
        id: 'Insights-by-Brand',
        label: 'Insights by Brand',
        path: '/insights/brand',
      },
      {
        id: 'Product-type',
        label: 'Product Types',
        path: '/insights/type1',
        children: [
          {
            id: 'type1',
            label: 'Product Type 1',
            path: '/insights/type1',
          },
          {
            id: 'type2',
            label: 'Product Type 2',
            path: '/insights/type2',
          },
          {
            id: 'type3',
            label: 'Product Type 3',
            path: '/insights/type3',
          },
          {
            id: 'type4',
            label: 'Product Type 4',
            path: '/insights/type4',
          },
          {
            id: 'type5',
            label: 'Product Type 5',
            path: '/insights/type5',
          },
        ],
      },
      {
        id: 'google-category',
        label: 'Google Product Category',
        path: '/insights/categoryL1',
        children: [
          {
            id: 'categoryL1',
            label: 'Google Category Type 1',
            path: '/insights/categoryL1',
          },
          {
            id: 'categoryL2',
            label: 'Google Category Type 2',
            path: '/insights/categoryL2',
          },
          {
            id: 'categoryL3',
            label: 'Google Category Type 3',
            path: '/insights/categoryL3',
          },
          {
            id: 'categoryL4',
            label: 'Google Category Type 4',
            path: '/insights/categoryL4',
          },
          {
            id: 'categoryL5',
            label: 'Google Category Type 5',
            path: '/insights/categoryL5',
          },
        ],
      },
    ],
  },

  {
    id: 'ai-insights',
    label: 'AI Keyword Optimizer',
    icon: BrainCircuit,
    path: '/focus-keyword-ai',
  },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [subExpanded, setSubExpanded] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => (prev === id ? null : id));
  };
  const toggleSubExpand = (id: string) => {
    setSubExpanded((prev) => (prev === id ? null : id));
  };

  return (
    <>
      {isOpen && (
        <div
          className='fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden'
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-sm transform  ease-in-ou transition-transform duration-300 ease-in-out translate-x-0 static z-auto',
          isOpen ? 'translate-x-0 ' : '-translate-x-full hidden'
        )}
      >
        <div className='flex h-16 items-center justify-between px-4 border-b border-gray-200 lg:h-auto lg:py-4'>
          <div className='text-xl font-bold text-primary-700'>InsightsDash</div>
          <button
            className='p-2 rounded-md hover:bg-gray-100 '
            onClick={toggleSidebar}
          >
            <X size={20} />
          </button>
        </div>
        <nav className='p-2 overflow-y-auto h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)]'>
          <ul className='space-y-1'>
            {sidebarItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                item.children?.some(
                  (child) => location.pathname === child.path
                );
              const isExpanded = expanded === item.id;

              return (
                <li key={item.id}>
                  <div
                    onClick={() => {
                      if (item.children) {
                        toggleExpand(item.id);
                      } else {
                        if (window.innerWidth < 1024) toggleSidebar();
                      }
                    }}
                    className={cn(
                      'flex items-center justify-between cursor-pointer rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    )}
                  >
                    <div className='flex items-center'>
                      <item.icon
                        size={22}
                        className={cn(
                          'mr-3',
                          isActive ? 'text-primary-600' : 'text-gray-400'
                        )}
                      />

                      <Link to={item.path}>{item.label}</Link>
                    </div>
                    {item.children && (
                      <span className='text-gray-400'>
                        {isExpanded ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </span>
                    )}
                  </div>

                  {isExpanded && item.children && (
                    <ul className='ml-7 mt-1 space-y-1 border-l-2'>
                      {item.children.map((subItem) => {
                        const isSubActive = location.pathname === subItem.path;

                        const isSubExpanded = subExpanded === subItem.id;

                        return (
                          <li key={subItem.id}>
                            <Link
                              to={subItem.path}
                              className={cn(
                                'block px-3 py-2 text-sm rounded-md',
                                isSubActive
                                  ? 'bg-primary-100 text-primary-700'
                                  : 'text-gray-600 hover:bg-gray-100'
                              )}
                              onClick={() => {
                                if (subItem.children) {
                                  toggleSubExpand(subItem.id);
                                } else {
                                  if (window.innerWidth < 1024) toggleSidebar();
                                }
                              }}
                            >
                              <div className='flex items-center justify-between'>
                                {subItem.label}
                                {subItem.children && (
                                  <span className='text-gray-400'>
                                    {isSubExpanded ? (
                                      <ChevronUp size={18} />
                                    ) : (
                                      <ChevronDown size={18} />
                                    )}
                                  </span>
                                )}
                              </div>
                            </Link>

                            {isSubExpanded && subItem.children && (
                              <ul className='ml-4 mt-1 space-y-1  border-l-2'>
                                {subItem.children.map((sub) => {
                                  const isSubActive =
                                    location.pathname === sub.path;

                                  return (
                                    <li key={sub.id}>
                                      <Link
                                        to={sub.path}
                                        className={cn(
                                          'block px-3 py-2 text-sm rounded-md',
                                          isSubActive
                                            ? 'bg-primary-100 text-primary-700'
                                            : 'text-gray-600 hover:bg-gray-100'
                                        )}
                                      >
                                        {sub.label}
                                      </Link>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
        <div className='flex items-center space-x-1 justify-center mb-6'>
          <span className='h-2 w-2 rounded-full bg-green-400'></span>
          <span>v1.0</span>
        </div>
      </aside>
      {!isOpen && (
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-50  bg-white border-r border-gray-200 shadow-sm transform  ease-in-ou transition-transform duration-300 ease-in-out translate-x-0 static z-auto'
          )}
        >
          <div className='flex h-16 items-center justify-between px-4 border-b border-gray-200 lg:h-auto lg:py-4'>
            <div className='text-xl my-[6px] font-bold text-primary-700'>
              <BarChart2 size={18} />
            </div>
            <button
              onClick={toggleSidebar}
              className='p-2 rounded-md hover:bg-gray-100'
              aria-label='Toggle sidebar'
            >
              <Menu size={20} />
            </button>
          </div>
          <nav className='p-2 overflow-y-auto h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)]'>
            <ul className='space-y-1'>
              {sidebarItems.map((item) => {
                const isActive = location.pathname === item.path;

                return (
                  <li key={item.id}>
                    <Link
                      to={item.path}
                      className={cn(
                        'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      )}
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          toggleSidebar();
                        }
                      }}
                    >
                      <item.icon
                        size={22}
                        className={cn(
                          'mr-3',
                          isActive ? 'text-primary-600' : 'text-gray-400'
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className='flex items-center space-x-1 justify-center mb-6'>
            <span className='h-2 w-2 rounded-full bg-green-400'></span>
            <span>v1.0</span>
          </div>
        </aside>
      )}
    </>
  );
};

export default Sidebar;
