export interface EnforcedPaymentParams {
  id?: number;
  status: string;
  search: string;
  organization_unit_id: number | null;
  page: number;
  size: number;
}

export interface Items {
  id: number;
  invoice_id: number;
  additional_expenses_id: number;
  account: {
    id: number;
    title: string;
  };
  amount: number;
  title: string;
}

export interface EnforcedPaymentItem {
  id: number;
  organization_unit: {
    id: number;
    title: string;
  };
  supplier: {
    id: number;
    title: string;
  };
  agent: {
    id: number;
    title: string;
  };
  execution_number: string;
  amount: number;
  amount_for_bank: number;
  amount_for_lawyer: number;
  amount_for_agent: number;
  bank_account: string;
  date_of_payment: string | Date;
  date_of_sap: string | Date;
  date_of_order: string | Date;
  id_of_statement: number;
  sap_id: string;
  status: string;
  file: {
    id: number;
    name: string;
    type: string;
  };
  return_file: {
    id: number;
    name: string;
    type: string;
  };
  return_date: string | Date;
  return_amount: number;
  items: Items[];
  created_at: string;
  updated_at: string;
  description: string;
  account_for_expenses: {
    id: number;
    title: string;
  };
}

export interface EnforcedPaymentInsertParams {
  organization_unit_id?: number;
  supplier_id?: number;
  amount?: number | null;
  amount_for_lawyer?: number | null;
  amount_for_agent?: number | null;
  date_of_payment: string | Date | null;
  items: {
    invoice_id: number | null;
    account_id: number | null;
  }[];
}

export interface EnforcedPaymentReturnParams {
  id: number;
  return_file_id: number;
  return_date: null | Date;
}
