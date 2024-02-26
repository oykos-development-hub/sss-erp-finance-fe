import {DropdownData} from '../dropdownData';

export interface BudgetOverviewInsert {
  id: number;
  year: DropdownData<string>;
  budget_type: DropdownData<number>;
  status: string;
}

export interface BudgetOverviewInsertData {
  id: number | null;
  year: string | null;
  budget_type: number | null;
  limits: LimitType[];
}

export interface LimitType {
  organization_unit_id: number;
  limit: number;
}
