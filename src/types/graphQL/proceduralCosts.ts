import {DropdownData} from '../dropdownData.ts';
import {FileItem} from '../fileUploadType.ts';

export interface ProceduralCostsForm {
  procedure_cost_type: number;
  account_id: number;
  decision_number: string;
  decision_date: string;
  subject: string;
  jmbg: string;
  residence: string;
  amount: number;
  payment_reference_number: string;
  debit_reference_number: string;
  execution_date: string;
  payment_deadline_date: string;
  description: string;
  court_costs: number;
  court_account_id: number;
  file: number[];
}

export interface ProceduralCostPaymentForm {
  procedure_cost_id: number;
  payment_method: number;
  amount: number;
  payment_date: string;
  receipt_number: string;
  payment_reference_number: string;
  debit_reference_number: string;
}

export interface ProceduralCostParams {
  page?: number;
  size?: number;
  id?: number;
  subject?: string | null;
  search?: string | null;
  procedure_cost_type_id?: number | null;
}

export interface ProceduralCostDetails {
  all_payments_amount: number;
  amount_grace_period: number;
  amount_grace_period_due_date: string;
  amount_grace_period_available: boolean;
  left_to_pay_amount: number;
  court_costs_paid: number;
  court_costs_left_to_pay_amount: number;
}

export interface ProceduralCostOverviewItem {
  id: number;
  procedure_cost_type: DropdownData<number>;
  decision_number: string;
  decision_date: string;
  subject: string;
  jmbg: string;
  residence: string;
  amount: number;
  payment_reference_number: string;
  debit_reference_number: string;
  account: DropdownData<number>;
  execution_date: string;
  payment_deadline_date: string;
  description: string;
  status: DropdownData<number>;
  court_costs: number;
  court_account: DropdownData<number>;
  procedure_cost_details: ProceduralCostDetails;
  file: FileItem[];
  created_at: string;
  updated_at: string;
}

export interface ProceduralCostPaymentDetails {
  id: number;
  procedure_cost_id: number;
  payment_method: DropdownData<number>;
  amount: number;
  payment_date: string;
  payment_due_date: string;
  receipt_number: string;
  payment_reference_number: string;
  debit_reference_number: string;
  status: DropdownData<number>;
  // only for FE, because useFieldArray will overwrite the id
  originalID?: number;
}
