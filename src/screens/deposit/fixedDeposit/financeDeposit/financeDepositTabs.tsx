import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import {useEffect, useMemo, useState} from 'react';
import useAppContext from '../../../../context/useAppContext';
import ScreenWrapper from '../../../../shared/screenWrapper/screenWrapper';
import {Tabs, getCurrentTab, getRouteName, stockTabs} from './constants';
import FinanceDepositOverview from './financeDepositOverview';
import {CustomDivider, MainTitle, SectionBox, StyledTabs, TitleTabsWrapper} from './styles';
import NewEntry from './newEntry';

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
    switch (currentFinancePath) {
      case 'new-entry':
        return <NewEntry />;
      default:
        return <FinanceDepositOverview />;
    }
  }, [currentFinancePath]);

  const getTitle = () => {
    switch (activeTab) {
      case Tabs.NewEntry:
        return 'UNOS';
      default:
        return 'STALNI FINANSIJSKI - PREGLED';
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
        {currentFinanceDepositRoute}
      </SectionBox>
    </ScreenWrapper>
  );
};
