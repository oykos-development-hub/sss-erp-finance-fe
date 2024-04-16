import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import {useEffect, useMemo, useState} from 'react';
import useAppContext from '../../../../context/useAppContext';
import {Tabs, getCurrentTab, getRouteName, stockTabs} from '../../constants';
import {StyledTabs, TitleTabsWrapper} from '../../styles';
import {Divider, Theme} from 'client-library';
import DepositPaymentNewEntry from './depositPaymentNewEntry';
import DepositPaymentsOverview from './depositPaymentsOverview';
import {MainTitle} from '../../../../shared/pageElements';
import SectionBox from '../../../../shared/sectionBox';
import ScreenWrapper from '../../../../shared/screenWrapper/screenWrapper';

const DepositPaymentsTabs = () => {
  const {
    navigation: {
      navigate,
      location: {pathname},
    },
  } = useAppContext();

  const [activeTab, setActiveTab] = useState(getCurrentTab(location.pathname) || 1);

  const pathnameSegments = pathname.split('/');
  const currentPath = pathnameSegments[pathnameSegments.length - 1];

  const onTabChange = (tab: Tab) => {
    setActiveTab(tab.id as number);
    const routeName = getRouteName(tab.title as string);

    const pathname = location.pathname.split('/');
    pathname.pop();

    navigate(`${pathname.join('/')}/${routeName}`);
  };

  const currentFinanceDepositRoute = useMemo(() => {
    if (currentPath === 'add-new') {
      return <DepositPaymentNewEntry />;
    } else {
      return <DepositPaymentsOverview />;
    }
  }, [currentPath]);

  const getTitle = useMemo(() => {
    switch (activeTab) {
      case Tabs.NewEntry:
        return 'PROLAZNI DEPOZIT - UPLATE NA RAČUN - UNOS';
      default:
        return 'PROLAZNI DEPOZIT - UPLATE NA RAČUN - PREGLED';
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
        <Divider style={{marginTop: 0, marginBottom: 20}} height="1px" color={Theme.palette.gray200} />
        {currentFinanceDepositRoute}
      </SectionBox>
    </ScreenWrapper>
  );
};

export default DepositPaymentsTabs;
