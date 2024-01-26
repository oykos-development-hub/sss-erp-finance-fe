import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper.tsx';
import SectionBox from '../../../shared/sectionBox.ts';
import {decisionTabs} from '../../../constants.ts';
import {useState} from 'react';
import {getCurrentTab} from '../../../utils/getCurrentTab.ts';
import useAppContext from '../../../context/useAppContext.ts';
import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import StyledTabsWithTitle from '../../../shared/styledTabsWithTitle/styledTabsWithTitle.tsx';
import {getRouteName} from '../../../utils/getRouteName.ts';
import {NotFound404} from '../../404.tsx';
import DecisionsEntry from './decisionsEntry/decisionsEntry.tsx';
import DecisionsOverview from './decisionsOverview/decisionsOverview.tsx';

const Decisions = () => {
  const {
    navigation: {
      navigate,
      location: {pathname},
    },
  } = useAppContext();
  const [activeTab, setActiveTab] = useState(getCurrentTab(pathname, decisionTabs) || 1);
  const onTabChange = (tab: Tab) => {
    setActiveTab(tab.id as number);
    const routeName = getRouteName(tab.title as string, decisionTabs);

    if (activeTab !== tab.id) {
      navigate(
        routeName
          ? '/finance/liabilities-receivables/liabilities/decisions/add-decision'
          : '/finance/liabilities-receivables/liabilities/decisions',
      );
    }
  };

  const renderScreen = () => {
    if (pathname === '/finance/liabilities-receivables/liabilities/decisions') return <DecisionsOverview />;
    if (pathname === '/finance/liabilities-receivables/liabilities/decisions/add-decision') return <DecisionsEntry />;
    return <NotFound404 />;
  };

  return (
    <ScreenWrapper>
      <SectionBox>
        <StyledTabsWithTitle tabs={decisionTabs} onChange={onTabChange} activeTab={activeTab} />
        {renderScreen()}
      </SectionBox>
    </ScreenWrapper>
  );
};

export default Decisions;
