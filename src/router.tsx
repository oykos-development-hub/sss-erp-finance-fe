import {UserRole} from './constants.ts';
import useAppContext from './context/useAppContext.ts';
import {NotFound404} from './screens/404';
import {CurrentAccountingTabs} from './screens/accounting/currentAccountingTabs.tsx';
import BudgetFO from './screens/budget/budgetFO/budgetFO.tsx';
import {BudgetSendTabs} from './screens/budget/budgetSendDetails/budgetSendTabs.tsx';
import BudgetTemplate from './screens/budget/budgetTemplate/budgetTemplate.tsx';
import {CurrentBudgetTabs} from './screens/budget/currentBudget/currentBudgetTabs.tsx';
import ExternalReallocationOverview from './screens/budget/externalReallocation/externalReallocationOverview.tsx';
import FundReleaseOverview from './screens/budget/fundRelease/fundReleaseOverview.tsx';
import FundReleaseRequest from './screens/budget/fundRelease/fundReleaseRequest.tsx';
import InternalReallocationBudget from './screens/budget/internalReallocation/internalReallocationBudgetTemplate.tsx';
import InternalReallocationOverview from './screens/budget/internalReallocation/internalReallocationOverview.tsx';
import BUDGET from './screens/budget/landingPage.tsx';
import NonFinancePreview from './screens/budget/nonFinancePreview/nonFinancePreview.tsx';
import NonFinancialOverview from './screens/budget/nonFinancialOverview/nonFinancialOverview.tsx';
import OUBudgetSubmission from './screens/budget/planning/OUBudgetSubmission/OUBudgetSubmission.tsx';
import SSSBudgetDetails from './screens/budget/planning/SSSBudgetDetails/SSSBudgetDetails.tsx';
import BudgetList from './screens/budget/planning/budgetList/budgetList.tsx';
import RequestDynamics from './screens/budget/spendingDynamics/requestDynamics.tsx';
import {SpendingDynamicsTabs} from './screens/budget/spendingDynamics/spendingDynamicsTabs.tsx';
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
import Contracts from './screens/liabilitesAndReceivables/contracts/contracts.tsx';
import ContractsDetails from './screens/liabilitesAndReceivables/contracts/contractsDetails/contractsDetails.tsx';
import Decisions from './screens/liabilitesAndReceivables/decisions/decisions.tsx';
import DecisionsDetails from './screens/liabilitesAndReceivables/decisions/decisionsDetails/decisionsDetails.tsx';
import InvoiceDetails from './screens/liabilitesAndReceivables/invoices/invoiceDetails/invoiceDetails.tsx';
import Invoices from './screens/liabilitesAndReceivables/invoices/invoices.tsx';
import ReceivableDetails from './screens/liabilitesAndReceivables/receivables/receivableDetails/receivableDetails.tsx';
import ReceivableEntry from './screens/liabilitesAndReceivables/receivables/receivableEntry/receivableEntry.tsx';
import ReceivablesOverview from './screens/liabilitesAndReceivables/receivables/receivablesOverview/receivablesOverview.tsx';
import Salaries from './screens/liabilitesAndReceivables/salaries/salaries.tsx';
import SalaryDetails from './screens/liabilitesAndReceivables/salaries/salaryDetails/salaryDetails.tsx';
import {LiabilitiesLandingPage} from './screens/liabilitesAndReceivables/liabilitiesLanding/liabilitiesLandingPage.tsx';
import {LiabilitiesReceivablesLandingPage} from './screens/liabilitesAndReceivables/liabilitiesReceivablesLandingPage.tsx';
import {useRoleCheck} from './utils/useRoleCheck.ts';
import EnforcedPaymentsOverview from './screens/liabilitesAndReceivables/enforcedPayments/enforcedPaymentsOverview/enforcedPaymentsOverview.tsx';
import EnforcedPaymentEntry from './screens/liabilitesAndReceivables/enforcedPayments/enforcedPaymentsEntry/enforcedPaymentEntry.tsx';
import EnforcedPaymentsDetails from './screens/liabilitesAndReceivables/enforcedPayments/enforcedPaymentsDetails/enforcedPaymentsDetails.tsx';

