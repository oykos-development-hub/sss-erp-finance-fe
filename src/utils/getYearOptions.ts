import {DropdownData} from '../types/dropdownData';

export const getYearOptions = (maxOffset = 10, isFilter = true, nextYears = 0): DropdownData<string>[] => {
  const thisYear = new Date().getFullYear() + nextYears;
  const allYears: DropdownData<string>[] = isFilter ? [{id: null as unknown as string, title: 'Sve'}] : [];
  allYears.push(
    ...Array.from({length: maxOffset}, (_, index) => {
      const yearValue = thisYear - index;
      return {id: yearValue.toString(), title: yearValue.toString()};
    }),
  );
  return allYears;
};
