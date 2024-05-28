import {GetResponse} from './response.ts';

export interface FilledData {
  actual: any; // It is probably null or a number, check it
  current_year: number;
  description: string;
  id: number;
  next_year: number;
  year_after_next: number;
}

export interface Count {
  id: number;
  parent_id: number | null;
  title: string;
  serial_number: string;
  children?: any[];
  filled_data?: FilledData | null;
}

export type CountResponse = {
  get: {
    account_Overview: GetResponse<Count>;
  };
};
