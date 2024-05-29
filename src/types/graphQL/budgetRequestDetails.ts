import {DropdownData} from '../dropdownData.ts';
import {Count} from './counts.ts';

export type BudgetRequestItem = {
  financial: FinancialDetails;
  non_financial: NonFinancialDetails;
  request_id: number;
  status: DropdownData<number>;
  budget: DropdownData<string>;
  limit: number;
};

type FinancialDetails = {
  current_accounts: Count[];
  current_budget_comment: string;
  current_request_id: number;
  current_status: DropdownData<number>;
  donation_accounts: Count[];
  donation_budget_comment: string;
  donation_request_id: number;
  donation_status: DropdownData<number>;
  official_comment: string;
  request_id: number;
  status: DropdownData<number>;
};

type NonFinancialDetails = {
  activity: Activity;
  contact_email: string;
  contact_fullname: string;
  contact_phone: string;
  contact_working_place: string;
  id: number;
  impl_contact_email: string;
  impl_contact_fullname: string;
  impl_contact_phone: string;
  impl_contact_working_place: string;
  request_id: number;
  status: DropdownData<number>;
  statement: string;
};

export type Activity = {
  code: string;
  description: string;
  goals: any[]; // Specify the type if goals have a defined structure
  id: number;
  sub_program: DropdownData<number>;
  title: string;
  organization_unit: {
    id: number;
    title: string;
    code: number;
  };
};
