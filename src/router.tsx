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
import BudgetDynamicVersionPreview from './screens/budget/spendingDynamics/budgetDynamicPreview/budgetDynamicVersion.tsx';
import AddNewBudgetDynamic from './screens/budget/spendingDynamics/addNewDynamic/addNewDynamic.tsx';
import BudgetRequestDetailsOfficial from './screens/budget/budgetRequestDetailsOfficial/budgetRequestDetailsOfficial.tsx';
import BudgetFillActual from './screens/budget/budgetFillActual/budgetFillActual.tsx';
import {ReceivablesLandingPage} from './screens/liabilitesAndReceivables/receivablesLandingPage/receivablesLandingPage.tsx';
import ExternalReallocationDetails from './screens/budget/externalReallocation/externalReallocationDetails.tsx';
import ExternalReallocationFinanceOfficialDetails from './screens/budget/externalReallocation/externalReallocationFinanceOfficialDetails.tsx';
import {NonFinance} from './screens/budget/nonFinance/nonFinance.tsx';
import FundRelease from './screens/budget/fundRelease/fundRelease.tsx';
import {checkActionRoutePermissions} from './services/checkRoutePermissions.ts';

//* OU - organization unit
//* SSS - judicial council official

export const fundReleaseDetailsRegex = /^\/finance\/budget\/current\/fund-release\/([1-9]|1[0-2])_(\d{4})$/;

