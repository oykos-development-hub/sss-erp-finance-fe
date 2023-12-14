import {BudgetOverviewItem} from './budgetOverview';
import {BudgetOverviewInsert} from './budgetInsert';
import {BudgetDetailsItem} from './budgetDetails';
import {NonFinancialGoal} from './nonFinancial.ts';

export interface GetResponse<T> {
  status: string;
  message: string;
  total?: number;
  items: T[];
}

export interface InsertResponse<T> {
  status: string;
  message: string;
  item: T[];
}

export type SimpleResponse = {
  status: string;
  message: string;
};

export type DetailsResponse<T> = {
  status: string;
  message: string;
  item: T;
};

export type BudgetResponse = {
  get: {
    budget_Overview: GetResponse<BudgetOverviewItem>;
  };
  insert: {
    budget_Insert: InsertResponse<BudgetOverviewInsert>;
  };
  delete: {
    budget_Delete: SimpleResponse;
  };
  send: {
    budget_Send: SimpleResponse;
  };
  details: {
    budget_Details: GetResponse<BudgetDetailsItem>;
  };
};

export type NonFinancialResponse = {
  // get: {};
  insert: {
    // TODO add correct type
    requestNotFinancially_Insert: InsertResponse<any>;
  };
  // delete: {};
};

export type GoalsResponse = {
  // get: {};
  insert: {
    // TODO add correct type
    goalsNotFinancially_Insert: InsertResponse<NonFinancialGoal>;
  };
  // delete: {};
};
