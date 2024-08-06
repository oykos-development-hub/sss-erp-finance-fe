import {useMemo} from 'react';
import {DropdownData} from '../types/dropdownData.ts';

const usePrependedDropdownOptions = <T>(options: DropdownData<T>[], label?: string): DropdownData<T>[] => {
  return useMemo(() => {
    const defaultOption: DropdownData<T> = {
      id: null as unknown as T,
      title: `Sve ${label ? label : ''}`,
    };
    return [defaultOption, ...options];
  }, [options]);
};

export default usePrependedDropdownOptions;
