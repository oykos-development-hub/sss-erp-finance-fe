import {GetResponse} from './response';

export interface CalculatedAdditionalExpensesItem {
  title: string;
  subject: {
    id: number;
    title: string;
  };
  organization_unit: {
    id: number;
    title: string;
  };
  status: string;
  price: number;
}

export interface CalculateAdditionalExpensesParams {
  tax_authority_codebook_id: number | null;
  municipality_id: number | null;
  net_price?: string | null;
  gross_price?: string | null;
  previous_income_net?: string | null;
  previous_income_gross?: string | null;
}

export type CalculateAdditionalExpensesResponse = {
  get: {
    calculateAdditionalExpenses: GetResponse<CalculatedAdditionalExpensesItem>;
  };
};
