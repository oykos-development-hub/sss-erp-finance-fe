import {getEnvironment} from '../get-environment';
import getCountOverview from './counts/getCountOverview.ts';
import deleteBudget from './deleteBudget/deleteBudget';
import deleteFine from './fines/deleteFine.ts';
import finesOverview from './fines/finesOverview.ts';
import insertFine from './fines/insertFine.ts';
import getFixedDeposits from './fixedDeposits/getFixedDeposits.ts';
import getBudgetDetails from './getBudgetDetails/getBudgetDetails.ts';
import getBudgets from './getBudgets/getBudgets';
import insertBudget from './insertBudget/insertBudget.ts';
import goalsInsert from './insertNonFinancial/goals/insertGoals.ts';
import insertNonFinancial from './insertNonFinancial/insertNonFinancial.ts';
import deleteInvoice from './invoice/deleteInvoice.ts';
import getInvoice from './invoice/getInvoice.ts';
import insertInvoice from './invoice/insertInvoice.ts';
import getJudges from './judges/getJudges.ts';
import deletePayment from './payments/deletePayment.ts';
import getPayments from './payments/getPayments.ts';
import insertPayment from './payments/insertPayment.ts';
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
  finesOverview: finesOverview,
  insertFine: insertFine,
  deleteFine: deleteFine,
  insertPayment: insertPayment,
  deletePayment: deletePayment,
  getPayments: getPayments,
  getInvoice: getInvoice,
  insertInvoice: insertInvoice,
  deleteInvoice: deleteInvoice,
  getFixedDeposits: getFixedDeposits,
  getJudges: getJudges,
};
