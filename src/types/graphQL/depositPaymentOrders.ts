import {DropdownData} from '../dropdownData';
import {FileItem} from '../fileUploadType';
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
  municipality: DropdownData<number> | null;
  tax_authority_codebook: DropdownData<number> | null;
  source_bank_account: string;
  subject_type: DropdownData<number>;
  file: FileItem;
  created_at: string;
  updated_at: string;
};

export type AdditionalExpenseInsertData = {
  organization_unit_id: number;
  price: number;
  subject_id: number;
  title: string;
};

export type DepositPaymentOrderInsertData = {
  organization_unit_id: number;
  supplier_id: number;
  bank_account: string;
  date_of_payment: string;
  additional_expenses: AdditionalExpenseInsertData[] | null;
  additional_expenses_for_paying: AdditionalExpenseInsertData[] | null;
  municipality_id: number | null;
  tax_authority_codebook_id: number | null;
  source_bank_account: string;
  subject_type_id: number;
};

export type AdditionalExpensesResponse = {
  get: {
    depositPaymentAdditionalExpenses_Overview: GetResponse<PaymentOrderAdditionalExpense>;
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

export type DepositPaymentOrderCase = {
  case_number: string;
  amount: number;
};

export type CaseListResponse = {depositCaseNumbers_Overview: GetResponse<DepositPaymentOrderCase>};

export type PayOrderData = {
  id: number;
  id_of_statement: string;
  date_of_statement: string;
};
