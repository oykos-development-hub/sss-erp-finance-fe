import {DropdownData} from '../types/dropdownData.ts';
import {useMemo} from 'react';

const usePrependedDropdownOptions = <T>(options: DropdownData<T>[], filterAllLabel?: string): DropdownData<T>[] => {
  return useMemo(() => {
    const defaultOption: DropdownData<T> = {
      id: null as unknown as T,
      title: `${filterAllLabel ? filterAllLabel : 'Sve'}`,
    };
    return [defaultOption, ...options];
  }, [options]);
};

export default usePrependedDropdownOptions;
