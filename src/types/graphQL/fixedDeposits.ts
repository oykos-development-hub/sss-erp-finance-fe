import {FixedDepositType, FixedDepositStatus} from '../deposits';
import {DropdownData} from '../dropdownData';
import {FileItem} from '../fileUploadType';
import {GetResponse} from './response';

export type DepositConfiscation = {
  id: number;
  deposit_id: number;
  category: DropdownData<number>;
  judge: DropdownData<number>;
  type: string;
  unit: string;
  currency: string;
  case_number: string;
  serial_number: string;
  amount: number;
  date_of_confiscation: string;
  date_of_case: string;
  file: FileItem;
  created_at: string;
  updated_at: string;
};

export type DepositDispatch = {
  id: number;
  deposit_id: number;
  category: DropdownData<number>;
  judge: DropdownData<number>;
  type: string;
  unit: string;
  currency: string;
  case_number: string;
  serial_number: string;
  amount: number;
  date_of_action: string;
  subject: string;
  action: string;
  file: FileItem;
  created_at: string;
  updated_at: string;
};

export type DepositJudge = {
  id: number;
  deposit_id: number;
  will_id: number;
  judge: DropdownData<number>;
  date_of_start: string;
  date_of_end: string;
  file: FileItem;
  created_at: string;
  updated_at: string;
};

export type FixedDeposit = {
  id: number;
  organization_unit: DropdownData<number>;
  subject: string;
  judge: DropdownData<number>;
  case_number: string;
  date_of_recipiet: string;
  date_of_case: string;
  date_of_finality: string;
  date_of_enforceability: string;
  date_of_end: string;
  account: DropdownData<number>;
  status: FixedDepositStatus;
  type: FixedDepositType;
  file: FileItem;
  items: DepositConfiscation[];
  dispatches: DepositDispatch[];
  judges: DepositJudge[];
  created_at: string;
  updated_at: string;
};

export type FixedDepositResponse = {
  get: {
    fixedDeposit_Overview: GetResponse<FixedDeposit>;
  };
};
