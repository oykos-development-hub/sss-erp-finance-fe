import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import {useEffect, useMemo, useState} from 'react';
import useAppContext from '../../../context/useAppContext';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper';
import AccountingObligationsOverview from './accountingObligationsOverview';
import AddAccountingObligations from './addAccountingObligations';
import {Tabs} from '../constants';
import {CustomDivider, MainTitle, SectionBox, StyledTabs, TitleTabsWrapper} from '../styles';

const accountingTabs = [
  {id: Tabs.CurrentAccounting, title: 'Knjiženje obaveza', routeName: 'obligations'},
  {id: Tabs.CurrentAccountingOverview, title: 'Proknjiženi nalozi', routeName: 'obligations-overview'},
];

const getCurrentTab = (pathname: string) => {
  const path = pathname.split('/');
  const name = path[path.length - 1];
  return accountingTabs.find(tab => tab.routeName === name)?.id;
};

const getRouteName = (tabName: string) => {
  const tabIndex = accountingTabs.findIndex(tab => tab.title === tabName);
  return accountingTabs[tabIndex].routeName;
};

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
      case 'obligations-overview':
        return <AccountingObligationsOverview />;
      default:
        return <AddAccountingObligations />;
    }
  }, [currentAccountingPath]);

  const getTitle = () => {
    switch (activeTab) {
      case Tabs.CurrentAccountingOverview:
        return 'PROKNJIŽENI NALOZI';

      default:
        return 'KNJIŽENJE OBAVEZA';
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
          <StyledTabs tabs={accountingTabs} activeTab={activeTab} onChange={onTabChange} />
        </TitleTabsWrapper>
        <CustomDivider style={{marginTop: 0}} />
        {currentAccountingRoute}
      </SectionBox>
    </ScreenWrapper>
  );
};
