import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import {useEffect, useMemo, useState} from 'react';
import useAppContext from '../../../context/useAppContext';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper';
import {Tabs} from '../constants';
import {CustomDivider, MainTitle, SectionBox, StyledTabs, TitleTabsWrapper} from '../styles';
import AddAccountingPaymentOrder from './addAccountingPaymentOrder';
import AccountingPaymentOrdersOverview from './accountingPaymentOrdersOverview';

const accountingPaymentOrderTabs = [
  {id: Tabs.CurrentAccounting, title: 'Knjiženje naloga', routeName: 'payment-orders'},
  {id: Tabs.CurrentAccountingOverview, title: 'Dnevnik knjiženja', routeName: 'payment-orders-overview'},
];

const getCurrentTab = (pathname: string) => {
  const path = pathname.split('/');
  const name = path[path.length - 1];
  return accountingPaymentOrderTabs.find(tab => tab.routeName === name)?.id;
};

const getRouteName = (tabName: string) => {
  const tabIndex = accountingPaymentOrderTabs.findIndex(tab => tab.title === tabName);
  return accountingPaymentOrderTabs[tabIndex].routeName;
};

export const CurrentAccountingPaymentOrderTabs = () => {
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
      case 'payment-orders-overview':
        return <AccountingPaymentOrdersOverview />;
      default:
        return <AddAccountingPaymentOrder />;
    }
  }, [currentAccountingPath]);

  const getTitle = () => {
    switch (activeTab) {
      case Tabs.CurrentAccountingOverview:
        return 'DNEVNIK KNJIŽENJA - NALOZI';

      default:
        return 'KNJIŽENJE NALOGA ZA PLAĆANJE';
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
          <StyledTabs tabs={accountingPaymentOrderTabs} activeTab={activeTab} onChange={onTabChange} />
        </TitleTabsWrapper>
        <CustomDivider style={{marginTop: 0}} />
        {currentAccountingRoute}
      </SectionBox>
    </ScreenWrapper>
  );
};
