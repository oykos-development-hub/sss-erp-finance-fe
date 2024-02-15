import {UserRole} from './constants.ts';
import useAppContext from './context/useAppContext.ts';
import {NotFound404} from './screens/404';
import {CurrentAccountingTabs} from './screens/accounting/currentAccountingTabs.tsx';
import BudgetCreate from './screens/budget/budgetCreate/budgetCreate.tsx';
import BudgetDetails from './screens/budget/budgetDetails/budgetDetails.tsx';
import BudgetFO from './screens/budget/budgetFO/budgetFO.tsx';
import BudgetOverview from './screens/budget/budgetOverview/budgetOverview';
import BudgetTemplate from './screens/budget/budgetTemplate/budgetTemplate.tsx';
import {CurrentBudgetTabs} from './screens/budget/currentBudget/currentBudgetTabs.tsx';
import BUDGET from './screens/budget/landingPage.tsx';
import {NonFinance} from './screens/budget/nonFinance/nonFinance.tsx';
import NonFinancePreview from './screens/budget/nonFinancePreview/nonFinancePreview.tsx';
import {FinanceDepositTabs} from './screens/deposit/fixedDeposit/financeDeposit/financeDepositTabs.tsx';
import Contracts from './screens/liabilitesAndReceivables/contracts/contracts.tsx';
import Decisions from './screens/liabilitesAndReceivables/decisions/decisions.tsx';
import Invoices from './screens/liabilitesAndReceivables/invoices/invoices.tsx';
import Salaries from './screens/liabilitesAndReceivables/salaries/salaries.tsx';
import {LandingPage as FinesAndTaxesLanding} from './screens/finesAndTaxes/landingPage.tsx';
import {LandingPage} from './screens/landingPage/landingPage.tsx';
import {MaterialDepositTabs} from './screens/deposit/fixedDeposit/materialDeposit/materialDepositTabs.tsx';
import {TestamentTabs} from './screens/deposit/fixedDeposit/testament/testamentTabs.tsx';
import Fines from './screens/finesAndTaxes/fines/fines.tsx';

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

    const budgetDetails = new RegExp(`^/finance/budget/\\d+/${name}$`);
    const invoicesRegex = new RegExp('^/finance/liabilities-receivables/liabilities/invoices(?:/add-invoice)?$');
    const decisionsRegex = new RegExp('^/finance/liabilities-receivables/liabilities/decisions(?:/add-decision)?$');
    const contractsRegex = new RegExp('^/finance/liabilities-receivables/liabilities/contracts(?:/add-contract)?$');
    const salariesRegex = new RegExp('^/finance/liabilities-receivables/liabilities/salaries(?:/add-salary)?$');
    const finesRegex = new RegExp('^/finance/fines-taxes/fines(?:/add-fines)?$');
    const budgetCreateRegex = /\/finance\/(\d+)\/budget-create-(\d{4})/;
    const budgetPreviewDetails = new RegExp(`^/finance/budget/nonFinancePreview/${name}$`);
    const budgetFO = new RegExp(`^/finance/budgetFO/\\d+(?:/${name})$`);

    if (pathname === '/finance') return <LandingPage />;
    if (pathname === '/finance/budget') return <BUDGET />;
    if (pathname === '/finance/budget/planning') return <BudgetOverview />;
    if (pathname === '/finance/budget-template') return <BudgetTemplate />;
    if (pathname === '/finance/budget/nonFinance') return <NonFinance />;
    if (pathname === '/finance/budget/current') return <CurrentBudgetTabs />;
    if (pathname === '/finance/budget/requests') return <CurrentBudgetTabs />;

    if (pathname === '/finance/accounting') return <CurrentAccountingTabs />;
    if (pathname === '/finance/accounting-overview') return <CurrentAccountingTabs />;

    if (pathname === '/finance/deposit/fixed/finance') return <FinanceDepositTabs />;
    if (pathname === '/finance/deposit/fixed/new-entry') return <FinanceDepositTabs />;

    if (pathname === '/finance/deposit/fixed/material') return <MaterialDepositTabs />;
    if (pathname === '/finance/deposit/fixed/new-material-entry') return <MaterialDepositTabs />;

    if (pathname === '/finance/deposit/fixed/will') return <TestamentTabs />;
    if (pathname === '/finance/deposit/fixed/new-testament-entry') return <TestamentTabs />;

    if (budgetCreateRegex.test(pathname)) return <BudgetCreate />;
    if (budgetDetails.test(pathname)) return <BudgetDetails />;
    if (invoicesRegex.test(pathname)) return <Invoices />;
    if (budgetPreviewDetails.test(pathname)) return <NonFinancePreview />;
    if (decisionsRegex.test(pathname)) return <Decisions />;
    if (contractsRegex.test(pathname)) return <Contracts />;
    if (salariesRegex.test(pathname)) return <Salaries />;
    if (budgetFO.test(pathname)) return <BudgetFO />;

    if (pathname === '/finance/fines-taxes') return <FinesAndTaxesLanding />;
    if (finesRegex.test(pathname)) return <Fines />;

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