export const Router = () => {
  const {
    navigation: {
      location: {pathname},
      navigate,
    },
    contextMain: {permissions},
  } = useAppContext();

  const readPermittedRoutes = checkActionRoutePermissions(permissions, 'read');
  const createPermittedRoutes = checkActionRoutePermissions(permissions, 'create');
  const updatePermittedRoutes = checkActionRoutePermissions(permissions, 'update');
  /*const deletePermittedRoutes = checkActionRoutePermissions(permissions, 'delete');
  console.log(
    'FINANCE routes - ',
    JSON.stringify(
      permissions
        .filter((permission: any) => permission?.route?.includes('/finance'))
        .map((permission: any) => permission.route)
        .sort(),
    ),
  );*/

  const renderScreen = () => {
    const path = pathname.split('/');
    const name = path[path.length - 1];

    // BUDGET RegEx
    const externalReallocationDetailsRegex = new RegExp('^/finance/budget/current/external-reallocation/\\d+$');
    const budgetReallocationRegex = new RegExp('^/finance/budget/current/internal-reallocation/(create|\\d+)$');
    const fundReleaseRegex = new RegExp('^/finance/budget/current/fund-release(?:/requests)?$');
    const currentBudgetDynamicDetails = new RegExp('/finance/budget/current/requests/\\d+$');
    const nonFinanceDetails = new RegExp('/finance/budget/current/non-financial/\\d+$');
    const budgetFO = new RegExp(`^/finance/budgetFO/\\d+(?:/${name})$`);
    const budgetPreviewDetails = new RegExp(`^/finance/budget/nonFinancePreview/${name}$`);
    const budgetRequestDetailsRegex = new RegExp(
      '^/finance/budget/planning/\\d+/requests/\\d+/(financial|non-financial|summary)$',
    );
    const fillActualBudgetRegex = new RegExp('^/finance/budget/planning/\\d+/requests/\\d+/actual$');
    const SSSBudgetDetailsRegex = /^\/finance\/budget\/planning\/(add-new|\d+)$/;
    const OUBudgetDetailsSummary = /^\/finance\/budget\/planning\/\d+\/(summary|financial|non-financial)$/;
    const sentBudgetDetails = new RegExp('/finance/budget/planning/([^/]+)/details');
    const sentBudgetRequests = new RegExp('/finance/budget/planning/([^/]+)/requests');
    const externalReallocationFinanceOfficialDetailsRegex = new RegExp('^/finance/budget/requests/\\d+$');
    // DEPOSIT RegEx
    const FinancialDepositDetailsRegex = /^\/finance\/deposit\/fixed\/financial\/\d+$/;
    const MaterialDepositDetailsRegex = /^\/finance\/deposit\/fixed\/material\/\d+$/;
    const WillDetailsRegex = /^\/finance\/deposit\/fixed\/wills\/\d+$/;
    const DepositPaymentsDetailsRegex = /^\/finance\/deposit\/transit\/payments\/\d+$/;
    const DepositPaymentsOrderDetailsRegex = /^\/finance\/deposit\/transit\/payment-orders\/\d+$/;
    // LIABILITIES RegEx
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
    // FINES RegEx
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

    if (pathname === '/finance') return <LandingPage />;
    // ACCOUNTING routes
    if (pathname === '/finance/accounting' && readPermittedRoutes.includes('/finance/accounting'))
      return <ACCOUNTING />;
    if (
      pathname === '/finance/accounting/obligations' &&
      readPermittedRoutes.includes('/finance/accounting/obligations')
    )
      return <CurrentAccountingTabs />;
    if (
      pathname === '/finance/accounting/obligations-overview' &&
      readPermittedRoutes.includes('/finance/accounting/obligations')
    )
      return <CurrentAccountingTabs />;
    if (
      pathname === '/finance/accounting/payment-orders' &&
      readPermittedRoutes.includes('/finance/accounting/payment-orders')
    )
      return <CurrentAccountingPaymentOrderTabs />;
    if (
      pathname === '/finance/accounting/payment-orders-overview' &&
      readPermittedRoutes.includes('/finance/accounting/payment-orders')
    )
      return <CurrentAccountingPaymentOrderTabs />;
    if (
      pathname === '/finance/accounting/enforced-payments' &&
      readPermittedRoutes.includes('/finance/accounting/enforced-payments')
    )
      return <CurrentAccountingEnforcedPaymentOrderTabs />;
    if (
      pathname === '/finance/accounting/enforced-payments-overview' &&
      readPermittedRoutes.includes('/finance/accounting/enforced-payments')
    )
      return <CurrentAccountingEnforcedPaymentOrderTabs />;
    if (
      pathname === '/finance/accounting/returned-enforced-payments' &&
      readPermittedRoutes.includes('/finance/accounting/returned-enforced-payments')
    )
      return <CurrentReturnedEnforcedPaymentsForAccountingTabs />;
    if (
      pathname === '/finance/accounting/returned-enforced-payments-overview' &&
      readPermittedRoutes.includes('/finance/accounting/returned-enforced-payments')
    )
      return <CurrentReturnedEnforcedPaymentsForAccountingTabs />;
    // BUDGET routes
    if (pathname === '/finance/budget' && readPermittedRoutes.includes('/finance/budget')) return <BUDGET />;
    if (pathname === '/finance/budget-template' && readPermittedRoutes.includes('/finance/budget'))
      return <BudgetTemplate />;
    if (pathname === '/finance/budget/current' && readPermittedRoutes.includes('/finance/budget/current'))
      return <CurrentBudgetTabs />;
    if (pathname === '/finance/budget/requests' && createPermittedRoutes.includes('/finance/budget/current'))
      return <CurrentBudgetTabs />;
    if (
      pathname === '/finance/budget/current/fund-release/new-request' &&
      updatePermittedRoutes.includes('/finance/budget/current/fund-release')
    )
      return <FundReleaseRequest />;
    if (fundReleaseDetailsRegex.test(pathname) && readPermittedRoutes.includes('/finance/budget/current/fund-release'))
      return <FundReleaseRequest />;
    if (
      pathname === '/finance/budget/current/internal-reallocation' &&
      readPermittedRoutes.includes('/finance/budget/current/internal-reallocation')
    )
      return <InternalReallocationOverview />;
    if (
      budgetReallocationRegex.test(pathname) &&
      readPermittedRoutes.includes('/finance/budget/current/internal-reallocation') &&
      (!pathname.includes('create') || updatePermittedRoutes.includes('/finance/budget/current/internal-reallocation'))
    )
      return <InternalReallocationBudget />;
    if (
      pathname === '/finance/budget/current/external-reallocation' &&
      readPermittedRoutes.includes('/finance/budget/current/external-reallocation') &&
      (!pathname.includes('create') || updatePermittedRoutes.includes('/finance/budget/current/external-reallocation'))
    )
      return <ExternalReallocationOverview />;
    if (
      externalReallocationDetailsRegex.test(pathname) &&
      readPermittedRoutes.includes('/finance/budget/current/external-reallocation')
    )
      return <ExternalReallocationDetails />;
    if (
      externalReallocationFinanceOfficialDetailsRegex.test(pathname) &&
      (updatePermittedRoutes.includes('/finance/budget/current/external-reallocation') ||
        createPermittedRoutes.includes('/finance/budget/current/external-reallocation'))
    )
      return <ExternalReallocationFinanceOfficialDetails />;
    if (
      pathname === '/finance/budget/current/non-financial' &&
      readPermittedRoutes.includes('/finance/budget/current/non-financial')
    )
      return <NonFinancialOverview />;
    if (budgetPreviewDetails.test(pathname) && readPermittedRoutes.includes('/finance/budget/current/non-financial'))
      return <NonFinancePreview />;
    if (
      pathname === '/finance/budget/current/requests' &&
      readPermittedRoutes.includes('/finance/budget/current/spending-dynamics')
    )
      return <SpendingDynamicsTabs />;
    if (
      pathname === '/finance/budget/current/requests/add-new' &&
      updatePermittedRoutes.includes('/finance/budget/current/spending-dynamics')
    )
      return <AddNewBudgetDynamic />;
    if (
      pathname === '/finance/budget/current/spending-dynamics' &&
      readPermittedRoutes.includes('/finance/budget/current/spending-dynamics')
    )
      return <SpendingDynamicsTabs />;
    if (pathname === '/finance/budget/planning' && readPermittedRoutes.includes('/finance/budget/planning'))
      return <BudgetList />;
    if (budgetRequestDetailsRegex.test(pathname) && createPermittedRoutes.includes('/finance/budget/planning'))
      return <BudgetRequestDetailsOfficial />;
    if (
      currentBudgetDynamicDetails.test(pathname) &&
      readPermittedRoutes.includes('/finance/budget/current/spending-dynamics')
    )
      return <BudgetDynamicVersionPreview />;
    if (fillActualBudgetRegex.test(pathname) && createPermittedRoutes.includes('/finance/budget/planning'))
      return <BudgetFillActual />;
    if (OUBudgetDetailsSummary.test(pathname) && readPermittedRoutes.includes('/finance/budget/planning'))
      return <OUBudgetSubmission />;
    if (sentBudgetDetails.test(pathname) && updatePermittedRoutes.includes('/finance/budget/planning'))
      return <BudgetSendTabs />;
    if (sentBudgetRequests.test(pathname) && updatePermittedRoutes.includes('/finance/budget/planning'))
      return <BudgetSendTabs />;
    if (SSSBudgetDetailsRegex.test(pathname) && createPermittedRoutes.includes('/finance/budget/planning'))
      return <SSSBudgetDetails />;
    if (budgetFO.test(pathname) && createPermittedRoutes.includes('/finance/budget/planning')) return <BudgetFO />;
    if (fundReleaseRegex.test(pathname) && readPermittedRoutes.includes('/finance/budget/current/fund-release'))
      return <FundRelease />;
    if (nonFinanceDetails.test(pathname) && readPermittedRoutes.includes('/finance/budget/current/non-financial'))
      return <NonFinance />;
    // DEPOSIT routes
    if (pathname === '/finance/deposit' && readPermittedRoutes.includes('/finance/deposit'))
      return <DepositLandingPage />;
    if (pathname === '/finance/deposit/fixed' && readPermittedRoutes.includes('/finance/deposit/fixed'))
      return <FixedDepositLandingPage />;
    if (
      pathname === '/finance/deposit/fixed/financial' &&
      readPermittedRoutes.includes('/finance/deposit/fixed/financial')
    )
      navigate('/finance/deposit/fixed/financial/overview');
    if (
      pathname === '/finance/deposit/fixed/financial/add-new' &&
      updatePermittedRoutes.includes('/finance/deposit/fixed/financial')
    ) {
      return <FixedDepositTabs />;
    }
    if (
      pathname === '/finance/deposit/fixed/financial/overview' &&
      readPermittedRoutes.includes('/finance/deposit/fixed/financial')
    )
      return <FixedDepositTabs />;
    if (
      pathname === '/finance/deposit/fixed/material' &&
      readPermittedRoutes.includes('/finance/deposit/fixed/material')
    )
      navigate('/finance/deposit/fixed/material/overview');
    if (
      pathname === '/finance/deposit/fixed/material/add-new' &&
      updatePermittedRoutes.includes('/finance/deposit/fixed/material')
    )
      return <FixedDepositTabs />;
    if (
      pathname === '/finance/deposit/fixed/material/overview' &&
      readPermittedRoutes.includes('/finance/deposit/fixed/material')
    )
      return <FixedDepositTabs />;
    if (pathname === '/finance/deposit/fixed/wills' && readPermittedRoutes.includes('/finance/deposit/fixed/wills'))
      navigate('/finance/deposit/fixed/wills/overview');
    if (
      pathname === '/finance/deposit/fixed/wills/add-new' &&
      updatePermittedRoutes.includes('/finance/deposit/fixed/wills')
    )
      return <FixedDepositTabs />;
    if (
      pathname === '/finance/deposit/fixed/wills/overview' &&
      readPermittedRoutes.includes('/finance/deposit/fixed/wills')
    )
      return <FixedDepositTabs />;
    if (pathname === '/finance/deposit/transit' && readPermittedRoutes.includes('/finance/deposit/transit'))
      return <TransitDepositLandingPage />;
    if (
      pathname === '/finance/deposit/transit/payments' &&
      readPermittedRoutes.includes('/finance/deposit/transit/payments')
    )
      navigate('/finance/deposit/transit/payments/overview');
    if (
      pathname === '/finance/deposit/transit/payments/add-new' &&
      updatePermittedRoutes.includes('/finance/deposit/transit/payments')
    )
      return <DepositPaymentsTabs />;
    if (
      pathname === '/finance/deposit/transit/payments/overview' &&
      readPermittedRoutes.includes('/finance/deposit/transit/payments')
    )
      return <DepositPaymentsTabs />;
    if (
      pathname === '/finance/deposit/transit/payment-orders' &&
      readPermittedRoutes.includes('/finance/deposit/transit/payment-orders')
    )
      navigate('/finance/deposit/transit/payment-orders/overview');
    if (
      pathname === '/finance/deposit/transit/payment-orders/add-new' &&
      updatePermittedRoutes.includes('/finance/deposit/transit/payment-orders')
    )
      return <DepositPaymentOrderTabs />;
    if (
      pathname === '/finance/deposit/transit/payment-orders/overview' &&
      readPermittedRoutes.includes('/finance/deposit/transit/payment-orders')
    )
      return <DepositPaymentOrderTabs />;
    if (
      pathname === '/finance/deposit/transit/tax-contribution-calculation' &&
      readPermittedRoutes.includes('/finance/deposit/transit/tax-contribution-calculation')
    )
      return <DepositTaxesOverview />;
    if (DepositPaymentsDetailsRegex.test(pathname) && readPermittedRoutes.includes('/finance/deposit/transit/payments'))
      return <DepositPaymentDetails />;
    if (
      DepositPaymentsOrderDetailsRegex.test(pathname) &&
      readPermittedRoutes.includes('/finance/deposit/transit/payment-orders')
    )
      return <DepositPaymentOrderDetails />;
    if (FinancialDepositDetailsRegex.test(pathname) && readPermittedRoutes.includes('/finance/deposit/fixed/financial'))
      return <FinanceDepositDetails />;
    if (MaterialDepositDetailsRegex.test(pathname) && readPermittedRoutes.includes('/finance/deposit/fixed/material'))
      return <MaterialDepositDetails />;
    if (WillDetailsRegex.test(pathname) && readPermittedRoutes.includes('/finance/deposit/fixed/wills'))
      return <WillDetails />;
    // LIABILITIES routes
    if (
      pathname === '/finance/liabilities-receivables' &&
      readPermittedRoutes.includes('/finance/liabilities-receivables')
    )
      return <LiabilitiesReceivablesLandingPage />;
    if (
      pathname === '/finance/liabilities-receivables/liabilities' &&
      readPermittedRoutes.includes('/finance/liabilities-receivables/liabilities')
    )
      return <LiabilitiesLandingPage />;
    if (
      pathname === '/finance/liabilities-receivables/liabilities/contracts' &&
      readPermittedRoutes.includes('/finance/liabilities-receivables/liabilities/contracts')
    )
      return <Contracts />;
    if (
      pathname === '/finance/liabilities-receivables/liabilities/add-contract' &&
      createPermittedRoutes.includes('/finance/liabilities-receivables/liabilities/contracts')
    )
      return <Contracts />;
    if (
      pathname === '/finance/liabilities-receivables/liabilities/decisions' &&
      readPermittedRoutes.includes('/finance/liabilities-receivables/liabilities/decisions')
    )
      return <DecisionTabs />;
    if (
      pathname === '/finance/liabilities-receivables/liabilities/add-decision' &&
      createPermittedRoutes.includes('/finance/liabilities-receivables/liabilities/decisions')
    )
      return <DecisionTabs />;
    if (
      pathname === '/finance/liabilities-receivables/liabilities/related-expenses' &&
      readPermittedRoutes.includes('/finance/liabilities-receivables/liabilities/related-expenses')
    )
      return <AdditionalExpensesOverview />;
    if (
      pathname === '/finance/liabilities-receivables/receivables' &&
      readPermittedRoutes.includes('/finance/liabilities-receivables/receivables')
    )
      return <ReceivablesLandingPage />;
    if (
      pathname === '/finance/liabilities-receivables/receivables/payment-orders' &&
      readPermittedRoutes.includes('/finance/liabilities-receivables/receivables/payment-orders')
    )
      return <ReceivablesOverview />;
    if (
      pathname === '/finance/liabilities-receivables/receivables/enforced-payments' &&
      readPermittedRoutes.includes('/finance/liabilities-receivables/receivables/enforced-payments')
    )
      return <EnforcedPaymentsOverview />;
    if (invoiceEditRegex.test(pathname)) return <InvoiceDetails />;
    if (decisionsEditRegex.test(pathname)) return <DecisionsDetails />;
    if (contractsEditRegex.test(pathname)) return <ContractsDetails />;
    if (salaryDetailsRegex.test(pathname)) return <SalaryDetails />;
    if (salariesRegex.test(pathname)) return <Salaries />;
    if (
      invoicesRegex.test(pathname) &&
      readPermittedRoutes.includes('/finance/liabilities-receivables/liabilities/invoices')
    ) {
      if (
        !pathname.includes('add-invoice') ||
        createPermittedRoutes.includes('/finance/liabilities-receivables/liabilities/invoices')
      ) {
        return <Invoices />;
      }
    }
    if (
      receiveEditRegex.test(pathname) &&
      readPermittedRoutes.includes('/finance/liabilities-receivables/receivables/payment-orders')
    )
      return <ReceivableDetails />;
    if (
      receiveRegex.test(pathname) &&
      readPermittedRoutes.includes('/finance/liabilities-receivables/receivables/payment-orders')
    ) {
      if (
        !pathname.includes('add-receivable') ||
        createPermittedRoutes.includes('/finance/liabilities-receivables/receivables/payment-orders')
      ) {
        return <ReceivableEntry />;
      }
    }
    if (
      enforcedPaymentRegex.test(pathname) &&
      readPermittedRoutes.includes('/finance/liabilities-receivables/receivables/enforced-payments')
    ) {
      if (
        !pathname.includes('add-enforced-payment') ||
        createPermittedRoutes.includes('/finance/liabilities-receivables/receivables/enforced-payments')
      ) {
        return <EnforcedPaymentEntry />;
      }
    }
    if (
      enforcedPaymentEditRegex.test(pathname) &&
      updatePermittedRoutes.includes('/finance/liabilities-receivables/receivables/enforced-payments')
    )
      return <EnforcedPaymentsDetails />;
    // REPORTS routes
    if (pathname === '/finance/reports' && readPermittedRoutes.includes('/finance/reports'))
      return <AccountingReports />;
    // TAXES routes
    if (pathname === '/finance/fines-taxes' && readPermittedRoutes.includes('/finance/fines-taxes'))
      return <FinesAndTaxesLanding />;
    if (taxesRegex.test(pathname) && readPermittedRoutes.includes('/finance/fines-taxes/taxes')) {
      if (!pathname.includes('add-taxes') || createPermittedRoutes.includes('/finance/fines-taxes/taxes')) {
        return <Taxes />;
      }
    }
    if (finesRegex.test(pathname) && readPermittedRoutes.includes('/finance/fines-taxes/fines')) {
      if (!pathname.includes('add-new') || createPermittedRoutes.includes('/finance/fines-taxes/fines')) {
        return <Fines />;
      }
    }
    if (confiscationRegex.test(pathname) && readPermittedRoutes.includes('/finance/fines-taxes/confiscation')) {
      if (
        !pathname.includes('add-confiscation') ||
        createPermittedRoutes.includes('/finance/fines-taxes/confiscation')
      ) {
        return <Confiscation />;
      }
    }
    if (flatRateRegex.test(pathname) && readPermittedRoutes.includes('/finance/fines-taxes/flat-rate')) {
      if (!pathname.includes('add-flat-rate') || createPermittedRoutes.includes('/finance/fines-taxes/flat-rate')) {
        return <FlatRate />;
      }
    }
    if (proceduralCostRegex.test(pathname) && readPermittedRoutes.includes('/finance/fines-taxes/procedural-costs')) {
      if (
        !pathname.includes('add-procedural-costs') ||
        createPermittedRoutes.includes('/finance/fines-taxes/procedural-costs')
      ) {
        return <ProceduralCosts />;
      }
    }
    if (feeDetailsRegex.test(pathname)) return <FeeDetails />;
    if (fineDetailsRegex.test(pathname)) return <FineDetails />;
    if (proceduralCostDetailsRegex.test(pathname)) return <ProceduralCostDetails />;
    if (confiscationDetailsRegex.test(pathname)) return <PropertyBenefitsConfiscationDetails />;
    if (flatRateDetailsRegex.test(pathname)) return <FlatRateDetails />;

    return <NotFound404 />;
  };

  return renderScreen();
};
