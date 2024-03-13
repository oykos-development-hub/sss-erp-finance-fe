export interface BudgetOverviewParams {
  page?: number;
  size?: number;
  id?: number;
  year?: number | null;
  budget_type?: string | null;
  status?: string | null;
}

export interface BudgetOverviewItem {
  id: number;
  year: number;
  type_budget: string;
  status: string;
  limits: {
    id: number;
    organization_unit_id: string;
    limit: number;
  }[];
}
