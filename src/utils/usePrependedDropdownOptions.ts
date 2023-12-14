import {useMemo} from 'react';
import {DropdownData} from '../types/dropdownData.ts';

const usePrependedDropdownOptions = (options: DropdownData<number>[]): DropdownData<number>[] => {
  // TODO rewrite this to handle all types of dropdown data when needed
  return useMemo(() => {
    const defaultOption: DropdownData<number> = {id: 0, title: 'Sve'};
    return [defaultOption, ...options];
  }, [options]);
};

export default usePrependedDropdownOptions;
