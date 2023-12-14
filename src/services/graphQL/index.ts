import {getEnvironment} from '../get-environment';
import getBudgets from './getBudgets/getBudgets';
import deleteBudget from './deleteBudget/deleteBudget';
import insertBudget from './insertBudget/insertBudget.ts';
import getCountOverview from './counts/getCountOverview.ts';
import getBudgetDetails from './getBudgetDetails/getBudgetDetails.ts';
import insertNonFinancial from './insertNonFinancial/insertNonFinancial.ts';
import goalsInsert from './insertNonFinancial/goals/insertGoals.ts';
import sendBudget from './sendBudget/sendBudget.ts';

export const BFF_URL = {
  local: 'http://localhost:8080',
  development: 'https://sss-erp-bff.oykos.me',
  staging: 'http://localhost:8080',
  production: 'http://localhost:8080',
};

export const GraphQL = {
  fetch: (query: string, variables?: any): Promise<any> => {
    return fetch(BFF_URL[getEnvironment()], {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({query, variables}),
    })
      .then(response => response.json())
      .catch(error => console.error(error));
  },
  getBudgets: getBudgets,
  insertBudget: insertBudget,
  deleteBudget: deleteBudget,
  sendBudget: sendBudget,
  getCountOverview: getCountOverview,
  getBudgetDetails: getBudgetDetails,
  insertNonFinancial: insertNonFinancial,
  goalsInsert: goalsInsert,
};
