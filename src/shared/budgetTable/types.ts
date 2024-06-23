import {DropdownData} from '../../types/dropdownData.ts';

export enum BudgetTableStep {
  /* 
  / 
  / This state refers to when the table is generated once the SSS employee has started creating a budget
  /
  */
  CREATING = 'creating',

  /* 
  / 
  / This state refers to when budget is to be determined by the corresponding organization unit
  /
  */
  BUDGETING = 'budgeting',

  /* 
  / 
  / This state refers to when budget is to be determined by the corresponding organization unit
  /
  */
  AWAITING_APPROVAL = 'awaiting-approval',

  /* 
  / 
  / This state refers to when the SSS employee is filling out the actual budget they got from the ministry of finances
  /
  */
  BUDGETING_ACTUAL = 'budgeting-actual',

  /* 
  / 
  / This state refers to when the organization unit is in annual view mode of the budget
  /
  */
  VIEW_ANNUAL = 'view-annual',

  /* 
  / 
  / This state refers to when the organization unit is in monthly view mode of the budget
  /
  */
  VIEW_MONTHLY = 'view-monthly',

  /* 
  / 
  / This state refers to when the organization unit is making a request to the SSS employee to rebalance the budget
  /
  */
  REBALANCING = 'rebalancing',

  CURRENT_BUDGET = 'CurrentBudget',

  VIEW_MONTHLY_WITH_EDIT = 'viewMonthlyWithEdit',

  INTERNAL_REALLOCATION = 'internalReallocation',

  /*
  /
  / This state refers to when the organization unit Manager need to fill out the internal reallocation
  /
  */

  INTERNAL_REALLOCATION_PREVIEW = 'internalReallocationPreview',

  /*
   /
   / This state refers to when the organization unit Manager views already filled out internal reallocation
   /
   */

  REQUEST_FUND_RELEASE = 'requestFundRelease',

  BUDGET_FINANCIAL = 'budgetFinancial',

  /*
  /
  / This state refers to when the organization unit Manager need to fill out the budget financial part
  /
  */

  EXTERNAL_REALLOCATION = 'externalReallocation',

  /*
  /
  / This state refers to when the organization unit Manager need to fill out the external reallocation request from another organization unit
  /
  */

  EXTERNAL_REALLOCATION_FO_PREVIEW = 'externalReallocationFOPreview',

  /*
  /
  / This state refers to when the finance offical needs to accept or reject external reallocation between two organization units
  /
  */
}

export type BudgetTableHead = {
  name: string;
  width: number;
  checkbox?: boolean;
};

export interface BudgetTableMethods {
  getInternalState: () => any; // Define the return type more specifically if possible
  resetForm: () => void;
}

export interface InternalReallocationExtraData {
  amount: string;
  destination_account: DropdownData<string>;
  id: number;
  source_account: DropdownData<string>;
}
