export interface FineForm {
  act_type: number;
  decision_number: string;
  decision_date: string;
  subject: string;
  jmbg: string;
  account_id: number;
  residence: string;
  amount: number;
  payment_reference_number: string;
  debit_reference_number: string;
  execution_date: string;
  payment_deadline_date: string;
  description?: string;
  court_costs?: number;
  court_account_id?: number;
  file?: number[];
}
