import {DropdownData} from '../../types/dropdownData';
import {BudgetTableHead, BudgetTableStep} from './types';

export const baseTableHeads: BudgetTableHead[] = [
  {name: 'Ekonomska Klasifikacija', width: 6},
  {name: 'Opis Konta', width: 15},
];

const capitalizeFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const months = Array.from({length: 12}, (_, i) => {
  return capitalizeFirstLetter(new Date(0, i).toLocaleString('sr-Latn-ME', {month: 'short'}));
});

export const getBudgetTableHeads = (year: number, state: BudgetTableStep | `${BudgetTableStep}`): BudgetTableHead[] => {
  switch (state) {
    case BudgetTableStep.CREATING:
    case BudgetTableStep.BUDGETING:
      return [
        {name: `Budžet za ${year}. godinu`, width: 13},
        {name: 'Opis', width: 30},
        {name: `Budžet za ${year + 1}. godinu`, width: 13},
        {name: `Budžet za ${year + 2}. godinu`, width: 13},
      ];
    case BudgetTableStep.BUDGETING_ACTUAL:
      return [
        {name: `Budžet za ${year}. godinu`, width: 12.5},
        {name: 'Opis', width: 20},
        {name: `Tekući budžet za ${year}. godinu`, width: 12.5},
        {name: `Budžet za ${year + 1}. godinu`, width: 12.5},
        {name: `Budžet za ${year + 2}. godinu`, width: 12.5},
      ];
    case BudgetTableStep.VIEW_ANNUAL:
      return [
        {name: `Planirani budžet za ${year}. godinu`, width: 10},
        {name: `Odobreni budžet za ${year}. godinu`, width: 10},
        {name: `Tekući budžet za ${year}. godinu`, width: 10},
      ];
    case BudgetTableStep.VIEW_MONTHLY:
      return [{name: `Tekući budžet za ${year}. godinu`, width: 10}, ...months.map(month => ({name: month, width: 4}))];
    case BudgetTableStep.REBALANCING:
      return [
        {name: `Planirani budžet za ${year}. godinu`, width: 10},
        {name: `Odobreni budžet za ${year}. godinu`, width: 10},
        {name: `Tekući budžet za ${year}. godinu`, width: 10},
        {name: '-', width: 6},
        {name: '+', width: 6},
      ];
    default:
      return [];
  }
};

export const sourceOptions: DropdownData<string>[] = [
  {id: 'budget', title: 'Budžet'},
  {id: 'donation', title: 'Donacija'},
];
