import {DropdownData} from '../../types/dropdownData';
import {BudgetTableHead, BudgetTableStep} from './types';

export const baseTableHeads: BudgetTableHead[] = [{name: 'Ekonomska klasifikacija', width: 6}];

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
    case BudgetTableStep.BUDGET_FINANCIAL:
      return [
        // This was in figma, but probably not needed
        // {name: 'Tekuća godina', width: 13},
        {name: `Budžet za ${year}. godinu`, width: 16},
        {name: 'Opis', width: 34},
        {name: `Budžet za ${year + 1}. godinu`, width: 16},
        {name: `Budžet za ${year + 2}. godinu`, width: 16},
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
      return [...months.map(month => ({name: month, width: 4})), {name: 'Ukupni iznos', width: 10}];
    case BudgetTableStep.REBALANCING:
      return [
        {name: `Planirani budžet za ${year}. godinu`, width: 10},
        {name: `Odobreni budžet za ${year}. godinu`, width: 10},
        {name: `Tekući budžet za ${year}. godinu`, width: 10},
        {name: '-', width: 6},
        {name: '+', width: 6},
      ];
    case BudgetTableStep.CURRENT_BUDGET:
      return [
        {name: `Odobreni budžet za ${year}. godinu`, width: 10},
        {name: 'Tekući budžet', width: 10},
        {name: 'Preostalo za otpuštanje', width: 10},
        {name: 'Otpušteno', width: 10},
      ];
    case BudgetTableStep.VIEW_MONTHLY_WITH_EDIT:
      return [
        ...months.map(month => ({name: month, width: 4})),
        {name: 'Ukupni iznos', width: 10},
        {name: 'Izmijeni', width: 10},
      ];
    case BudgetTableStep.REQUEST_FUND_RELEASE:
      return [
        {name: 'Iznos iz plana potrošnje', width: 10},
        {name: 'Iznos', width: 10},
        {name: 'Izaberi sve', width: 10, checkbox: true},
      ];
    case BudgetTableStep.INTERNAL_REALLOCATION:
      return [
        {name: `Odobreni budžet za ${year}. godinu`, width: 10},
        {name: '-', width: 6},
        {name: '+', width: 6},
      ];
    case BudgetTableStep.INTERNAL_REALLOCATION_PREVIEW:
      return [
        {name: '-', width: 6},
        {name: '+', width: 6},
      ];
    case BudgetTableStep.EXTERNAL_REALLOCATION:
    case BudgetTableStep.EXTERNAL_REALLOCATION_FO_PREVIEW:
      return [
        {name: `Odobreni budžet za ${year}. godinu`, width: 10},
        {name: '-', width: 6},
      ];
    default:
      return [];
  }
};

export const sourceOptions: DropdownData<string>[] = [
  {id: 'budget', title: 'Budžet'},
  {id: 'donation', title: 'Donacija'},
];
