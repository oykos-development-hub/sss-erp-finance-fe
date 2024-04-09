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
export interface InvoiceItem {
  id: number;
  status: string;
  type: string;
  type_of_contract: DropdownData<string>;
  type_of_subject: DropdownData<string>;
  source_of_funding: DropdownData<string>;
  pro_forma_invoice_number: string;
  invoice_number: string;
  supplier_title: string;
  supplier: {
    id: number;
    title: string;
  };
  order_id: number;
  order: {
    id: number;
    title: string;
  };
  organization_unit: DropdownData<string>;
  date_of_invoice: string;
  pro_forma_invoice_date: string;
  receipt_date: string;
  sss_invoice_receipt_date: Date;
  date_of_payment: string;
  date_of_start: string;
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
}

export interface GetInvoiceParams {
  page: number;
  size: number;
  type: string;
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
