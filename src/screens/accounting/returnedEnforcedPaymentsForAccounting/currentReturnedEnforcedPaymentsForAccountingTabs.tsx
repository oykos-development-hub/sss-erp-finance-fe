import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import {useEffect, useMemo, useState} from 'react';
import useAppContext from '../../../context/useAppContext';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper';
import {Tabs} from '../constants';
import {CustomDivider, MainTitle, SectionBox, StyledTabs, TitleTabsWrapper} from '../styles';
import AddReturnedEnforcedPaymentsForAccounting from './addReturnedEnforcedPaymentsForAccounting';
import ReturnedEnforcedPaymentsForAccountingOverview from './returnedEnforcedPaymentsForAccountingOverview';

const accountingPaymentOrderTabs = [
  {id: Tabs.CurrentAccounting, title: 'Knjiženje povraćaja prinudnih naplata', routeName: 'returned-enforced-payments'},
  {id: Tabs.CurrentAccountingOverview, title: 'Proknjiženi nalozi', routeName: 'returned-enforced-payments-overview'},
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

export const CurrentReturnedEnforcedPaymentsForAccountingTabs = () => {
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
      case 'returned-enforced-payments-overview':
        return <ReturnedEnforcedPaymentsForAccountingOverview />;
      default:
        return <AddReturnedEnforcedPaymentsForAccounting />;
    }
  }, [currentAccountingPath]);

  const getTitle = () => {
    switch (activeTab) {
      case Tabs.CurrentAccountingOverview:
        return 'PROKNJIŽENI NALOZI';

      default:
        return 'KNJIŽENJE POVRAĆAJA PRINUDNIH NAPLATA';
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
