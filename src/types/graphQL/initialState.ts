import {GetResponse} from './response';

export type InitialState = {
  current_bank_account: string;
  amount: number;
};

export type InitialStateResponse = {
  getInitialState_Overview: GetResponse<InitialState>;
};
