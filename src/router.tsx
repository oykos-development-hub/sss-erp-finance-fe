import {UserRole} from './constants.ts';
import useAppContext from './context/useAppContext.ts';
import {NotFound404} from './screens/404';
import {CurrentAccountingEnforcedPaymentOrderTabs} from './screens/accounting/accountingEnforcedPaymentOrdes/currentAccountingEnforcedPaymentOrderTabs.tsx';
import {CurrentAccountingTabs} from './screens/accounting/accountingObligations/currentAccountingTabs.tsx';
import {CurrentAccountingPaymentOrderTabs} from './screens/accounting/accountingPaymentOrders/currentAccountingPaymentOrderTabs.tsx';
import ACCOUNTING from './screens/accounting/landingPage.tsx';
import {CurrentReturnedEnforcedPaymentsForAccountingTabs} from './screens/accounting/returnedEnforcedPaymentsForAccounting/currentReturnedEnforcedPaymentsForAccountingTabs.tsx';
import BudgetFO from './screens/budget/budgetFO/budgetFO.tsx';
import {BudgetSendTabs} from './screens/budget/budgetSendDetails/budgetSendTabs.tsx';
import BudgetTemplate from './screens/budget/budgetTemplate/budgetTemplate.tsx';
import {CurrentBudgetTabs} from './screens/budget/currentBudget/currentBudgetTabs.tsx';
import ExternalReallocationOverview from './screens/budget/externalReallocation/externalReallocationOverview.tsx';
import FundReleaseRequest from './screens/budget/fundRelease/fundReleaseRequest.tsx';
import InternalReallocationBudget from './screens/budget/internalReallocation/internalReallocationBudgetTemplate.tsx';
import InternalReallocationOverview from './screens/budget/internalReallocation/internalReallocationOverview.tsx';
import BUDGET from './screens/budget/landingPage.tsx';
import NonFinancePreview from './screens/budget/nonFinancePreview/nonFinancePreview.tsx';
import NonFinancialOverview from './screens/budget/nonFinancialOverview/nonFinancialOverview.tsx';
import OUBudgetSubmission from './screens/budget/planning/OUBudgetSubmission/OUBudgetSubmission.tsx';
import SSSBudgetDetails from './screens/budget/planning/SSSBudgetDetails/SSSBudgetDetails.tsx';
import BudgetList from './screens/budget/planning/budgetList/budgetList.tsx';
import {SpendingDynamicsTabs} from './screens/budget/spendingDynamics/budgetDynamicTabs.tsx';
import FinanceDepositDetails from './screens/deposit/fixedDeposit/financeDeposit/financeDepositDetails.tsx';
import {FixedDepositTabs} from './screens/deposit/fixedDeposit/fixedDepositTabs.tsx';
import MaterialDepositDetails from './screens/deposit/fixedDeposit/materialDeposit/materialDepositDetails.tsx';
import WillDetails from './screens/deposit/fixedDeposit/wills/willDetails.tsx';
import {DepositLandingPage} from './screens/deposit/landingPages/depositLandingPage.tsx';
import {FixedDepositLandingPage} from './screens/deposit/landingPages/fixedDepositLanding.tsx';
import TransitDepositLandingPage from './screens/deposit/landingPages/transitDepositLanding.tsx';
import DepositPaymentOrderDetails from './screens/deposit/transitDeposit/depositPaymentOrders/depositPaymentOrderDetails.tsx';
import DepositPaymentOrderTabs from './screens/deposit/transitDeposit/depositPaymentOrders/depositPaymentOrderTabs.tsx';
import DepositPaymentDetails from './screens/deposit/transitDeposit/depositPayments/depositPaymentDetails.tsx';
import DepositPaymentsTabs from './screens/deposit/transitDeposit/depositPayments/depositPaymentsTabs.tsx';
import DepositTaxesOverview from './screens/deposit/transitDeposit/depositTaxes/depositTaxesOverview.tsx';
import Confiscation from './screens/finesAndTaxes/confiscation/confiscation.tsx';
import PropertyBenefitsConfiscationDetails from './screens/finesAndTaxes/confiscation/propertyBenefitsConfiscationDetails/propertyBenefitsConfiscationDetails.tsx';
import FineDetails from './screens/finesAndTaxes/fines/fineDetails/fineDetails.tsx';
import Fines from './screens/finesAndTaxes/fines/fines.tsx';
import FlatRate from './screens/finesAndTaxes/flatRate/flatRate.tsx';
import FlatRateDetails from './screens/finesAndTaxes/flatRate/flatRateDetails/flatRateDetails.tsx';
import {LandingPage as FinesAndTaxesLanding} from './screens/finesAndTaxes/landingPage.tsx';
import ProceduralCostDetails from './screens/finesAndTaxes/proceduralCosts/proceduralCostDetails/proceduralCostDetails.tsx';
import ProceduralCosts from './screens/finesAndTaxes/proceduralCosts/proceduralCosts.tsx';
import FeeDetails from './screens/finesAndTaxes/taxes/feeDetails/feeDetails.tsx';
import Taxes from './screens/finesAndTaxes/taxes/taxes.tsx';
import {LandingPage} from './screens/landingPage/landingPage.tsx';
import AdditionalExpensesOverview from './screens/liabilitesAndReceivables/additionalExpenses/additionalExpensesOverview.tsx';
import {Contracts} from './screens/liabilitesAndReceivables/contracts/contracts.tsx';
import ContractsDetails from './screens/liabilitesAndReceivables/contracts/contractsDetails/contractsDetails.tsx';
import {DecisionTabs} from './screens/liabilitesAndReceivables/decisions/decisionTabs.tsx';
import DecisionsDetails from './screens/liabilitesAndReceivables/decisions/decisionsDetails/decisionsDetails.tsx';
import EnforcedPaymentsDetails from './screens/liabilitesAndReceivables/enforcedPayments/enforcedPaymentsDetails/enforcedPaymentsDetails.tsx';
import EnforcedPaymentEntry from './screens/liabilitesAndReceivables/enforcedPayments/enforcedPaymentsEntry/enforcedPaymentEntry.tsx';
import EnforcedPaymentsOverview from './screens/liabilitesAndReceivables/enforcedPayments/enforcedPaymentsOverview/enforcedPaymentsOverview.tsx';
import InvoiceDetails from './screens/liabilitesAndReceivables/invoices/invoiceDetails/invoiceDetails.tsx';
import Invoices from './screens/liabilitesAndReceivables/invoices/invoices.tsx';
import {LiabilitiesLandingPage} from './screens/liabilitesAndReceivables/liabilitiesLanding/liabilitiesLandingPage.tsx';
import {LiabilitiesReceivablesLandingPage} from './screens/liabilitesAndReceivables/liabilitiesReceivablesLandingPage.tsx';
import ReceivableDetails from './screens/liabilitesAndReceivables/receivables/receivableDetails/receivableDetails.tsx';
import ReceivableEntry from './screens/liabilitesAndReceivables/receivables/receivableEntry/receivableEntry.tsx';
import ReceivablesOverview from './screens/liabilitesAndReceivables/receivables/receivablesOverview/receivablesOverview.tsx';
import Salaries from './screens/liabilitesAndReceivables/salaries/salaries.tsx';
import SalaryDetails from './screens/liabilitesAndReceivables/salaries/salaryDetails/salaryDetails.tsx';
import {AccountingReports} from './screens/reports/reports.tsx';
import {useRoleCheck} from './utils/useRoleCheck.ts';
import BudgetDynamicVersionPreview from './screens/budget/spendingDynamics/budgetDynamicPreview/budgetDynamicVersion.tsx';
import AddNewBudgetDynamic from './screens/budget/spendingDynamics/addNewDynamic/addNewDynamic.tsx';
import BudgetRequestDetailsOfficial from './screens/budget/budgetRequestDetailsOfficial/budgetRequestDetailsOfficial.tsx';
import BudgetFillActual from './screens/budget/budgetFillActual/budgetFillActual.tsx';
import {ReceivablesLandingPage} from './screens/liabilitesAndReceivables/receivablesLandingPage/receivablesLandingPage.tsx';
import ExternalReallocationDetails from './screens/budget/externalReallocation/externalReallocationDetails.tsx';
import ExternalReallocationFinanceOfficialDetails from './screens/budget/externalReallocation/externalReallocationFinanceOfficialDetails.tsx';
import {NonFinance} from './screens/budget/nonFinance/nonFinance.tsx';
import FundRelease from './screens/budget/fundRelease/fundRelease.tsx';

