import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import {useEffect, useMemo, useState} from 'react';
import {budgetTabs} from '../../../../constants.ts';
import useAppContext from '../../../../context/useAppContext.ts';
import useGetBudgetFinancial from '../../../../services/graphQL/getFinancial/useGetFinancial.ts';
import SectionBox from '../../../../shared/sectionBox.ts';
import StyledTabsWithTitle from '../../../../shared/styledTabsWithTitle/styledTabsWithTitle.tsx';
import {getCurrentTab} from '../../../../utils/getCurrentTab.ts';
import {getRouteName} from '../../../../utils/getRouteName.ts';
import {NotFound404} from '../../../404.tsx';
import BudgetFinancial from './budgetFinancial/budgetFinancial.tsx';
import BudgetNonFinancial from './budgetNonFinancial/budgetNonFinancial.tsx';
import BudgetSummary from './budgetSummary.tsx';

const BudgetSubmissionTabs = () => {
  const {
    breadcrumbs,
    navigation: {
      location: {pathname},
      navigate,
    },
  } = useAppContext();

  const id = useMemo(() => {
    const path = pathname.split('/');
    return path[path.length - 2];
  }, [pathname]);

  const [activeTab, setActiveTab] = useState(getCurrentTab(pathname, budgetTabs) || 1);
  const {budgetFinancial} = useGetBudgetFinancial({budget_id: id});

  console.log(budgetFinancial);

  const onTabChange = (tab: Tab) => {
    setActiveTab(tab.id as number);
    const routeName = getRouteName(tab.title as string, budgetTabs);

    breadcrumbs.remove();
    if (routeName === 'summary') {
      breadcrumbs.add({
        name: 'Pregled',
        to: `/finance/budget/planning/${id}/summary`,
      });
    } else if (routeName === 'financial') {
      breadcrumbs.add({
        name: 'Finansijski',
        to: `/finance/budget/planning/${id}/financial`,
      });
    } else {
      breadcrumbs.add({
        name: 'Nefinansijski',
        to: `/finance/budget/planning/${id}/non-financial`,
      });
    }

    if (activeTab !== tab.id) {
      const path = pathname.split('/');
      const id = path[path.length - 2];
      navigate(routeName ? `/finance/budget/planning/${id}/${routeName}` : `/finance/budget/planning/${id}/summary`);
    }
  };

  const content = useMemo(() => {
    const path = pathname.split('/');
    const id = path[path.length - 2];

    if (pathname === `/finance/budget/planning/${id}/summary`) return <BudgetSummary id={parseInt(id)} />;
    if (pathname === `/finance/budget/planning/${id}/financial`) return <BudgetFinancial />;
    if (pathname === `/finance/budget/planning/${id}/non-financial`) return <BudgetNonFinancial />;

    return <NotFound404 />;
  }, [pathname]);

  useEffect(() => {
    setActiveTab(getCurrentTab(pathname, budgetTabs) || 1);
  }, [pathname]);

  return (
    <SectionBox>
      <StyledTabsWithTitle tabs={budgetTabs} activeTab={activeTab} onChange={onTabChange} />
      {content}
    </SectionBox>
  );
};

export default BudgetSubmissionTabs;
