export interface BudgetOverviewParams {
  page?: number;
  size?: number;
  id?: number | null;
  year?: number | null;
  budget_type?: string | null;
  status?: string | null;
}

export interface BudgetOverviewItem {
  id: number;
  year: number;
  budget_type: string;
  status: string;
  limits: {
    id: number;
    organization_unit_id: number;
    limit: number;
  }[];
}
