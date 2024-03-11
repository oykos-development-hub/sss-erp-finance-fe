export interface FinesOverviewParams {
  page: number;
  size: number;
  id?: number;
  subject?: string | null;
  search?: string | null;
  act_type_id?: number | null;
}

export interface FineFeeDetails {
  fee_all_payments_amount: string;
  fee_amount_grace_period: string;
  fee_amount_grace_period_due_date: string;
  fee_amount_grace_period_available: string;
  fee_left_to_pay_amount: string;
  fee_court_costs_paid: string;
  fee_court_costs_left_to_pay_amount: string;
}

export interface FinesOverviewItem {
  id: number;
  act_type: number;
  decision_number: number;
  decision_date: string;
  subject: string;
  jmbg: string;
  residence: string;
  amount: number;
  payment_reference_number: number;
  debit_reference_number: number;
  account: {
    id: number;
    title: string;
  };
  execution_date: string;
  payment_deadline_date: string;
  description: string;
  status: string;
  court_costs: string;
  court_account: {
    id: number;
    title: string;
  };
  fine_fee_details: FineFeeDetails;
  file: {
    id: number;
    name: string;
    type: string;
  };
  created_at: string;
  updated_at: string;
}
