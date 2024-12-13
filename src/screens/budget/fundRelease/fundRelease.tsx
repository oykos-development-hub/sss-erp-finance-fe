import {useEffect, useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {fundReleaseTabs, getCurrentTab, getRouteName, Tabs} from './constants.tsx';
import FundReleaseOverview from './fundReleaseOverview.tsx';
import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import {CustomDivider, MainTitle, SectionBox, StyledTabs, TitleTabsWrapper} from '../../accounting/styles.tsx';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper.tsx';
import {checkActionRoutePermissions} from '../../../services/checkRoutePermissions.ts';

const FundRelease = () => {
  const {
    navigation: {
      navigate,
      location: {pathname},
    },
    contextMain: {permissions},
  } = useAppContext();

  const [activeTab, setActiveTab] = useState(getCurrentTab(pathname) || 1);

  const getTitle = () => {
    switch (activeTab) {
      case Tabs.RequestsScreen:
        return 'ZAHTJEVI';

      default:
        return 'OTPUŠTANJE SREDSTAVA';
    }
  };

  const updatePermittedRoutes = checkActionRoutePermissions(permissions, 'update');
  const updatePermissions = updatePermittedRoutes.includes('/finance/budget/current/fund-release');
  const createPermittedRoutes = checkActionRoutePermissions(permissions, 'create');
  const createPermissions = createPermittedRoutes.includes('/finance/budget/current/fund-release');

  const onTabChange = (tab: Tab) => {
    setActiveTab(tab.id as number);
    const routeName = getRouteName(tab.title as string);
    navigate(
      routeName === 'requests'
        ? '/finance/budget/current/fund-release/requests'
        : '/finance/budget/current/fund-release',
    );
  };

  useEffect(() => {
    setActiveTab(getCurrentTab(pathname) || 1);
  }, [pathname]);

  return (
    <ScreenWrapper>
      <SectionBox>
        <TitleTabsWrapper>
          <MainTitle variant="bodyMedium" content={getTitle()} style={{marginBottom: 0}} />
          <StyledTabs
            tabs={fundReleaseTabs(!createPermissions || !updatePermissions)}
            activeTab={activeTab}
            onChange={onTabChange}
          />
        </TitleTabsWrapper>
        <CustomDivider style={{marginTop: 0}} />
        <FundReleaseOverview />
      </SectionBox>
    </ScreenWrapper>
  );
};

export default FundRelease;
