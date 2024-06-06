import {DropdownData} from '../dropdownData';

export interface ArticlesType {
  id?: any;
  title?: string;
  net_price?: number;
  vat_price?: number;
  description?: string;
  vat_percentage?: number;
  amount?: number;
  account: {
    id?: number;
    title?: string;
  };
}

export interface AdditionalExpenses {
  id?: any;
  title?: string;
  price?: number;
  bank_account?: string;
  subject?: {
    id?: number;
    title?: string;
  };
  account: {
    id?: number;
    title?: string;
  };
}

export interface DecisionItem {
  id: number;
  type: string;
  invoice_number: string;
  supplier_title: string;
  supplier: {
    id: number;
    title: string;
  };
  date_of_invoice: string | Date;
  sss_invoice_receipt_date: Date;
  date_of_payment: string | Date;
  receipt_date: string | Date;
  issuer: string;
  date_of_start: string | Date;
  description: string;
  additional_expenses: AdditionalExpenses[];
  tax_authority_codebook: DropdownData<number>;
  type_of_decision: DropdownData<number>;
  source_of_funding: string;
  municipality: DropdownData<number>;
  type_of_contract: DropdownData<number>;
  status: string;
  net_price?: number;
  vat_price?: number;
  file: {
    id: number;
    name: string;
    type: string;
  };
}

export interface ContractItem {
  id: number;
  type: string;
  invoice_number: string;
  supplier_title: string;
  supplier: {
    id: number;
    title: string;
  };
  net_price?: number;
  vat_price?: number;
  date_of_invoice: string | Date;
  sss_invoice_receipt_date: Date;
  date_of_payment: string | Date;
  receipt_date: string | Date;
  issuer: string;
  date_of_start: string | Date;
  description: string;
  additional_expenses: AdditionalExpenses[];
  tax_authority_codebook: DropdownData<number>;
  type_of_contract: DropdownData<number>;
  source_of_funding: string;
  municipality: DropdownData<number>;
  type_of_decision: DropdownData<number>;
  status: string;
  file: {
    id: number;
    name: string;
    type: string;
  };
}

export interface InvoiceItem {
  id: number;
  status: string;
  type: string;
  type_of_subject: DropdownData<string>;
  source_of_funding: string;
  pro_forma_invoice_number: string;
  invoice_number: string;
  supplier_title: string;
  net_price: number;
  issuer: string;
  vat_price: number;
  supplier: {
    id: number;
    title: string;
  };
  order_id: number;
  account_amounts: [
    {
      account: string;
      amount: number;
      id: number;
    },
  ];
  order: {
    id: number;
    title: string;
  };
  organization_unit: DropdownData<string>;
  date_of_invoice: Date;
  pro_forma_invoice_date: Date;
  receipt_date: Date;
  sss_invoice_receipt_date: Date;
  date_of_payment: Date;
  date_of_start: Date;
  file: {
    id: number;
    name: string;
    type: string;
  };
  pro_forma_invoice_file: {
    id: number;
    name: string;
    type: string;
  };
  bank_account: string;
  description: string;
  articles: ArticlesType[];
  is_invoice: boolean;
  passed_to_accounting: boolean;
  passed_to_inventory: boolean;
  additional_expenses: AdditionalExpenses[];
  municipality: DropdownData<number>;
  tax_authority_codebook: DropdownData<number>;
  type_of_decision: DropdownData<number>;
  type_of_contract: DropdownData<number>;
  registred: boolean;
}

export interface GetInvoiceParams {
  page?: number;
  size?: number;
  type?: string;
  id?: number;
  status?: string | null;
  year?: string | null;
  supplier_id?: number | null;
  search?: string;
  organization_unit_id?: number;
}

export interface InsertInvoiceParams {
  is_invoice: {
    id: boolean;
    title: string;
  };
  invoice_number?: string;
  supplier_id?: number | null;
  order_id?: number | null;
  organization_unit_id?: number | null;
  date_of_invoice: string | null | Date;
  pro_forma_invoice_number: string;
  pro_forma_invoice_date: string | null | Date;
  receipt_date: string | null | Date;
  date_of_payment: string | null | Date;
  sss_invoice_receipt_date: string | null | Date;
  bank_account: DropdownData<string> | null;
  description: string;
  file_id?: number | null;
  pro_forma_invoice_file_id?: number | null;
  articles?: any[];
}
