import {DropdownData} from '../types/dropdownData';

export const getMonthOptions = (isFilter = true): DropdownData<string>[] => {
  const months = [
    'Januar',
    'Februar',
    'Mart',
    'April',
    'Maj',
    'Jun',
    'Jul',
    'Avgust',
    'Septembar',
    'Oktobar',
    'Novembar',
    'Decembar',
  ];

  const allMonths: DropdownData<string>[] = isFilter ? [{id: '', title: 'Sve'}] : [];

  allMonths.push(
    ...months.map(month => ({
      id: month,
      title: month,
    })),
  );

  return allMonths;
};
