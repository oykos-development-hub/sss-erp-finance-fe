export interface PaymentOrderParams {
  id?: number;
  status: string;
  search: string;
  organization_unit_id: number | null;
  page: number;
  size: number;
  year: string | null;
  supplier_id?: number | null;
}

export interface Items {
  id: number;
  invoice_id: number;
  additional_expenses_id: number;
  salary_additional_expenses_id: number;
  account: {
    id: number;
    title: string;
  };
  amount: number;
  title: string;
  type: string;
  remain_price: number;
}

export interface PaymentOrderItem {
  id: number;
  organization_unit: {
    id: number;
    title: string;
  };
  supplier: {
    id: number;
    title: string;
  };
  amount: number;
  bank_account: string;
  date_of_payment: string | Date;
  date_of_sap: string | Date;
  date_of_order: string | Date;
  id_of_statement: number;
  sap_id: string;
  source_of_funding: string;
  status: string;
  file: {
    id: number;
    name: string;
    type: string;
  };
  items: Items[];
  created_at: string;
  updated_at: string;
  description: string;
}

export interface ObligationsParams {
  supplier_id: number | null;
  organization_unit_id: number | null;
  type: string | null;
}

export interface ObligationsItem {
  id: number;
  supplier: any;
  invoice_id: number;
  additional_expense_id: number;
  salary_additional_expense_id: number;
  status: string;
  total_price: number;
  remain_price: number;
  title: string;
  type: string;
}

export interface PayPaymentOrderParams {
  id: number | null;
  sap_id: string;
  date_of_sap: string | null;
}

export interface InsertPaymentOrderParams {
  organization_unit_id?: number;
  supplier_id?: number;
  amount?: number | string;
  date_of_payment: string | Date | null;
  items: {
    invoice_id: number | null;
    additional_expense_id: number | null;
    salary_additional_expense_id: number | null;
    account_id: number | null;
  }[];
}
