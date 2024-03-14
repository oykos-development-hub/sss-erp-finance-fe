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
import SSSBudgetDetails from './screens/budget/planning/SSSBudgetDetails/SSSBudgetDetails.tsx';
import BudgetList from './screens/budget/planning/budgetList/budgetList.tsx';
import RequestDynamics from './screens/budget/spendingDynamics/requestDynamics.tsx';
import {SpendingDynamicsTabs} from './screens/budget/spendingDynamics/spendingDynamicsTabs.tsx';
import {InitialStateTabs} from './screens/deposit/demandDeposit/initialState/initialStateTabs.tsx';
import TaxContributionCalculationOverview from './screens/deposit/demandDeposit/taxContributionCalculation/taxContributionCalculationOverview.tsx';
import {FinanceDepositTabs} from './screens/deposit/fixedDeposit/financeDeposit/financeDepositTabs.tsx';
import {MaterialDepositTabs} from './screens/deposit/fixedDeposit/materialDeposit/materialDepositTabs.tsx';
import {TestamentTabs} from './screens/deposit/fixedDeposit/testament/testamentTabs.tsx';
import {DemandDepositLandingPage} from './screens/deposit/landingPages/demandDepositLandingPage.tsx';
import {DepositLandingPage} from './screens/deposit/landingPages/depositLandingPage.tsx';
import {FixedDepositLandingPage} from './screens/deposit/landingPages/fixedDepositLandingPage.tsx';
import Confiscation from './screens/finesAndTaxes/confiscation/confiscation.tsx';
import Fines from './screens/finesAndTaxes/fines/fines.tsx';
import FlatRate from './screens/finesAndTaxes/flatRate/flatRate.tsx';
import {LandingPage as FinesAndTaxesLanding} from './screens/finesAndTaxes/landingPage.tsx';
import ProceduralCosts from './screens/finesAndTaxes/proceduralCosts/proceduralCosts.tsx';
import Taxes from './screens/finesAndTaxes/taxes/taxes.tsx';
import {LandingPage} from './screens/landingPage/landingPage.tsx';
import Contracts from './screens/liabilitesAndReceivables/contracts/contracts.tsx';
import Decisions from './screens/liabilitesAndReceivables/decisions/decisions.tsx';
import Invoices from './screens/liabilitesAndReceivables/invoices/invoices.tsx';
import Salaries from './screens/liabilitesAndReceivables/salaries/salaries.tsx';

