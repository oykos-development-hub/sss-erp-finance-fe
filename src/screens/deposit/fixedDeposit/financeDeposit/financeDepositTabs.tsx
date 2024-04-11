import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import {useEffect, useMemo, useState} from 'react';
import useAppContext from '../../../../context/useAppContext';
import ScreenWrapper from '../../../../shared/screenWrapper/screenWrapper';
import {Tabs, getRouteName, getCurrentTab, stockTabs} from './constants';
import FinanceDepositOverview from './financeDepositOverview';
import {CustomDivider, MainTitle, SectionBox, StyledTabs, TitleTabsWrapper} from './styles';
import NewEntryFinancial from './newEntryFinancial';

export const FinanceDepositTabs = () => {
  const {
    navigation: {
      navigate,
      location: {pathname},
    },
  } = useAppContext();

  const [activeTab, setActiveTab] = useState(getCurrentTab(location.pathname) || 1);
  const currentFinancePath = pathname && pathname.split('/')[pathname.split('/').length - 1];

  const onTabChange = (tab: Tab) => {
    setActiveTab(tab.id as number);
    const routeName = getRouteName(tab.title as string);

    const pathname = location.pathname.split('/');
    pathname.pop();

    navigate(`${pathname.join('/')}/${routeName}`);
  };

  const currentFinanceDepositRoute = useMemo(() => {
    if (currentFinancePath === 'add-new') {
      return <NewEntryFinancial />;
    } else {
      return <FinanceDepositOverview />;
    }
  }, [currentFinancePath]);

  const getTitle = useMemo(() => {
    switch (activeTab) {
      case Tabs.NewEntry:
        return 'STALNI FINANSIJSKI DEPOZIT - UNOS';
      default:
        return 'STALNI FINANSIJSKI DEPOZIT - PREGLED';
    }
  }, [activeTab]);

  useEffect(() => {
    setActiveTab(getCurrentTab(location.pathname) || 1);
  }, [location.pathname]);

  return (
    <ScreenWrapper>
      <SectionBox>
        <TitleTabsWrapper>
          <MainTitle variant="bodyMedium" content={getTitle} style={{marginBottom: 0}} />
          <StyledTabs tabs={stockTabs} activeTab={activeTab} onChange={onTabChange} />
        </TitleTabsWrapper>
        <CustomDivider style={{marginTop: 0, marginBottom: 20}} />
        {currentFinanceDepositRoute}
      </SectionBox>
    </ScreenWrapper>
  );
};
