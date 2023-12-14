import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import {useEffect, useState} from 'react';
import {budgetTabs, UserRole} from '../../constants';
import SectionBox from '../../shared/sectionBox';
import {getRouteName} from '../../utils/getRouteName';
import useAppContext from '../../context/useAppContext.ts';
import {NotFound404} from '../../screens/404.tsx';
import BudgetSummary from '../../screens/budget/budgetDetails/budgetSummary.tsx';
import {getCurrentTab} from '../../utils/getCurrentTab.ts';
import StyledTabsWithTitle from '../../shared/styledTabsWithTitle/styledTabsWithTitle.tsx';
import BudgetNonFinancialOverview from '../../screens/budget/budgetNonFinancialOverview/budgetNonFinancialOverview.tsx';

const BudgetTabs = () => {
  const {
    breadcrumbs,
    navigation: {
      location: {pathname},
      navigate,
    },
    contextMain: {role_id},
  } = useAppContext();
  const [activeTab, setActiveTab] = useState(getCurrentTab(pathname, budgetTabs) || 1);

  const onTabChange = (tab: Tab) => {
    setActiveTab(tab.id as number);
    const routeName = getRouteName(tab.title as string, budgetTabs);
    const path = pathname.split('/');
    const id = path[path.length - 2];

    breadcrumbs.remove();
    if (routeName === '') {
      breadcrumbs.add({
        name: 'Summary',
        to: '/finance/budget/summary',
      });
    } else if (routeName === 'financial') {
      breadcrumbs.add({
        name: 'Financial',
        to: `/finance/budget/${id}/financial`,
      });
    } else {
      breadcrumbs.add({
        name: 'Non-Financial',
        to: `/finance/budget/${id}/non-financial`,
      });
    }

    if (activeTab !== tab.id) {
      const path = pathname.split('/');
      const id = path[path.length - 2];
      navigate(routeName ? `/finance/budget/${id}/${routeName}` : `/finance/budget/${id}/summary`);
    }
  };

  const renderScreen = () => {
    const path = pathname.split('/');
    const id = path[path.length - 2];
    // TODO remove !==
    if (role_id !== UserRole.ADMIN || role_id === UserRole.MANAGER_OJ) {
      if (pathname === `/finance/budget/${id}/summary`) return <BudgetSummary id={id} />;
      // TODO below pages not created yet
      //  if (pathname === `/finance/budget/${id}/financial`)  return <BudgetFinancial />;
      //  if (pathname === `/finance/budget/${id}/non-financial`)  return <BudgetNonFinancial />;

      //TODO replace with OFFICIAL_FOR_FINANCE role
    } else {
      // TODO replace budget with ${id}
      // if (pathname === `/finance/budget/${id}/non-financial`) {
      if (pathname === '/finance/budget/nonFinancePreview/non-financial') {
        return <BudgetNonFinancialOverview />;
      }
    }
    return <NotFound404 />;
  };

  useEffect(() => {
    setActiveTab(getCurrentTab(pathname, budgetTabs) || 1);
  }, [pathname]);

  return (
    <SectionBox>
      <StyledTabsWithTitle tabs={budgetTabs} activeTab={activeTab} onChange={onTabChange} />
      {renderScreen()}
    </SectionBox>
  );
};

export default BudgetTabs;
