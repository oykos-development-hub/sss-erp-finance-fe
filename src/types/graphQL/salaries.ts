import {DropdownData} from '../dropdownData.ts';
import {AdditionalSalaryExpenseType} from '../../screens/liabilitesAndReceivables/salaries/constants.tsx';

export type SalaryAdditionalExpense = {
  id: number;
  organization_unit: DropdownData<number>;
  activity: DropdownData<number>;
  account: DropdownData<number>;
  amount: number;
  subject: DropdownData<number>;
  bank_account: DropdownData<string>;
  type: keyof typeof AdditionalSalaryExpenseType;
  debtor?: DropdownData<number>;
  title: string;
  created_at?: string;
  updated_at?: string;
};

export type Salary = {
  id: number;
  organization_unit: DropdownData<number>;
  activity: DropdownData<number>;
  month: string;
  date_of_calculation: string;
  description: string;
  gross_price: number;
  vat_price: number;
  obligations_price: number;
  number_of_employees: number;
  net_price: number;
  account: DropdownData<number>;
  salary_additional_expenses: SalaryAdditionalExpense[];
  created_at: string;
  updated_at: string;
};

export interface SalariesOverviewParams {
  page?: number;
  size?: number;
  id?: number;
  year?: number;
  month?: string | null;
  activity_id?: number | null;
  organization_unit_id?: number | null;
}

export interface SalaryAdditionalExpenseParams {
  account_id: number;
  amount: number;
  subject_id: number;
  bank_account: string;
  title: string;
  organization_unit_id: number;
  type: keyof typeof AdditionalSalaryExpenseType;
  debtor_id?: number;
}
export interface SalaryInsertParams {
  month: string;
  date_of_calculation: string;
  description: string;
  organization_unit_id: number;
  salary_additional_expenses: SalaryAdditionalExpenseParams[];
}
