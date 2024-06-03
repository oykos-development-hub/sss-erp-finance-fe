import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import {useEffect, useMemo, useState} from 'react';
import {budgetTabs} from '../../../../constants.ts';
import useAppContext from '../../../../context/useAppContext.ts';
import SectionBox from '../../../../shared/sectionBox.ts';
import StyledTabsWithTitle from '../../../../shared/styledTabsWithTitle/styledTabsWithTitle.tsx';
import {getCurrentTab} from '../../../../utils/getCurrentTab.ts';
import {getRouteName} from '../../../../utils/getRouteName.ts';
import {NotFound404} from '../../../404.tsx';
import BudgetFinancial from './budgetFinancial/budgetFinancial.tsx';
import BudgetSummary from './budgetSummary.tsx';
import useGetBudgetRequestDetails from '../../../../services/graphQL/budgetRequestDetails/useGetBudgetRequestDetails.ts';
import {NonFinanceOfficial} from './budgetNonFinancial/nonFinanceOfficial.tsx';

const BudgetSubmissionTabs = () => {
  const {
    breadcrumbs,
    navigation: {
      location: {pathname},
      navigate,
    },
    contextMain: {organization_unit},
  } = useAppContext();

  const id = useMemo(() => {
    const path = pathname.split('/');
    return path[path.length - 2];
  }, [pathname]);

  const [activeTab, setActiveTab] = useState(getCurrentTab(pathname, budgetTabs) || 1);
  const {budgetRequestDetails, refetch} = useGetBudgetRequestDetails({
    budgetId: id,
    organizationUnitId: organization_unit.id,
  });

  const onTabChange = (tab: Tab) => {
    setActiveTab(tab.id as number);
    const routeName = getRouteName(tab.title as string, budgetTabs);

    const path = pathname.split('/');
    const id = path[path.length - 2];

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
      navigate(routeName ? `/finance/budget/planning/${id}/${routeName}` : `/finance/budget/planning/${id}/summary`);
    }
  };

  const content = useMemo(() => {
    if (pathname === `/finance/budget/planning/${id}/summary`)
      return <BudgetSummary budgetRequestDetails={budgetRequestDetails} />;
    if (pathname === `/finance/budget/planning/${id}/financial`)
      return <BudgetFinancial budgetRequestDetails={budgetRequestDetails} />;
    if (pathname === `/finance/budget/planning/${id}/non-financial`)
      // return <BudgetNonFinancial budgetRequestDetails={budgetRequestDetails} />;
      return <NonFinanceOfficial budgetRequestDetails={budgetRequestDetails} />;
    // return <NonFinance budgetRequestDetails={budgetRequestDetails} />;
    // return <BudgetNonFinancialOverview />;

    return <NotFound404 />;
  }, [pathname, budgetRequestDetails]);

  useEffect(() => {
    setActiveTab(getCurrentTab(pathname, budgetTabs) || 1);
    activeTab === 1 && refetch();
  }, [pathname]);

  return (
    <SectionBox>
      <StyledTabsWithTitle tabs={budgetTabs} activeTab={activeTab} onChange={onTabChange} />
      {content}
    </SectionBox>
  );
};

export default BudgetSubmissionTabs;
