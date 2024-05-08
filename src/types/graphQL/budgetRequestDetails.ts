import {DropdownData} from '../dropdownData.ts';

export type BudgetRequestItem = {
  financial: FinancialDetails;
  non_financial: NonFinancialDetails;
  request_id: number;
  status: DropdownData<number>;
};

type FinancialDetails = {
  current_accounts: Account[];
  current_budget_comment: string;
  current_request_id: number;
  current_status: DropdownData<number>;
  donation_accounts: Account[];
  donation_budget_comment: string;
  donation_request_id: number;
  donation_status: DropdownData<number>;
  official_comment: string;
  request_id: number;
  status: DropdownData<number>;
};

type Account = {
  children: any[]; // Depending on your use case, you might want to define this type more specifically
  filled_data: null; // You can replace 'null' with a more specific type if filled_data can hold other values
  id: number;
  parent_id: number | null;
  serial_number: string;
  title: string;
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
};

type Activity = {
  code: string;
  description: string;
  goals: any[]; // Specify the type if goals have a defined structure
  id: number;
  sub_program: DropdownData<number>;
  title: string;
};
