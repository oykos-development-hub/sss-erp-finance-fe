import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper.tsx';
import SectionBox from '../../../shared/sectionBox.ts';
import {salariesTabs} from '../../../constants.ts';
import {useState} from 'react';
import {getCurrentTab} from '../../../utils/getCurrentTab.ts';
import useAppContext from '../../../context/useAppContext.ts';
import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import StyledTabsWithTitle from '../../../shared/styledTabsWithTitle/styledTabsWithTitle.tsx';
import {getRouteName} from '../../../utils/getRouteName.ts';
import {NotFound404} from '../../404.tsx';
import SalariesEntry from './salariesEntry/salariesEntry.tsx';
import SalariesOverview from './salariesOverview/salariesOverview.tsx';

const Salaries = () => {
  const {
    navigation: {
      navigate,
      location: {pathname},
    },
  } = useAppContext();
  const [activeTab, setActiveTab] = useState(getCurrentTab(pathname, salariesTabs) || 1);
  const onTabChange = (tab: Tab) => {
    setActiveTab(tab.id as number);
    const routeName = getRouteName(tab.title as string, salariesTabs);

    if (activeTab !== tab.id) {
      navigate(
        routeName
          ? '/finance/liabilities-receivables/salaries/add-salary'
          : '/finance/liabilities-receivables/salaries',
      );
    }
  };

  const renderScreen = () => {
    if (pathname === '/finance/liabilities-receivables/salaries') return <SalariesOverview />;
    if (pathname === '/finance/liabilities-receivables/salaries/add-salary') return <SalariesEntry />;
    return <NotFound404 />;
  };

  return (
    <ScreenWrapper>
      <SectionBox>
        <StyledTabsWithTitle tabs={salariesTabs} onChange={onTabChange} activeTab={activeTab} />
        {renderScreen()}
      </SectionBox>
    </ScreenWrapper>
  );
};

export default Salaries;
