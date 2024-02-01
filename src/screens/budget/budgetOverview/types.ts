import {DropdownData} from '../../../types/dropdownData.ts';

export interface BudgetOverviewFilters {
  year?: DropdownData<number> | null;
  type_budget?: DropdownData<string> | null;
  status?: DropdownData<string> | null;
}
