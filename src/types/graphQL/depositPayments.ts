import {DropdownData} from '../dropdownData';
import {FileItem} from '../fileUploadType';
import {GetResponse, InsertResponse, SimpleResponse} from './response';

export type DepositPayment = {
  id: number;
  title: string;
  payer: string;
  current_bank_account: string;
  case_number: string;
  party_name: string;
  number_of_bank_statement: string;
  date_of_bank_statement: string;
  account: DropdownData<number>;
  organization_unit: DropdownData<number>;
  amount: number;
  main_bank_account: boolean;
  date_of_transfer_main_account: string;
  file: FileItem;
  created_at: string;
  updated_at: string;
};

export type DepositPaymentInsertData = {
  id: number | null;
  payer: string;
  case_number: string;
  party_name: string;
  number_of_bank_statement: string;
  date_of_bank_statement: string;
  amount: number;
  main_bank_account: boolean;
  current_bank_account: string | null;
  date_of_transfer_main_account: string | null;
  account_id: number;
  file_id: number | null;
};

export type DepositPaymentResponse = {
  get: {
    depositPayment_Overview: GetResponse<DepositPayment>;
  };
  insert: {
    depositPayment_Insert: InsertResponse<DepositPayment>;
  };
  delete: {
    depositPayment_Delete: SimpleResponse;
  };
};
