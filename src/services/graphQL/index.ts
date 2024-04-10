import {getEnvironment} from '../get-environment';
import getCountOverview from './counts/getCountOverview.ts';
import deleteBudget from './deleteBudget/deleteBudget';
import finesOverview from './fines/finesOverview.ts';
import insertFine from './fines/insertFine.ts';
import deleteFinePayment from './fines/finePayments/deleteFinePayment.ts';
import getFinePayments from './fines/finePayments/getFinePayments.ts';
import insertFinePayment from './fines/finePayments/insertFinePayment.ts';
import deleteFine from './fines/deleteFine.ts';
import getFeesOverview from './fees/getFees.ts';
import insertFee from './fees/insertFee.ts';
import deleteFee from './fees/deleteFee.ts';
import deleteFeesPayment from './fees/feesPayments/deleteFeesPayment.ts';
import insertFeesPayment from './fees/feesPayments/insertFeesPayment.ts';
import getFeesPayments from './fees/feesPayments/getFeesPayments.ts';
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
import sendBudget from './sendBudget/sendBudget.ts';
import proceduralCostsOverview from './proceduralCosts/proceduralCostsOverview.ts';
import insertProceduralCost from './proceduralCosts/insertProceduralCost.ts';
import deleteProceduralCost from './proceduralCosts/deleteProceduralCost.ts';
import getProceduralCostPayment from './proceduralCosts/proceduralCostsPayments/getProceduralCostPayment.ts';
import insertProceduralCostPayment from './proceduralCosts/proceduralCostsPayments/insertProceduralCostPayment.ts';
import deleteProceduralCostPayment from './proceduralCosts/proceduralCostsPayments/deleteProceduralCostPayment.ts';

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
  insertFinePayment: insertFinePayment,
  deleteFinePayment: deleteFinePayment,
  getFinePayments: getFinePayments,
  getFeesOverview: getFeesOverview,
  insertFee: insertFee,
  deleteFee: deleteFee,
  insertFeePayment: insertFeesPayment,
  deleteFeePayment: deleteFeesPayment,
  getFeePayments: getFeesPayments,
  getInvoice: getInvoice,
  insertInvoice: insertInvoice,
  deleteInvoice: deleteInvoice,
  getFixedDeposits: getFixedDeposits,
  getJudges: getJudges,
  proceduralCostsOverview: proceduralCostsOverview,
  insertProceduralCost: insertProceduralCost,
  deleteProceduralCost: deleteProceduralCost,
  getProceduralCostPayments: getProceduralCostPayment,
  insertProceduralCostPayment: insertProceduralCostPayment,
  deleteProceduralCostPayment: deleteProceduralCostPayment,
};
