import {GetResponse} from './response';

export type AdditionalExpensesItem = {
  id: number;
  title: string;
  price: number;
  bank_account: string;
  subject: {
    id: number;
    title: string;
  };
  account: {
    id: number;
    title: string;
  };
};

export type GetAdditionalExpensesParams = {
  id?: number;
  year: number | null;
  status: string;
  search: string;
  organization_unit_id: number;
  page: number;
  size: number;
  subject_id: string | null;
};

export type GetAdditionalExpensesResponse = {
  get: {
    additionalExpenses_Overview: GetResponse<AdditionalExpensesItem>;
  };
};
