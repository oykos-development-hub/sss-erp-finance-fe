import {BudgetOverviewItem} from './budgetOverview';
import {BudgetOverviewInsert} from './budgetInsert';
import {BudgetDetailsItem} from './budgetDetails';
import {NonFinancialGoal} from './nonFinancial.ts';
import {FinesOverviewItem} from './finesOverview.ts';
import {InvoiceItem} from './invoice.ts';
import {PaymentDetails as FinePaymentDetails} from '../../screens/finesAndTaxes/fines/paymentDetails/types.ts';
import {PaymentDetails as FeePaymentDetails} from '../../screens/finesAndTaxes/taxes/paymentDetails/types.ts';
import {ProceduralCostOverviewItem} from './proceduralCosts.ts';
import {PropertyBenefitsConfiscationOverviewItem} from './propertyBenefitsConfiscation.ts';
import {FlatRateOverviewItem} from './flatRate.ts';
import {ObligationsItem, PaymentOrderItem} from './receivablesTypes.ts';
import {Salary} from './salaries.ts';
import {EnforcedPaymentItem} from './enforcedPaymentTypes.ts';
import {BudgetRequestItem} from './budgetRequestDetails.ts';
import {AccountingOrderItem, ObligationsItemForAccounting, PaymentOrderItemForAccounting} from './accountingTypes.ts';

export type PageParams = {
  page?: number;
  size?: number;
};

export interface GetResponse<T> {
  status: string;
  message: string;
  total?: number;
  items: T[];
}

export interface InsertResponse<T> {
  status: string;
  message: string;
  item: T;
}

export type SimpleResponse = {
  status: string;
  message: string;
};

