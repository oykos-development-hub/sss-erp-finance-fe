import {GetResponse, InsertResponse, SimpleResponse} from './response';

export type FeesResponse = {
  get: {
    //Todo: replce any with corresponding types
    fee_Overview: GetResponse<any>;
  };
  insert: {
    fee_Insert: InsertResponse<any>;
  };
  delete: {
    fee_Delete: SimpleResponse;
  };
};

export type FeeInsertParams = {
  fee_type: number;
  fee_subcategory: number;
  decision_number: string;
  decision_date: string;
  subject: string;
  jmbg: string;
  residence: string;
  amount: number;
  payment_reference_number: string;
  debit_reference_number: string;
  execution_date: string;
  payment_deadline_date: string;
  description: string;
  court_account: number;
  file: number[];
  id: number;
};
