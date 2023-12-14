export interface BudgetOverviewParams {
  page: number;
  size: number;
  id?: number;
  year?: string | null;
  type_budget?: string | null;
  status?: string | null;
}

export interface BudgetOverviewItem {
  id: number;
  year: string;
  type_budget: string;
  status: string;
}
