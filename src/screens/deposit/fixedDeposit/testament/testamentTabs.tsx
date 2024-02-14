import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import {useEffect, useMemo, useState} from 'react';
import useAppContext from '../../../../context/useAppContext';
import ScreenWrapper from '../../../../shared/screenWrapper/screenWrapper';
import {Tabs, getCurrentTab, getRouteName, stockTabs} from './constants';
import {CustomDivider, MainTitle, SectionBox, StyledTabs, TitleTabsWrapper} from './styles';
import TestamentOverview from './testamentOverview';
import NewTestamentEntry from './newTestamentEntry';

export const TestamentTabs = () => {
  const {
    navigation: {
      navigate,
      location: {pathname},
    },
  } = useAppContext();
  const [activeTab, setActiveTab] = useState(getCurrentTab(location.pathname) || 1);
  const currentTestamentPath = pathname && pathname.split('/')[pathname.split('/').length - 1];

  const onTabChange = (tab: Tab) => {
    setActiveTab(tab.id as number);
    const routeName = getRouteName(tab.title as string);

    const pathname = location.pathname.split('/');
    pathname.pop();

    navigate(`${pathname.join('/')}/${routeName}`);
  };

  const currentTestamentRoute = useMemo(() => {
    switch (currentTestamentPath) {
      case 'new-testament-entry':
        return <NewTestamentEntry />;
      default:
        return <TestamentOverview />;
    }
  }, [currentTestamentPath]);

  const getTitle = () => {
    switch (activeTab) {
      case Tabs.NewEntry:
        return 'STALNI TESTAMENTI - UNOS';
      default:
        return 'STALNI TESTAMENTI - PREGLED';
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
          <StyledTabs tabs={stockTabs} activeTab={activeTab} onChange={onTabChange} />
        </TitleTabsWrapper>
        <CustomDivider style={{marginTop: 0}} />
        {currentTestamentRoute}
      </SectionBox>
    </ScreenWrapper>
  );
};
