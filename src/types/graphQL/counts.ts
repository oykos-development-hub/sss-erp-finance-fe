import {GetResponse} from './response.ts';

export interface Count {
  id: number;
  parent_id: number;
  title: string;
  serial_number: string;
  children?: any[];
  // TODO check if filled_data is always a string
  filled_data?: string | null;
}

export type CountResponse = {
  get: {
    account_Overview: GetResponse<Count>;
  };
};
