import {GetResponse} from './response';

export interface CalculateAdditionalExpensesItem {
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
  net_price: number | null;
  gross_price: number | null;
  previous_income_net: number | null;
  previous_income_gross: number | null;
}

export type CalculateAdditionalExpensesResponse = {
  get: {
    calculateAdditionalExpenses: GetResponse<CalculateAdditionalExpensesItem>;
  };
};
