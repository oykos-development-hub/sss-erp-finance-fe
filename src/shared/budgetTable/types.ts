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
}

export type BudgetTableHead = {
  name: string;
  width: number;
};
