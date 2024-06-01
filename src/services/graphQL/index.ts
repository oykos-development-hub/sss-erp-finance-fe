import {getEnvironment} from '../get-environment';
import accountingEntryInsert from './accounting/accountingEntryInsert.ts';
import accountingEntryOverview from './accounting/accountingEntryOverview.ts';
import analyticalCardOverview from './accounting/analyticalCardOverview.ts';
import buildAccountingOrderForObligations from './accounting/buildAccountingOrderForObligations.ts';
import deleteAccountingEntry from './accounting/deleteAccountingEntry.ts';
import getEnforcedPaymentsForAccounting from './accounting/getEnforcedPaymentsForAccounting.ts';
import getObligationsForAccounting from './accounting/getObligationsForAccounting.ts';
import getPaymentOrdersForAccounting from './accounting/getPaymentOrdersForAccounting.ts';
import getReturnedEnforcedPaymentsForAccounting from './accounting/getReturnedEnforcedPaymentsForAccounting.ts';
import additionalExpensesOverview from './additionalExpensesOverview/additionalExpensesOverview.ts';
import getBudgetDynamic from './budgetDynamic/getBudgetDynamic.ts';
import getBudgetDynamicHistory from './budgetDynamic/getBudgetDynamicHistory.ts';
import insertBudgetDynamic from './budgetDynamic/insertBudgetDynamic.ts';
import getBudgetRequestDetails from './budgetRequestDetails/getBudgetRequestDetails.ts';
import acceptBudgetRequestOfficial from './budgetRequestOfficial/acceptBudgetRequestOfficial.ts';
import rejectBudgetRequestOfficial from './budgetRequestOfficial/rejectBudgetRequestOfficial.ts';
import calculateAdditionalExpenses from './calculateAdditionalExpenses/calculateAdditionalExpenses.ts';
import getCountOverview from './counts/getCountOverview.ts';
import deleteBudget from './deleteBudget/deleteBudget';
import enforcedPaymentInsert from './enforcedPayments/enforcedPaymentInsert.ts';
import enforcedPaymentOverview from './enforcedPayments/enforcedPaymentOverview.ts';
import returnEnforcedPayment from './enforcedPayments/returnEnforcedPayment.ts';
import deleteFee from './fees/deleteFee.ts';
import deleteFeesPayment from './fees/feesPayments/deleteFeesPayment.ts';
import getFeesPayments from './fees/feesPayments/getFeesPayments.ts';
import insertFeesPayment from './fees/feesPayments/insertFeesPayment.ts';
import getFeesOverview from './fees/getFees.ts';
import insertFee from './fees/insertFee.ts';
import deleteFine from './fines/deleteFine.ts';
import deleteFinePayment from './fines/finePayments/deleteFinePayment.ts';
import getFinePayments from './fines/finePayments/getFinePayments.ts';
import insertFinePayment from './fines/finePayments/insertFinePayment.ts';
import finesOverview from './fines/finesOverview.ts';
import insertFine from './fines/insertFine.ts';
import deleteDepositDispatch from './fixedDeposits/deleteDepositDispatch.ts';
import deleteFixedDeposit from './fixedDeposits/deleteFixedDeposit.ts';
import deleteFixedDepositItem from './fixedDeposits/deleteFixedDepositItem.ts';
import getFixedDeposits from './fixedDeposits/getFixedDeposits.ts';
import insertDepositDispatch from './fixedDeposits/insertDepositDispatch.ts';
import insertFixedDeposit from './fixedDeposits/insertFixedDeposit.ts';
import insertFixedDepositItem from './fixedDeposits/insertFixedDepositItem.ts';
import deleteFlatRate from './flatRate/deleteFlatRate.ts';
import flatRateOverview from './flatRate/flatRateOverview.ts';
import deleteFlatRatePayment from './flatRate/flatRatePayments/deleteFlatRatePayment.ts';
import getFlatRatePayment from './flatRate/flatRatePayments/getFlatRatePayment.ts';
import insertFlatRatePayment from './flatRate/flatRatePayments/insertFlatRatePayment.ts';
import insertFlatRate from './flatRate/insertFlatRate.ts';
import getBudgetDetails from './getBudgetDetails/getBudgetDetails.ts';
import getBudgets from './getBudgets/getBudgets';
import insertBudget from './insertBudget/insertBudget.ts';
import goalsInsert from './insertNonFinancial/goals/insertGoals.ts';
import insertNonFinancial from './insertNonFinancial/insertNonFinancial.ts';
import deleteInvoice from './invoice/deleteInvoice.ts';
import getInvoice from './invoice/getInvoice.ts';
import insertInvoice from './invoice/insertInvoice.ts';
import getJudges from './judges/getJudges.ts';
import deleteProceduralCost from './proceduralCosts/deleteProceduralCost.ts';
import insertProceduralCost from './proceduralCosts/insertProceduralCost.ts';
import proceduralCostsOverview from './proceduralCosts/proceduralCostsOverview.ts';
import deleteProceduralCostPayment from './proceduralCosts/proceduralCostsPayments/deleteProceduralCostPayment.ts';
import getProceduralCostPayment from './proceduralCosts/proceduralCostsPayments/getProceduralCostPayment.ts';
import insertProceduralCostPayment from './proceduralCosts/proceduralCostsPayments/insertProceduralCostPayment.ts';
import deletePropertyBenefitsConfiscation from './propertyBenefitsConfiscation/deletePropertyBenefitsConfiscation.ts';
import insertPropertyBenefitsConfiscation from './propertyBenefitsConfiscation/insertPropertyBenefitsConfiscation.ts';
import propertyBenefitsConfiscationOverview from './propertyBenefitsConfiscation/propertyBenefitsConfiscationOverview.ts';
import deletePropertyBenefitsConfiscationPayment from './propertyBenefitsConfiscation/propertyBenefitsConfiscationPayments/deletePropertyBenefitsConfiscationPayment.ts';
import getPropertyBenefitsConfiscationPayment from './propertyBenefitsConfiscation/propertyBenefitsConfiscationPayments/getPropertyBenefitsConfiscationPayment.ts';
import insertPropertyBenefitsConfiscationPayment from './propertyBenefitsConfiscation/propertyBenefitsConfiscationPayments/insertPropertyBenefitsConfiscationPayment.ts';
import deletePaymentOrder from './receivables/deletePaymentOrder.ts';
import insertPaymentOrder from './receivables/insertPaymentOrder.ts';
import obligationsOverview from './receivables/obligationsOverview.ts';
import payPaymentOrder from './receivables/payPaymentOrder.ts';
import paymentOrderOverview from './receivables/paymentOrderOverview.ts';
import deleteSalary from './salaries/deleteSalary.ts';
import insertSalary from './salaries/insertSalary.ts';
import salariesOverview from './salaries/salariesOverview.ts';
import sendBudget from './sendBudget/sendBudget.ts';
import deleteDepositPayment from './transitDeposits/deleteDepositPayment.ts';
import deleteDepositPaymentOrder from './transitDeposits/deleteDepositPaymentOrder.ts';
import getAdditionalExpenses from './transitDeposits/getAdditionalExpenses.ts';
import getCases from './transitDeposits/getCases.ts';
import getDepositPaymentOrders from './transitDeposits/getDepositPaymentOrders.ts';
import getDepositPayments from './transitDeposits/getDepositPayments.ts';
import getInitialState from './transitDeposits/getInitialState.ts';
import getRemainAmountByCaseNumber from './transitDeposits/getRemainAmountByCaseNumber.ts';
import insertDepositPayment from './transitDeposits/insertDepositPayment.ts';
import insertDepositPaymentOrder from './transitDeposits/insertDepositPaymentOrder.ts';
import payOrder from './transitDeposits/payOrder.ts';
import getUserProfiles from './userProfiles/getUserProfiles.ts';
import deleteWill from './wills/deleteWill.ts';
import deleteWillDispatch from './wills/deleteWillDispatch.ts';
import getWill from './wills/getWill.ts';
import insertWill from './wills/insertWill.ts';
import insertWillDispatch from './wills/insertWillDispatch.ts';
import financialBudgetFill from './financialBudgetFill/financialBudgetFill.ts';
import nonFinancialBudgetFill from './nonFinancialBudgetFill/nonFinancialBudgetFill.ts';
import sendBudgetOnReview from './sendBudgetOnReview/sendBudgetOnReview.ts';
import cancelOrderPayment from './cancelOrderPayment/cancelOrderPayment.ts';

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
  propertyBenefitsConfiscationOverview: propertyBenefitsConfiscationOverview,
  insertPropertyBenefitsConfiscation: insertPropertyBenefitsConfiscation,
  deletePropertyBenefitsConfiscation: deletePropertyBenefitsConfiscation,
  getPropertyBenefitsConfiscationPayment: getPropertyBenefitsConfiscationPayment,
  insertPropertyBenefitsConfiscationPayment: insertPropertyBenefitsConfiscationPayment,
  deletePropertyBenefitsConfiscationPayment: deletePropertyBenefitsConfiscationPayment,
  flatRateOverview: flatRateOverview,
  insertFlatRate: insertFlatRate,
  deleteFlatRate: deleteFlatRate,
  getFlatRatePayments: getFlatRatePayment,
  insertFlatRatePayment: insertFlatRatePayment,
  deleteFlatRatePayment: deleteFlatRatePayment,
  insertFixedDeposit: insertFixedDeposit,
  deleteFixedDeposit: deleteFixedDeposit,
  insertFixedDepositItem: insertFixedDepositItem,
  deleteFixedDepositItem: deleteFixedDepositItem,
  insertDepositDispatch: insertDepositDispatch,
  deleteDepositDispatch: deleteDepositDispatch,
  getWill: getWill,
  insertWill: insertWill,
  deleteWill: deleteWill,
  insertWillDispatch: insertWillDispatch,
  deleteWillDispatch: deleteWillDispatch,
  calculateAdditionalExpenses: calculateAdditionalExpenses,
  additionalExpensesOverview: additionalExpensesOverview,
  insertDepositPayment: insertDepositPayment,
  getDepositPayments: getDepositPayments,
  deleteDepositPayment: deleteDepositPayment,
  getDepositPaymentOrders: getDepositPaymentOrders,
  deleteDepositPaymentOrder: deleteDepositPaymentOrder,
  insertDepositPaymentOrder: insertDepositPaymentOrder,
  getAdditionalExpenses: getAdditionalExpenses,
  getRemainAmountByCaseNumber: getRemainAmountByCaseNumber,
  getCases: getCases,
  payOrder: payOrder,
  getInitialState: getInitialState,
  paymentOrderOverview: paymentOrderOverview,
  deletePaymentOrder: deletePaymentOrder,
  obligationsOverview: obligationsOverview,
  payPaymentOrder: payPaymentOrder,
  insertPaymentOrder: insertPaymentOrder,
  salariesOverview: salariesOverview,
  insertSalary: insertSalary,
  deleteSalary: deleteSalary,
  getUserProfiles: getUserProfiles,
  enforcedPaymentOverview: enforcedPaymentOverview,
  enforcedPaymentInsert: enforcedPaymentInsert,
  returnEnforcedPayment: returnEnforcedPayment,
  getBudgetRequestDetails: getBudgetRequestDetails,
  getObligationsForAccounting: getObligationsForAccounting,
  buildAccountingOrderForObligations: buildAccountingOrderForObligations,
  accountingEntryInsert: accountingEntryInsert,
  accountingEntryOverview: accountingEntryOverview,
  deleteAccountingEntry: deleteAccountingEntry,
  getPaymentOrdersForAccounting: getPaymentOrdersForAccounting,
  getEnforcedPaymentsForAccounting: getEnforcedPaymentsForAccounting,
  getReturnedEnforcedPaymentsForAccounting: getReturnedEnforcedPaymentsForAccounting,
  acceptBudgetRequestOfficial: acceptBudgetRequestOfficial,
  rejectBudgetRequestOfficial: rejectBudgetRequestOfficial,
  analyticalCardOverview: analyticalCardOverview,
  financialBudgetFill: financialBudgetFill,
  nonFinancialBudgetFill: nonFinancialBudgetFill,
  sendBudgetOnReview: sendBudgetOnReview,
  cancelOrderPayment: cancelOrderPayment,
  getBudgetDynamic: getBudgetDynamic,
  getBudgetDynamicHistory: getBudgetDynamicHistory,
  insertBudgetDynamic: insertBudgetDynamic,
};
