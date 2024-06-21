import {useMemo} from 'react';
import {DropdownData} from '../types/dropdownData.ts';

const usePrependedDropdownOptions = <T>(options: DropdownData<T>[]): DropdownData<T>[] => {
  return useMemo(() => {
    const defaultOption: DropdownData<T> = {
      id: null as unknown as T,
      title: 'Sve',
    };
    return [defaultOption, ...options];
  }, [options]);
};

export default usePrependedDropdownOptions;
