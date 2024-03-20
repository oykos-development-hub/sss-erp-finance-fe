export type BudgetCount = {
  id: number;
  parent_id: number;
  title: string;
  serial_number: string;
  children: BudgetCount[];
};

export type UpdateControVersionResponse = {
  financialBudgetVersion_Update: {
    status: string;
    message: string;
    item: UpdateControVersionResponseData;
  };
};

export type UpdateControVersionResponseData = {
  version: number;
  latest_version: number;
  accounts: BudgetCount[];
};
