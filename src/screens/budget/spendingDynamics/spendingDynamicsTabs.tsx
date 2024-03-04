import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import {useEffect, useMemo, useState} from 'react';
import {Tabs, getCurrentTab, getRouteName, stockTabs} from './constants';
import {CustomDivider, MainTitle, SectionBox, StyledTabs, TitleTabsWrapper} from './styles';
import useAppContext from '../../../context/useAppContext';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper';
import SpendingDynamicsOverview from './spendingDynamicsOverview';
import SpendingDinamicsRequests from './spendingDynamicsRequests';

export const SpendingDynamicsTabs = () => {
  const {
    navigation: {
      navigate,
      location: {pathname},
    },
  } = useAppContext();
  const [activeTab, setActiveTab] = useState(getCurrentTab(location.pathname) || 1);
  const spendingDynamicsPath = pathname && pathname.split('/')[pathname.split('/').length - 1];

  const onTabChange = (tab: Tab) => {
    setActiveTab(tab.id as number);
    const routeName = getRouteName(tab.title as string);

    const pathname = location.pathname.split('/');
    pathname.pop();

    navigate(`${pathname.join('/')}/${routeName}`);
  };

  const spendingDynamicsRoute = useMemo(() => {
    switch (spendingDynamicsPath) {
      case 'requests':
        return <SpendingDinamicsRequests />;
      default:
        return <SpendingDynamicsOverview />;
    }
  }, [spendingDynamicsPath]);

  const getTitle = () => {
    switch (activeTab) {
      case Tabs.Requests:
        return 'ZAHTJEVI';

      default:
        return 'DINAMIKA POTROŠNJE';
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
        {spendingDynamicsRoute}
      </SectionBox>
    </ScreenWrapper>
  );
};