export type DetailsResponse<T> = {
  status: string;
  message: string;
  item: T | null;
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
  sendOnReview: {
    budget_SendOnReview: SimpleResponse;
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

export type FinesResponse = {
  get: {
    fine_Overview: GetResponse<FinesOverviewItem>;
  };
  insert: {
    fine_Insert: InsertResponse<FinesOverviewItem>;
  };
  delete: {
    fine_Delete: SimpleResponse;
  };
};

export type FinesPaymentsResponse = {
  get: {
    finePayment_Overview: GetResponse<FinePaymentDetails>;
  };
  insert: {
    finePayment_Insert: InsertResponse<FinePaymentDetails>;
  };
  delete: {
    finePayment_Delete: SimpleResponse;
  };
};

export type InvoiceResponse = {
  get: {
    invoice_Overview: GetResponse<InvoiceItem>;
  };
  insert: {
    invoice_Insert: InsertResponse<InvoiceItem>;
  };
  delete: {
    invoice_Delete: SimpleResponse;
  };
};

export type FeesPaymentsResponse = {
  get: {
    feePayment_Overview: GetResponse<FeePaymentDetails>;
  };
  insert: {
    feePayment_Insert: InsertResponse<FeePaymentDetails>;
  };
  delete: {
    feePayment_Delete: SimpleResponse;
  };
};

export type ProceduralCostResponse = {
  get: {
    procedureCost_Overview: GetResponse<ProceduralCostOverviewItem>;
  };
  insert: {
    procedureCost_Insert: InsertResponse<ProceduralCostOverviewItem>;
  };
  delete: {
    procedureCost_Delete: SimpleResponse;
  };
};

export type ProceduralCostPaymentsResponse = {
  get: {
    procedureCostPayment_Overview: GetResponse<any>;
  };
  insert: {
    procedureCostPayment_Insert: InsertResponse<any>;
  };
  delete: {
    procedureCostPayment_Delete: SimpleResponse;
  };
};

export type PropertyBenefitsConfiscationResponse = {
  get: {
    propertyBenefitConfiscation_Overview: GetResponse<PropertyBenefitsConfiscationOverviewItem>;
  };
  insert: {
    propertyBenefitConfiscation_Insert: InsertResponse<PropertyBenefitsConfiscationOverviewItem>;
  };
  delete: {
    propertyBenefitConfiscation_Delete: SimpleResponse;
  };
};

export type PropertyBenefitsConfiscationPaymentsResponse = {
  get: {
    propertyBenefitConfiscationPayment_Overview: GetResponse<any>;
  };
  insert: {
    propertyBenefitConfiscationPayment_Insert: InsertResponse<any>;
  };
  delete: {
    propertyBenefitConfiscationPayment_Delete: SimpleResponse;
  };
};

export type FlatRateResponse = {
  get: {
    flatRate_Overview: GetResponse<FlatRateOverviewItem>;
  };
  insert: {
    flatRate_Insert: InsertResponse<FlatRateOverviewItem>;
  };
  delete: {
    flatRate_Delete: SimpleResponse;
  };
};

export type FlatRatePaymentsResponse = {
  get: {
    flatRatePayment_Overview: GetResponse<any>;
  };
  insert: {
    flatRatePayment_Insert: InsertResponse<any>;
  };
  delete: {
    flatRatePayment_Delete: SimpleResponse;
  };
};

export type ReceivablesResponse = {
  get: {
    paymentOrder_Overview: GetResponse<PaymentOrderItem>;
  };
  getObligations: {
    obligations_Overview: GetResponse<ObligationsItem>;
  };
  delete: {
    paymentOrder_Delete: SimpleResponse;
  };
  pay: {
    payPaymentOrder: SimpleResponse;
  };
  insert: {
    paymentOrder_Insert: InsertResponse<PaymentOrderItem>;
  };
};

export type SalariesResponse = {
  get: {
    salary_Overview: GetResponse<Salary>;
  };
  insert: {
    salary_Insert: InsertResponse<Salary>;
  };
  delete: {
    salary_Delete: SimpleResponse;
  };
};

export type EnforcedPaymentResponse = {
  get: {
    enforcedPayment_Overview: GetResponse<EnforcedPaymentItem>;
  };
  insert: {
    enforcedPayment_Insert: InsertResponse<EnforcedPaymentItem>;
  };
  return: {
    returnEnforcedPayment: SimpleResponse;
  };
};

export type BudgetRequestDetails = {
  get: {
    budgetRequests_Details: DetailsResponse<BudgetRequestItem>;
  };
};
export type BudgetRequestOverview = {
  get: {
    officialBudgetRequests_Overview: GetResponse<any>;
  };
};

export type AccountingResponse = {
  get: {
    getObligationsForAccounting: GetResponse<ObligationsItemForAccounting>;
  };
  build: {
    buildAccountingOrderForObligations: GetResponse<AccountingOrderItem>;
  };
  insert: {
    accountingEntry_Insert: GetResponse<AccountingOrderItem>;
  };
  getAccountingEntry: {
    accountingEntry_Overview: GetResponse<AccountingOrderItem>;
  };
  delete: {
    accountingEntry_Delete: SimpleResponse;
  };
  getPaymentOrders: {
    getPaymentOrdersForAccounting: GetResponse<PaymentOrderItemForAccounting>;
  };
  getEnforcedPaymentOrders: {
    getEnforcedPaymentsForAccounting: GetResponse<PaymentOrderItemForAccounting>;
  };
  getReturnedEnforcedPaymentsForAccounting: {
    getReturnedEnforcedPaymentsForAccounting: GetResponse<PaymentOrderItemForAccounting>;
  };
};

export type BudgetRequestOfficialResponse = {
  accept: {
    budgetRequest_Accept: SimpleResponse;
  };
  reject: {
    budgetRequest_Reject: SimpleResponse;
  };
};

export type FinancialBudgetFillResponse = {
  fill: {
    financialBudget_Fill: GetResponse<any>;
  };
};

export type NonFinancialBudgetFillResponse = {
  fill: {
    nonFinancialBudget_Insert: InsertResponse<any>;
  };
};

export type FinancialBudgetActualFillResponse = {
  fill: {
    financialBudgetActual_Fill: GetResponse<any>;
  };
};

export type CurrentBudgetResponse = {
  get: {
    currentBudget_Overview: any;
  };
};
