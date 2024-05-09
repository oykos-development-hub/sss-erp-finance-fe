import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import {useEffect, useMemo, useState} from 'react';
import useAppContext from '../../context/useAppContext';
import ScreenWrapper from '../../shared/screenWrapper/screenWrapper';
import Accounting from './accounting';
import {Tabs, getCurrentTab, getRouteName, stockTabs} from './constants';
import {CustomDivider, MainTitle, SectionBox, StyledTabs, TitleTabsWrapper} from './styles';
import AccountingOverview from './accountingOverview';

export const CurrentAccountingTabs = () => {
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
      case 'accounting-overview':
        return <AccountingOverview />;
      default:
        return <Accounting />;
    }
  }, [currentAccountingPath]);

  const getTitle = () => {
    switch (activeTab) {
      case Tabs.CurrentAccountingOverview:
        return 'GLAVNA KNJIGA';

      default:
        return 'RAČUNOVODSTVO - PREGLED';
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
        {currentAccountingRoute}
      </SectionBox>
    </ScreenWrapper>
  );
};
