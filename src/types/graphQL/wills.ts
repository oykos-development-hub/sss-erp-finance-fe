import {WillStatusType} from '../../screens/deposit/fixedDeposit/wills/constants';
import {DropdownData} from '../dropdownData';
import {FileItem} from '../fileUploadType';
import {DepositJudge} from './fixedDeposits';
import {GetResponse, InsertResponse, SimpleResponse} from './response';

export type WillDispatch = {
  id: number;
  will_id: number;
  dispatch_type: string;
  judge: DropdownData<number>;
  case_number: string;
  date_of_dispatch: string;
  date_of_case: string;
  file: FileItem;
  created_at: string;
  updated_at: string;
};

export type Will = {
  id: number;
  organization_unit: DropdownData<number>;
  subject: string;
  father_name: string;
  date_of_birth: string;
  jmbg: string;
  case_number_si: string;
  case_number_rs: string;
  date_of_receipt_si: string;
  date_of_receipt_rs: string;
  date_of_end: string;
  status: WillStatusType;
  file: FileItem;
  dispatches: WillDispatch[];
  judges: DepositJudge[];
  description: string;
  created_at: string;
  updated_at: string;
};

export type InsertWillData = {
  subject: string;
  case_number_si: string;
  case_number_rs: string;
  date_of_receipt_si: string;
  date_of_receipt_rs: string;
  date_of_end: string | null;
  father_name: string;
  date_of_birth: string;
  jmbg: string;
  file_id: number | null;
  description: string;
};

export type WillResponse = {
  get: {
    fixedDepositWill_Overview: GetResponse<Will>;
  };
  insert: {
    fixedDepositWill_Insert: InsertResponse<Will>;
  };
  delete: {
    fixedDepositWill_Delete: SimpleResponse;
  };
};

export type WillDispatchResponse = {
  insert: {
    fixedDepositWillDispatch_Insert: InsertResponse<WillDispatch>;
  };
  delete: {
    fixedDepositWillDispatch_Delete: SimpleResponse;
  };
};

export type InsertWillDispatchData = {
  will_id: number;
  judge_id: number;
  date_of_dispatch: string;
  dispatch_type: string;
  file_id: number | null;
  id: number | null;
  case_number: string;
};
