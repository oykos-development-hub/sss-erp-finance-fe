import {DropdownData} from '../dropdownData';
import {GetResponse, InsertResponse, SimpleResponse} from './response';

export type PaymentOrderAdditionalExpense = {
  id: number;
  title: string;
  price: number;
  bank_account: string;
  subject: DropdownData<number>;
  account: DropdownData<number>;
};

export type AdditionalExpenseToPay = {
  id: number;
  title: string;
  price: number;
  bank_account: string;
  subject: DropdownData<number>;
  account: DropdownData<number>;
};

export type DepositPaymentOrder = {
  id: number;
  organization_unit: DropdownData<number>;
  case_number: string;
  supplier: DropdownData<number>;
  net_amount: number;
  bank_account: string;
  date_of_payment: string;
  date_of_statement: string;
  id_of_statement: string;
  //todo: koji su statusi?
  status: string;
  additional_expenses: PaymentOrderAdditionalExpense[];
  additional_expenses_for_paying: AdditionalExpenseToPay[];
  created_at: string;
  updated_at: string;
};

export type DepositPaymentOrderInsertData = {
  organization_unit_id: number;
  supplier_id: number;
  bank_account: string;
  date_of_payment: string;
  additional_expenses_for_paying: {
    id: number;
    organization_unit_id: number;
    price: number;
    status: string | null;
    subject_id: number;
    title: string;
    payment_order_id: number;
  }[];
};

export type AdditionalExpensesResponse = {
  get: {
    depositPaymentOrder_Overview: GetResponse<PaymentOrderAdditionalExpense>;
  };
};

export type RemainAmountByCaseNumberResponse = {
  get: {
    depositPaymentCaseNumber_Overview: GetResponse<{amount: number}>;
  };
};

export type DepositPaymentOrderResponse = {
  get: {
    depositPaymentOrder_Overview: GetResponse<DepositPaymentOrder>;
  };
  insert: {
    depositPaymentOrder_Insert: InsertResponse<DepositPaymentOrder>;
  };
  delete: {
    depositPaymentOrder_Delete: SimpleResponse;
  };
};
