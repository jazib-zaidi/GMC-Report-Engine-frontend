import React from 'react';
import Toggle from '../ui/Toggle';
import Select from '../ui/Select';
import { FilterOptions } from '../../types';

interface FilterControlsProps {
  filters: FilterOptions;
  onFilterChange: (name: keyof FilterOptions, value: boolean | string) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  onFilterChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="text-sm font-medium">Filters:</div>
      
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <Toggle
          label="Only In-Stock Products"
          checked={filters.inventoryOnly}
          onChange={(e) => onFilterChange('inventoryOnly', e.target.checked)}
        />
        
        <div className="w-full md:w-48">
          <Select
            label="Traffic Source"
            value={filters.trafficSource}
            onChange={(e) => onFilterChange('trafficSource', e.target.value as 'all' | 'organic')}
          >
            <option value="all">All Traffic</option>
            <option value="organic">Organic Only</option>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;