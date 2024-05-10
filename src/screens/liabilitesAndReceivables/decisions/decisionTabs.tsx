import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import {useEffect, useMemo, useState} from 'react';
import useAppContext from '../../../context/useAppContext';
import {Tabs, decisionTabs, getCurrentTab, getRouteName} from './constants';
import DecisionsEntry from './decisionsEntry/decisionsEntry';
import DecisionsOverview from './decisionsOverview/decisionsOverview';
import {CustomDivider, StyledTabs, TitleTabsWrapper} from '../../accounting/styles';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper';
import SectionBox from '../../../shared/sectionBox';
import {MainTitle} from '../../../shared/pageElements';

export const DecisionTabs = () => {
  const {
    navigation: {
      navigate,
      location: {pathname},
    },
  } = useAppContext();
  const [activeTab, setActiveTab] = useState(getCurrentTab(location.pathname) || 1);
  const currentAccountingPath = pathname && pathname.split('/')[pathname.split('/').length - 1];

  const onTabChange = (tab: Tab) => {
    setActiveTab(tab.id as number);
    const routeName = getRouteName(tab.title as string);

    const pathname = location.pathname.split('/');
    pathname.pop();

    navigate(`${pathname.join('/')}/${routeName}`);
  };

  const currentAccountingRoute = useMemo(() => {
    switch (currentAccountingPath) {
      case 'add-decision':
        return <DecisionsEntry />;
      default:
        return <DecisionsOverview />;
    }
  }, [currentAccountingPath]);

  const getTitle = () => {
    switch (activeTab) {
      case Tabs.AddDecision:
        return 'UNOS RJEŠENJA';

      default:
        return 'PREGLED RJEŠENJA';
    }
  };
  useEffect(() => {
    setActiveTab(getCurrentTab(location.pathname) || 1);
  }, [location.pathname]);

  return (
    <ScreenWrapper>
      <SectionBox>
        <TitleTabsWrapper>
          <MainTitle variant="bodyMedium" content={getTitle()} style={{marginBottom: 0}} />
          <StyledTabs tabs={decisionTabs} activeTab={activeTab} onChange={onTabChange} />
        </TitleTabsWrapper>
        <CustomDivider style={{marginTop: 0}} />
        {currentAccountingRoute}
      </SectionBox>
    </ScreenWrapper>
  );
};
