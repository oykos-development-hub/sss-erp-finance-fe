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
    const invoicesRegex = new RegExp('^/finance/liabilities-receivables/invoices(?:/add-invoice)?$');
    const decisionsRegex = new RegExp('^/finance/liabilities-receivables/decisions(?:/add-decision)?$');
    const contractsRegex = new RegExp('^/finance/liabilities-receivables/contracts(?:/add-contract)?$');
    const salariesRegex = new RegExp('^/finance/liabilities-receivables/salaries(?:/add-salary)?$');
    const budgetCreateRegex = /\/finance\/budget-create-(\d{4})/;
    const budgetPreviewDetails = new RegExp(`^/finance/budget/nonFinancePreview/${name}$`);
    const budgetFO = new RegExp(`^/finance/budgetFO/\\d+(?:/${name})$`);

    if (pathname === '/finance/budget') return <BudgetOverview />;
    if (pathname === '/finance/budget-template') return <BudgetTemplate />;
    if (pathname === '/finance/budget/nonFinance') return <NonFinance />;
    if (budgetCreateRegex.test(pathname)) return <BudgetTemplate />;
    if (budgetDetails.test(pathname)) return <BudgetDetails />;
    if (invoicesRegex.test(pathname)) return <Invoices />;
    if (budgetPreviewDetails.test(pathname)) return <NonFinancePreview />;
    if (decisionsRegex.test(pathname)) return <Decisions />;
    if (contractsRegex.test(pathname)) return <Contracts />;
    if (salariesRegex.test(pathname)) return <Salaries />;
    if (budgetFO.test(pathname)) return <BudgetFO />;

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
