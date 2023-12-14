// screen that should be displayed only for finance official
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper.tsx';
import SectionBox from '../../../shared/sectionBox.ts';
import {budgetTabsForOfficial} from '../../../constants.ts';
import {useState} from 'react';
import {getCurrentTab} from '../../../utils/getCurrentTab.ts';
import useAppContext from '../../../context/useAppContext.ts';
import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import StyledTabsWithTitle from '../../../shared/styledTabsWithTitle/styledTabsWithTitle.tsx';
import {getRouteName} from '../../../utils/getRouteName.ts';
import {NotFound404} from '../../404.tsx';
import BudgetRequestsFO from './budgetRequestsFO/budgetRequestsFO.tsx';
import BudgetOverviewFO from './budgetOverviewFO/budgetOverviewFO.tsx';
import {getYearFromPath} from '../../../utils/getYearFromPath.ts';
const BudgetFO = () => {
  const {
    navigation: {
      navigate,
      location: {pathname},
    },
  } = useAppContext();
  const [activeTab, setActiveTab] = useState(getCurrentTab(pathname, budgetTabsForOfficial) || 1);
  const year = getYearFromPath(pathname);
  const onTabChange = (tab: Tab) => {
    setActiveTab(tab.id as number);
    const routeName = getRouteName(tab.title as string, budgetTabsForOfficial);

    if (activeTab !== tab.id) {
      navigate(routeName ? `/finance/budgetFO/${year}/requests` : `/finance/budgetFO/${year}`);
    }
  };

  const renderScreen = () => {
    if (pathname === `/finance/budgetFO/${year}`) return <BudgetOverviewFO />;
    if (pathname === `/finance/budgetFO/${year}/requests`) return <BudgetRequestsFO />;
    return <NotFound404 />;
  };

  return (
    <ScreenWrapper>
      <SectionBox>
        <StyledTabsWithTitle tabs={budgetTabsForOfficial} onChange={onTabChange} activeTab={activeTab} />
        {renderScreen()}
      </SectionBox>
    </ScreenWrapper>
  );
};

export default BudgetFO;
