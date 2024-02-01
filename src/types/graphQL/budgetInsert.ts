import {DropdownData} from '../dropdownData';

export interface BudgetOverviewInsert {
  id: number;
  year: DropdownData<string>;
  budget_type: DropdownData<number>;
  status: string;
}

export interface BudgetOverviewInsertData {
  id: number;
  year: string;
  budget_type: number;
}
