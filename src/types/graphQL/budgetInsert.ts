import {DropdownData} from '../dropdownData';

export interface BudgetOverviewInsert {
  id: number;
  year: DropdownData<string>;
  source: DropdownData<string>;
  type: DropdownData<string>;
  status: string;
}

export interface BudgetOverviewInsertData {
  id: number;
  year: string;
  source: string;
  type: string;
}