export const Router = () => {
  const {
    navigation: {
      location: {pathname},
    },
    contextMain: {role_id},
  } = useAppContext();

  const renderScreen = () => {
    const path = pathname.split('/');
    const name = path[path.length - 1];

    const SSSBudgetDetailsRegex = /^\/finance\/budget\/planning\/(add-new|\d+)$/;

    // const budgetDetails = new RegExp(`^/finance/budget/\\d+/${name}$`);
    const invoicesRegex = new RegExp('^/finance/liabilities-receivables/liabilities/invoices(?:/add-invoice)?$');
    const decisionsRegex = new RegExp('^/finance/liabilities-receivables/liabilities/decisions(?:/add-decision)?$');
    const contractsRegex = new RegExp('^/finance/liabilities-receivables/liabilities/contracts(?:/add-contract)?$');
    const salariesRegex = new RegExp('^/finance/liabilities-receivables/liabilities/salaries(?:/add-salary)?$');
    const finesRegex = new RegExp('^/finance/fines-taxes/fines(?:/add-fines)?$');
    const taxesRegex = new RegExp('^/finance/fines-taxes/taxes(?:/add-taxes)?$');
    const confiscationRegex = new RegExp('^/finance/fines-taxes/confiscation(?:/add-confiscation)?$');
    const flatRateRegex = new RegExp('^/finance/fines-taxes/flat-rate(?:/add-flat-rate)?$');
    const proceduralCostRegex = new RegExp('^/finance/fines-taxes/procedural-costs(?:/add-procedural-costs)?$');
    const budgetPreviewDetails = new RegExp(`^/finance/budget/nonFinancePreview/${name}$`);
    const budgetFO = new RegExp(`^/finance/budgetFO/\\d+(?:/${name})$`);
    const sentBudgetDetails = new RegExp('/finance/budget/planning/([^/]+)/details');
    const sentBudgetRequests = new RegExp('/finance/budget/planning/([^/]+)/requests');

    //todo: check if this is actually the role SSS will use here
    if (role_id === UserRole.ADMIN) {
      console.log(SSSBudgetDetailsRegex.test(pathname), pathname, 'regex');
      if (SSSBudgetDetailsRegex.test(pathname)) return <SSSBudgetDetails />;
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

    if (pathname === '/finance/deposit/fixed/finance') return <FinanceDepositTabs />;
    if (pathname === '/finance/deposit/fixed/new-entry') return <FinanceDepositTabs />;

    if (pathname === '/finance/deposit/fixed/material') return <MaterialDepositTabs />;
    if (pathname === '/finance/deposit/fixed/new-material-entry') return <MaterialDepositTabs />;

    if (pathname === '/finance/deposit/fixed/will') return <TestamentTabs />;
    if (pathname === '/finance/deposit/fixed/new-testament-entry') return <TestamentTabs />;

    if (pathname === '/finance/deposit/demand') return <DemandDepositLandingPage />;

    if (pathname === '/finance/deposit/demand/initial-state') return <InitialStateTabs />;
    if (pathname === '/finance/deposit/demand/initial-state-new-entry') return <InitialStateTabs />;

    if (pathname === '/finance/budget/current/non-financial') return <NonFinancialOverview />;

    if (pathname === '/finance/budget/current/spending-dynamics') return <SpendingDynamicsTabs />;
    if (pathname === '/finance/budget/current/requests') return <SpendingDynamicsTabs />;
    if (pathname === '/finance/budget/current/requests-dynamics') return <RequestDynamics />;

    if (pathname === '/finance/budget/current/internal-reallocation') return <InternalReallocationOverview />;
    if (pathname === '/finance/budget/current/internal-reallocation/create') return <InternalReallocationBudget />;

    if (pathname === '/finance/budget/current/external-reallocation') return <ExternalReallocationOverview />;

    if (pathname === '/finance/deposit/demand/tax-contribution-calculation')
      return <TaxContributionCalculationOverview />;

    // if (budgetDetails.test(pathname)) return <BudgetDetails />;

    if (invoicesRegex.test(pathname)) return <Invoices />;
    if (budgetPreviewDetails.test(pathname)) return <NonFinancePreview />;
    if (decisionsRegex.test(pathname)) return <Decisions />;
    if (contractsRegex.test(pathname)) return <Contracts />;
    if (salariesRegex.test(pathname)) return <Salaries />;
    if (budgetFO.test(pathname)) return <BudgetFO />;

    if (pathname === '/finance/deposit/demand/initial-state-new-entry') return <InitialStateTabs />;
    // fines and taxes screen
    if (pathname === '/finance/fines-taxes') return <FinesAndTaxesLanding />;
    if (finesRegex.test(pathname)) return <Fines />;
    if (taxesRegex.test(pathname)) return <Taxes />;
    if (confiscationRegex.test(pathname)) return <Confiscation />;
    if (flatRateRegex.test(pathname)) return <FlatRate />;
    if (proceduralCostRegex.test(pathname)) return <ProceduralCosts />;

    if (role_id === UserRole.MANAGER_OJ) {
      if (pathname === '/finance/budget/current/fund-release') return <FundReleaseOverview />;
      if (pathname === '/finance/budget/current/fund-release/new-request') return <FundReleaseRequest />;
    }
    if (role_id === UserRole.ADMIN || role_id === UserRole.MANAGER_OJ) {
      // add role specific routes here
      if (pathname === '/blablabla') return <div />;
    } else if (role_id === UserRole.OFFICIAL_FOR_FINANCE) {
      if (pathname === '/blablabla') return <div />;
    }

    return <NotFound404 />;
  };

  return renderScreen();
};
