import {BudgetCount} from './budget';
import {DetailsResponse} from './response';

export type BudgetFinancial = {
  version: number;
  latest_version: number;
  accounts: BudgetCount[];
};

export type BudgetFinancialResponseData = DetailsResponse<BudgetFinancial>;

export type BudgetFinancialResponse = {financialBudget_Details: BudgetFinancialResponseData};