//* OU - organization unit
//* SSS - judicial council official

export const fundReleaseDetailsRegex = /^\/finance\/budget\/current\/fund-release\/([1-9]|1[0-2])_(\d{4})$/;

export const Router = () => {
  const {
    navigation: {
      location: {pathname},
      navigate,
    },
    contextMain: {role_id},
  } = useAppContext();

  const renderScreen = () => {
    const path = pathname.split('/');
    const name = path[path.length - 1];

    const SSSBudgetDetailsRegex = /^\/finance\/budget\/planning\/(add-new|\d+)$/;
    const OUBudgetDetailsSummary = /^\/finance\/budget\/planning\/\d+\/(summary|financial|non-financial)$/;
    const FinancialDepositDetailsRegex = /^\/finance\/deposit\/fixed\/financial\/\d+$/;
    const MaterialDepositDetailsRegex = /^\/finance\/deposit\/fixed\/material\/\d+$/;
    const WillDetailsRegex = /^\/finance\/deposit\/fixed\/wills\/\d+$/;
    const DepositPaymentsDetailsRegex = /^\/finance\/deposit\/transit\/payments\/\d+$/;
    const DepositPaymentsOrderDetailsRegex = /^\/finance\/deposit\/transit\/payment-orders\/\d+$/;

    // const budgetDetails = new RegExp(`^/finance/budget/\\d+/${name}$`);
    if (pathname === '/finance/liabilities-receivables') return <LiabilitiesReceivablesLandingPage />;
    if (pathname === '/finance/liabilities-receivables/liabilities') return <LiabilitiesLandingPage />;
    const invoicesRegex = new RegExp('^/finance/liabilities-receivables/liabilities/invoices(?:/add-invoice)?$');
    const invoiceEditRegex = new RegExp('^/finance/liabilities-receivables/liabilities/invoices/\\d+$');
    const decisionsEditRegex = new RegExp('^/finance/liabilities-receivables/liabilities/decisions/\\d+$');
    const contractsEditRegex = new RegExp('^/finance/liabilities-receivables/liabilities/contracts/\\d+$');
    const receiveRegex = new RegExp(
      '^/finance/liabilities-receivables/receivables/payment-orders(?:/add-receivable)?$',
    );
    const receiveEditRegex = new RegExp('^/finance/liabilities-receivables/receivables/payment-orders/\\d+$');
    const salariesRegex = new RegExp('^/finance/liabilities-receivables/liabilities/salaries(?:/add-salary)?$');
    const salaryDetailsRegex = new RegExp('^/finance/liabilities-receivables/liabilities/salaries/\\d+$');
    const enforcedPaymentRegex = new RegExp(
      '^/finance/liabilities-receivables/receivables/enforced-payments(?:/add-enforced-payment)?$',
    );
    const enforcedPaymentEditRegex = new RegExp(
      '^/finance/liabilities-receivables/receivables/enforced-payments/\\d+$',
    );

    const finesRegex = new RegExp('^/finance/fines-taxes/fines(?:/add-new)?$');
    const fineDetailsRegex = new RegExp('^/finance/fines-taxes/fines/\\d+$');
    const feeDetailsRegex = new RegExp('^/finance/fines-taxes/taxes/\\d+$');
    const confiscationDetailsRegex = new RegExp('^/finance/fines-taxes/confiscation/\\d+$');
    const proceduralCostDetailsRegex = new RegExp('^/finance/fines-taxes/procedural-costs/\\d+$');
    const flatRateDetailsRegex = new RegExp('^/finance/fines-taxes/flat-rate/\\d+$');
    const taxesRegex = new RegExp('^/finance/fines-taxes/taxes(?:/add-taxes)?$');
    const confiscationRegex = new RegExp('^/finance/fines-taxes/confiscation(?:/add-confiscation)?$');
    const flatRateRegex = new RegExp('^/finance/fines-taxes/flat-rate(?:/add-flat-rate)?$');
    const proceduralCostRegex = new RegExp('^/finance/fines-taxes/procedural-costs(?:/add-procedural-costs)?$');
    const fundReleaseRegex = new RegExp('^/finance/budget/current/fund-release(?:/requests)?$');
    const budgetPreviewDetails = new RegExp(`^/finance/budget/nonFinancePreview/${name}$`);
    const budgetFO = new RegExp(`^/finance/budgetFO/\\d+(?:/${name})$`);
    const sentBudgetDetails = new RegExp('/finance/budget/planning/([^/]+)/details');
    const sentBudgetRequests = new RegExp('/finance/budget/planning/([^/]+)/requests');
    const currentBudgetDynamicDetails = new RegExp('/finance/budget/current/requests/\\d+$');
    const nonFinanceDetails = new RegExp('/finance/budget/current/non-financial/\\d+$');
    const budgetRequestDetailsRegex = new RegExp(
      '^/finance/budget/planning/\\d+/requests/\\d+/(financial|non-financial|summary)$',
    );
    const fillActualBudgetRegex = new RegExp('^/finance/budget/planning/\\d+/requests/\\d+/actual$');
    const budgetReallocationRegex = new RegExp('^/finance/budget/current/internal-reallocation/(create|\\d+)$');

    const externalReallocationDetailsRegex = new RegExp('^/finance/budget/current/external-reallocation/\\d+$');
    const externalReallocationFinanceOfficialDetailsRegex = new RegExp('^/finance/budget/requests/\\d+$');

    if (budgetRequestDetailsRegex.test(pathname)) return <BudgetRequestDetailsOfficial />;

    if (useRoleCheck(role_id, [UserRole.ADMIN, UserRole.FINANCE_OFFICIAL])) {
      if (SSSBudgetDetailsRegex.test(pathname)) return <SSSBudgetDetails />;
      if (fillActualBudgetRegex.test(pathname)) return <BudgetFillActual />;
    }

    if (useRoleCheck(role_id, [UserRole.MANAGER_OJ, UserRole.FINANCE_OFFICIAL])) {
      if (OUBudgetDetailsSummary.test(pathname)) return <OUBudgetSubmission />;
    }

    if (pathname === '/finance/reports') return <AccountingReports />;

    if (pathname === '/finance/accounting') return <ACCOUNTING />;

    if (pathname === '/finance') return <LandingPage />;
    if (pathname === '/finance/budget') return <BUDGET />;
    if (pathname === '/finance/budget/planning') return <BudgetList />;
    if (pathname === '/finance/budget-template') return <BudgetTemplate />;
    if (pathname === '/finance/budget/current') return <CurrentBudgetTabs />;
    if (pathname === '/finance/budget/requests') return <CurrentBudgetTabs />;
    if (sentBudgetDetails.test(pathname)) return <BudgetSendTabs />;
    if (sentBudgetRequests.test(pathname)) return <BudgetSendTabs />;

    if (pathname === '/finance/accounting/payment-orders') return <CurrentAccountingPaymentOrderTabs />;
    if (pathname === '/finance/accounting/payment-orders-overview') return <CurrentAccountingPaymentOrderTabs />;

    if (pathname === '/finance/accounting/obligations') return <CurrentAccountingTabs />;
    if (pathname === '/finance/accounting/obligations-overview') return <CurrentAccountingTabs />;

    if (pathname === '/finance/accounting/enforced-payments') return <CurrentAccountingEnforcedPaymentOrderTabs />;
    if (pathname === '/finance/accounting/enforced-payments-overview')
      return <CurrentAccountingEnforcedPaymentOrderTabs />;

    if (pathname === '/finance/accounting/returned-enforced-payments')
      return <CurrentReturnedEnforcedPaymentsForAccountingTabs />;
    if (pathname === '/finance/accounting/returned-enforced-payments-overview')
      return <CurrentReturnedEnforcedPaymentsForAccountingTabs />;

    if (pathname === '/finance/deposit') return <DepositLandingPage />;
    if (pathname === '/finance/deposit/fixed') return <FixedDepositLandingPage />;

    if (pathname === '/finance/deposit/fixed/financial') navigate('/finance/deposit/fixed/financial/overview');
    if (pathname === '/finance/deposit/fixed/financial/overview') return <FixedDepositTabs />;
    if (pathname === '/finance/deposit/fixed/financial/add-new') return <FixedDepositTabs />;
    if (FinancialDepositDetailsRegex.test(pathname)) return <FinanceDepositDetails />;

    if (pathname === '/finance/deposit/fixed/material') navigate('/finance/deposit/fixed/material/overview');
    if (pathname === '/finance/deposit/fixed/material/overview') return <FixedDepositTabs />;
    if (pathname === '/finance/deposit/fixed/material/add-new') return <FixedDepositTabs />;
    if (MaterialDepositDetailsRegex.test(pathname)) return <MaterialDepositDetails />;

    if (pathname === '/finance/deposit/fixed/wills') navigate('/finance/deposit/fixed/wills/overview');
    if (pathname === '/finance/deposit/fixed/wills/overview') return <FixedDepositTabs />;
    if (pathname === '/finance/deposit/fixed/wills/add-new') return <FixedDepositTabs />;
    if (WillDetailsRegex.test(pathname)) return <WillDetails />;

    if (pathname === '/finance/deposit/transit') return <TransitDepositLandingPage />;

    if (pathname === '/finance/deposit/transit/payments') navigate('/finance/deposit/transit/payments/overview');
    if (pathname === '/finance/deposit/transit/payments/overview') return <DepositPaymentsTabs />;
    if (pathname === '/finance/deposit/transit/payments/add-new') return <DepositPaymentsTabs />;
    if (DepositPaymentsDetailsRegex.test(pathname)) return <DepositPaymentDetails />;

    if (pathname === '/finance/deposit/transit/payment-orders')
      navigate('/finance/deposit/transit/payment-orders/overview');
    if (pathname === '/finance/deposit/transit/payment-orders/overview') return <DepositPaymentOrderTabs />;
    if (pathname === '/finance/deposit/transit/payment-orders/add-new') return <DepositPaymentOrderTabs />;
    if (DepositPaymentsOrderDetailsRegex.test(pathname)) return <DepositPaymentOrderDetails />;

    if (pathname === '/finance/deposit/transit/tax-contribution-calculation') return <DepositTaxesOverview />;

    if (pathname === '/finance/budget/current/non-financial') return <NonFinancialOverview />;
    if (nonFinanceDetails.test(pathname)) return <NonFinance />;

    if (pathname === '/finance/budget/current/spending-dynamics') return <SpendingDynamicsTabs />;
    if (pathname === '/finance/budget/current/requests') return <SpendingDynamicsTabs />;
    if (pathname === '/finance/budget/current/requests/add-new') return <AddNewBudgetDynamic />;
    if (currentBudgetDynamicDetails.test(pathname)) return <BudgetDynamicVersionPreview />;

    if (pathname === '/finance/budget/current/internal-reallocation') return <InternalReallocationOverview />;
    if (budgetReallocationRegex.test(pathname)) return <InternalReallocationBudget />;

    if (pathname === '/finance/budget/current/external-reallocation') return <ExternalReallocationOverview />;
    if (externalReallocationDetailsRegex.test(pathname)) return <ExternalReallocationDetails />;
    if (externalReallocationFinanceOfficialDetailsRegex.test(pathname))
      return <ExternalReallocationFinanceOfficialDetails />;

    if (pathname === '/finance/liabilities-receivables/liabilities/related-expenses')
      return <AdditionalExpensesOverview />;

    if (pathname === '/finance/liabilities-receivables/receivables') return <ReceivablesLandingPage />;
    if (pathname === '/finance/liabilities-receivables/receivables/payment-orders') return <ReceivablesOverview />;
    if (receiveRegex.test(pathname)) return <ReceivableEntry />;
    if (receiveEditRegex.test(pathname)) return <ReceivableDetails />;
    if (invoicesRegex.test(pathname)) return <Invoices />;
    if (invoiceEditRegex.test(pathname)) return <InvoiceDetails />;

    if (pathname === '/finance/liabilities-receivables/receivables/enforced-payments')
      return <EnforcedPaymentsOverview />;
    if (enforcedPaymentRegex.test(pathname)) return <EnforcedPaymentEntry />;
    if (enforcedPaymentEditRegex.test(pathname)) return <EnforcedPaymentsDetails />;

    if (budgetPreviewDetails.test(pathname)) return <NonFinancePreview />;
    if (pathname === '/finance/liabilities-receivables/liabilities/decisions') return <DecisionTabs />;
    if (pathname === '/finance/liabilities-receivables/liabilities/add-decision') return <DecisionTabs />;
    if (decisionsEditRegex.test(pathname)) return <DecisionsDetails />;

    if (pathname === '/finance/liabilities-receivables/liabilities/contracts') return <Contracts />;
    if (pathname === '/finance/liabilities-receivables/liabilities/add-contract') return <Contracts />;
    if (contractsEditRegex.test(pathname)) return <ContractsDetails />;

    if (salariesRegex.test(pathname)) return <Salaries />;
    if (salaryDetailsRegex.test(pathname)) return <SalaryDetails />;

    if (budgetFO.test(pathname)) return <BudgetFO />;

    // fines and taxes screen
    if (pathname === '/finance/fines-taxes') return <FinesAndTaxesLanding />;
    if (finesRegex.test(pathname)) return <Fines />;
    if (fineDetailsRegex.test(pathname)) return <FineDetails />;

    if (taxesRegex.test(pathname)) return <Taxes />;
    if (feeDetailsRegex.test(pathname)) return <FeeDetails />;

    if (confiscationRegex.test(pathname)) return <Confiscation />;
    if (confiscationDetailsRegex.test(pathname)) return <PropertyBenefitsConfiscationDetails />;

    if (flatRateRegex.test(pathname)) return <FlatRate />;
    if (flatRateDetailsRegex.test(pathname)) return <FlatRateDetails />;

    if (proceduralCostRegex.test(pathname)) return <ProceduralCosts />;
    if (proceduralCostDetailsRegex.test(pathname)) return <ProceduralCostDetails />;

    // if (useRoleCheck(role_id, [UserRole.MANAGER_OJ])) {
    if (fundReleaseRegex.test(pathname)) return <FundRelease />;
    if (pathname === '/finance/budget/current/fund-release/new-request') return <FundReleaseRequest />;
    if (fundReleaseDetailsRegex.test(pathname)) return <FundReleaseRequest />;
    if (useRoleCheck(role_id, [UserRole.ADMIN, UserRole.MANAGER_OJ])) {
      // }
      // add role specific routes here
      if (pathname === '/blablabla') return <div />;
    } else if (useRoleCheck(role_id, [UserRole.FINANCE_OFFICIAL])) {
      if (pathname === '/blablabla') return <div />;
    }

    return <NotFound404 />;
  };

  return renderScreen();
};
