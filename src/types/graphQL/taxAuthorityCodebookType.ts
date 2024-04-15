import {GetResponse} from './response';

export interface TaxAuthorityCodebookItem {
  id: number;
  title: string;
  code: string;
  active?: boolean;
  tax_percentage?: number;
  tax_supplier: {
    id: number;
    title: string;
  };
  release_percentage?: number;
  pio_percentage?: number;
  pio_supplier?: {
    id: number;
    title: string;
  };
  pio_percentage_employer_percentage: number;
  pio_percentage_employee_percentage?: number;
  unemployment_percentage?: number;
  unemployment_supplier?: {
    id: number;
    title: string;
  };
  unemployment_employer_percentage: number;
  unemployment_employee_percentage: number;
  labor_fund: number;
  labor_fund_supplier: {
    id: number;
    title: string;
  };
  previous_income_percentage_less_than_700: number;
  previous_income_percentage_less_than_1000: number;
  previous_income_percentage_more_than_1000: number;
  coefficient: number;
  created_at: string;
  updated_at: string;
}

export type TaxAuthorityCodebookResponse = {
  get: {
    taxAuthorityCodebooks_Overview: GetResponse<TaxAuthorityCodebookItem>;
  };
};
