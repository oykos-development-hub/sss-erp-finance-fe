import {GetResponse} from './response.ts';

export interface Count {
  id: number;
  parent_id: number;
  title: string;
  serial_number: string;
  children?: Count[];
}

export type CountResponse = {
  get: {
    account_Overview: GetResponse<Count>;
  };
};
