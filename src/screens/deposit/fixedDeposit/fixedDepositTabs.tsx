import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import {useEffect, useMemo, useState} from 'react';
import useAppContext from '../../../context/useAppContext';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper';
import {FixedDepositType} from '../../../types/deposits';
import {Tabs, getCurrentTab, getRouteName, stockTabs} from './financeDeposit/constants';
import FinancialDepositNewEntry from './financeDeposit/financialDepositNewEntry';
import {CustomDivider, MainTitle, SectionBox, StyledTabs, TitleTabsWrapper} from './financeDeposit/styles';
import FixedDepositOverview from './fixedDepositOverview';
import MaterialDepositNewEntry from './materialDeposit/materialDepositNewEntry';

export const FixedDepositTabs = () => {
  const {
    navigation: {
      navigate,
      location: {pathname},
    },
  } = useAppContext();

  const [activeTab, setActiveTab] = useState(getCurrentTab(location.pathname) || 1);

  const pathnameSegments = pathname.split('/');
  const currentFinancePath = pathnameSegments[pathnameSegments.length - 1];
  const type = pathnameSegments[pathnameSegments.length - 2] as FixedDepositType;

  const onTabChange = (tab: Tab) => {
    setActiveTab(tab.id as number);
    const routeName = getRouteName(tab.title as string);

    const pathname = location.pathname.split('/');
    pathname.pop();

    navigate(`${pathname.join('/')}/${routeName}`);
  };

  const currentFinanceDepositRoute = useMemo(() => {
    if (currentFinancePath === 'add-new') {
      return type === 'financial' ? <FinancialDepositNewEntry /> : <MaterialDepositNewEntry />;
    } else {
      return <FixedDepositOverview type={type} key={type} />;
    }
  }, [currentFinancePath]);

  const getTitle = useMemo(() => {
    const typeString = type === 'financial' ? 'FINANSIJSKI' : 'MATERIJALNI';

    switch (activeTab) {
      case Tabs.NewEntry:
        return `STALNI ${typeString} DEPOZIT - UNOS`;
      default:
        return `STALNI ${typeString} DEPOZIT - PREGLED`;
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
