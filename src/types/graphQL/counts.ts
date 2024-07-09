import {GetResponse} from './response.ts';

export interface FilledData {
  actual: number;
  current_year: number;
  description: string;
  id: number;
  next_year: number;
  year_after_next: number;
}

export interface FilledDataActual {
  actual: number;
  balance: number;
  budget_id: number;
  initial_actual: number;
  current_amount: number;
}

export interface Count {
  id: number;
  parent_id: number | null;
  title: string;
  serial_number: string;
  children?: any[];
  filled_data?: FilledData | FilledDataActual | null;
}

// Type guard to check if filled_data is for current or actual budget
export const isFilledData = (data: FilledData | FilledDataActual | null | undefined): data is FilledData =>
  data !== null &&
  data !== undefined &&
  typeof data === 'object' &&
  'current_year' in data &&
  'description' in data &&
  'next_year' in data &&
  'year_after_next' in data;

// Type guard to check if filled_data is for current or actual budget
export const isFilledDataActual = (data: FilledData | FilledDataActual | null | undefined): data is FilledDataActual =>
  data !== null &&
  data !== undefined &&
  typeof data === 'object' &&
  'balance' in data &&
  'budget_id' in data &&
  'initial_actual' in data;

export type CountResponse = {
  get: {
    account_Overview: GetResponse<Count>;
  };
};
