import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import {Divider, Theme} from 'client-library';
import {useEffect, useMemo, useState} from 'react';
import useAppContext from '../../../../context/useAppContext';
import {MainTitle} from '../../../../shared/pageElements';
import ScreenWrapper from '../../../../shared/screenWrapper/screenWrapper';
import SectionBox from '../../../../shared/sectionBox';
import {Tabs, getCurrentTab, getRouteName, stockTabs} from '../../constants';
import {StyledTabs, TitleTabsWrapper} from '../../styles';
import DepositPaymentOrderNewEntry from './depositPaymentOrderNewEntry';
import DepositPaymentOrderOverview from './depositPaymentOrderOverview';
import {checkActionRoutePermissions} from '../../../../services/checkRoutePermissions.ts';

const DepositPaymentOrderTabs = () => {
  const {
    navigation: {
      navigate,
      location: {pathname},
    },
    contextMain: {permissions},
  } = useAppContext();
  const updatePermittedRoutes = checkActionRoutePermissions(permissions, 'update');
  const updatePermission = updatePermittedRoutes.includes('/finance/deposit/transit/payment-orders');

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
      return <DepositPaymentOrderNewEntry />;
    } else {
      return <DepositPaymentOrderOverview />;
    }
  }, [currentPath]);

  const getTitle = useMemo(() => {
    switch (activeTab) {
      case Tabs.NewEntry:
        return 'PROLAZNI DEPOZIT - NALOZI ZA PLAĆANJE - UNOS';
      default:
        return 'PROLAZNI DEPOZIT - NALOZI ZA PLAĆANJE - PREGLED';
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
          <StyledTabs
            tabs={updatePermission ? stockTabs : stockTabs.slice(0, 1)}
            activeTab={activeTab}
            onChange={onTabChange}
          />
        </TitleTabsWrapper>
        <Divider style={{marginTop: 0, marginBottom: 20}} height="1px" color={Theme.palette.gray200} />
        {currentFinanceDepositRoute}
      </SectionBox>
    </ScreenWrapper>
  );
};

export default DepositPaymentOrderTabs;
