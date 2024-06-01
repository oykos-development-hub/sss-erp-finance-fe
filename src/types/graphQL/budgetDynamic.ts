import {GetResponse, InsertResponse} from './response';

export type GetBudgetDynamicParams = {
  budget_id?: number;
  unit_id?: number;
  version?: number | null;
};

export type GetBudgetDynamicHistoryParams = {
  budget_id: number;
  unit_id?: number;
};

export type BudgetDynamicMonth = {
  value: string;
  savings: string;
};

export type BudgetDynamicCount = {
  id: number;
  budget_id: number;
  unit_id: number;
  account_id: number;
  current_budget_id: number;
  account_serial_number: string;
  account_title: string;
  actual: any;
  username: string;
  january: BudgetDynamicMonth;
  february: BudgetDynamicMonth;
  march: BudgetDynamicMonth;
  april: BudgetDynamicMonth;
  may: BudgetDynamicMonth;
  june: BudgetDynamicMonth;
  july: BudgetDynamicMonth;
  august: BudgetDynamicMonth;
  september: BudgetDynamicMonth;
  october: BudgetDynamicMonth;
  november: BudgetDynamicMonth;
  december: BudgetDynamicMonth;
  total_savings: number;
  children: BudgetDynamicCount[];
};

export type BudgetDynamicHistoryItem = {
  unit_id: number;
  budget_id: number;
  created_at: string;
  username: string;
  version: number;
};

export type GetBudgetDynamicResponse = {
  spendingDynamic_Overview: GetResponse<BudgetDynamicCount>;
};

export type GetBudgetDynamicHistoryResponse = {
  spendingDynamic_History: GetResponse<BudgetDynamicHistoryItem>;
};

export type InsertBudgetDynamicResponse = {
  spendingDynamic_Insert: InsertResponse<BudgetDynamicCount[]>;
};

export type InsertBudgetDynamicCountItem = {
  budget_id: number;
  unit_id: number;
  account_id: number;
  january: string;
  february: string;
  march: string;
  april: string;
  may: string;
  june: string;
  july: string;
  august: string;
  september: string;
  october: string;
  november: string;
  december: string;
};

export type CountDynamicInsertData = {
  account_id: number;
  january: number;
  february: number;
  march: number;
  april: number;
  may: number;
  june: number;
  july: number;
  august: number;
  september: number;
  october: number;
  november: number;
  december: number;
};

export type BudgetDynamicInsertData = CountDynamicInsertData[];
