import {NotFound404} from './screens/404';
import BudgetOverview from './screens/budget/budgetOverview/budgetOverview';
import BudgetTemplate from './screens/budget/budgetTemplate/budgetTemplate.tsx';
import useAppContext from './context/useAppContext.ts';
import BudgetDetails from './screens/budget/budgetDetails/budgetDetails.tsx';
import Invoices from './screens/liabilitesAndReceivables/invoices/invoices.tsx';
import {UserRole} from './constants.ts';
import Decisions from './screens/liabilitesAndReceivables/decisions/decisions.tsx';
import NonFinancePreview from './screens/budget/nonFinancePreview/nonFinancePreview.tsx';
import {NonFinance} from './screens/budget/nonFinance/nonFinance.tsx';
import Contracts from './screens/liabilitesAndReceivables/contracts/contracts.tsx';
import Salaries from './screens/liabilitesAndReceivables/salaries/salaries.tsx';
import BudgetFO from './screens/budget/budgetFO/budgetFO.tsx';
import BudgetCreate from './screens/budget/budgetCreate/budgetCreate.tsx';
import BUDGET from './screens/budget/landingPage.tsx';
import {CurrentBudgetTabs} from './screens/budget/currentBudget/currentBudgetTabs.tsx';
import {CurrentAccountingTabs} from './screens/accounting/currentAccountingTabs.tsx';
import {LandingPage as FinesAndTaxesLanding} from './screens/finesAndTaxes/landingPage.tsx';
import {LandingPage} from './screens/landingPage/landingPage.tsx';

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

    if (budgetCreateRegex.test(pathname)) return <BudgetCreate />;
    if (budgetDetails.test(pathname)) return <BudgetDetails />;
    if (invoicesRegex.test(pathname)) return <Invoices />;
    if (budgetPreviewDetails.test(pathname)) return <NonFinancePreview />;
    if (decisionsRegex.test(pathname)) return <Decisions />;
    if (contractsRegex.test(pathname)) return <Contracts />;
    if (salariesRegex.test(pathname)) return <Salaries />;
    if (budgetFO.test(pathname)) return <BudgetFO />;

    if (pathname === '/finance/fines-taxes') return <FinesAndTaxesLanding />;

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
