import useGetBudgets from '../services/graphQL/getBudgets/useGetBudgets.ts';
import {DropdownData} from '../types/dropdownData.ts';

export const useCreateBudgetYearFilter = (): DropdownData<number>[] => {
  const {budgets} = useGetBudgets({});
  let budgetYears: DropdownData<number>[] = [];

  if (budgets.length) {
    budgetYears = budgets.map(budget => ({id: budget.id, title: budget.year.toString()}));
  }
  return budgetYears;
};
