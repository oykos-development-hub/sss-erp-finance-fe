import {DropdownData} from '../../../types/dropdownData.ts';

export interface BudgetOverviewFilters {
  year?: DropdownData<number> | null;
  budget_type?: DropdownData<string> | null;
  status?: DropdownData<string> | null;
}
