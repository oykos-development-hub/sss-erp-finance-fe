import {DropdownData} from '../dropdownData.ts';
import {FileItem} from '../fileUploadType.ts';

export interface FinesOverviewParams {
  page?: number;
  size?: number;
  id?: number;
  subject?: string | null;
  search?: string | null;
  act_type_id?: number | null;
  organization_unit_id?: number | null;
}

export interface FineFeeDetails {
  fee_all_payments_amount: number;
  fee_amount_grace_period: number;
  fee_amount_grace_period_due_date: string;
  fee_amount_grace_period_available: boolean;
  fee_left_to_pay_amount: number;
  fee_court_costs_paid: number;
  fee_court_costs_left_to_pay_amount: number;
}

export interface FinesOverviewItem {
  id: number;
  act_type: DropdownData<number>;
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
  fine_fee_details: FineFeeDetails;
  file: FileItem[];
  created_at: string;
  updated_at: string;
}