//* OU - organization unit
//* SSS - judicial council official

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
    const decisionsRegex = new RegExp('^/finance/liabilities-receivables/liabilities/decisions(?:/add-decision)?$');
    const decisionsEditRegex = new RegExp('^/finance/liabilities-receivables/liabilities/decisions/\\d+$');
    const contractsRegex = new RegExp('^/finance/liabilities-receivables/liabilities/contracts(?:/add-contract)?$');
    const contractsEditRegex = new RegExp('^/finance/liabilities-receivables/liabilities/contracts/\\d+$');
    const receiveRegex = new RegExp('^/finance/liabilities-receivables/receivables(?:/add-receivable)?$');
    const receiveEditRegex = new RegExp('^/finance/liabilities-receivables/receivables/\\d+$');
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
    const budgetPreviewDetails = new RegExp(`^/finance/budget/nonFinancePreview/${name}$`);
    const budgetFO = new RegExp(`^/finance/budgetFO/\\d+(?:/${name})$`);
    const sentBudgetDetails = new RegExp('/finance/budget/planning/([^/]+)/details');
    const sentBudgetRequests = new RegExp('/finance/budget/planning/([^/]+)/requests');

    //todo: check if this is actually the role SSS will use here
    if (useRoleCheck(role_id, [UserRole.ADMIN, UserRole.FINANCE_OFFICIAL])) {
      if (SSSBudgetDetailsRegex.test(pathname)) return <SSSBudgetDetails />;
    }

    if (useRoleCheck(role_id, [UserRole.MANAGER_OJ])) {
      if (OUBudgetDetailsSummary.test(pathname)) return <OUBudgetSubmission />;
    }

    if (pathname === '/finance') return <LandingPage />;
    if (pathname === '/finance/budget') return <BUDGET />;
    if (pathname === '/finance/budget/planning') return <BudgetList />;
    if (pathname === '/finance/budget-template') return <BudgetTemplate />;
    if (pathname === '/finance/budget/current') return <CurrentBudgetTabs />;
    if (pathname === '/finance/budget/requests') return <CurrentBudgetTabs />;
    if (sentBudgetDetails.test(pathname)) return <BudgetSendTabs />;
    if (sentBudgetRequests.test(pathname)) return <BudgetSendTabs />;

    if (pathname === '/finance/accounting') return <CurrentAccountingTabs />;
    if (pathname === '/finance/accounting-overview') return <CurrentAccountingTabs />;

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

    if (pathname === '/finance/budget/current/spending-dynamics') return <SpendingDynamicsTabs />;
    if (pathname === '/finance/budget/current/requests') return <SpendingDynamicsTabs />;
    if (pathname === '/finance/budget/current/requests-dynamics') return <RequestDynamics />;

    if (pathname === '/finance/budget/current/internal-reallocation') return <InternalReallocationOverview />;
    if (pathname === '/finance/budget/current/internal-reallocation/create') return <InternalReallocationBudget />;

    if (pathname === '/finance/budget/current/external-reallocation') return <ExternalReallocationOverview />;

    if (pathname === '/finance/liabilities-receivables/liabilities/related-expenses')
      return <AdditionalExpensesOverview />;

    // if (budgetDetails.test(pathname)) return <BudgetDetails />;

    if (pathname === '/finance/liabilities-receivables/receivables') return <ReceivablesOverview />;
    if (receiveRegex.test(pathname)) return <ReceivableEntry />;
    if (receiveEditRegex.test(pathname)) return <ReceivableDetails />;
    if (invoicesRegex.test(pathname)) return <Invoices />;
    if (invoiceEditRegex.test(pathname)) return <InvoiceDetails />;

    if (pathname === '/finance/liabilities-receivables/receivables/enforced-payments')
      return <EnforcedPaymentsOverview />;
    if (enforcedPaymentRegex.test(pathname)) return <EnforcedPaymentEntry />;
    if (enforcedPaymentEditRegex.test(pathname)) return <EnforcedPaymentsDetails />;

    if (budgetPreviewDetails.test(pathname)) return <NonFinancePreview />;
    if (decisionsRegex.test(pathname)) return <Decisions />;
    if (decisionsEditRegex.test(pathname)) return <DecisionsDetails />;

    if (contractsRegex.test(pathname)) return <Contracts />;
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

    if (useRoleCheck(role_id, [UserRole.MANAGER_OJ])) {
      if (pathname === '/finance/budget/current/fund-release') return <FundReleaseOverview />;
      if (pathname === '/finance/budget/current/fund-release/new-request') return <FundReleaseRequest />;
    }
    if (useRoleCheck(role_id, [UserRole.ADMIN, UserRole.MANAGER_OJ])) {
      // add role specific routes here
      if (pathname === '/blablabla') return <div />;
    } else if (useRoleCheck(role_id, [UserRole.FINANCE_OFFICIAL])) {
      if (pathname === '/blablabla') return <div />;
    }

    return <NotFound404 />;
  };

  return renderScreen();
};
