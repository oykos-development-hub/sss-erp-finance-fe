export interface BudgetListParams {
  page?: number;
  size?: number;
  id?: number | null;
  year?: number | null;
  budget_type?: number | null;
  status?: number | null;
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
  number_of_requests: number;
}
