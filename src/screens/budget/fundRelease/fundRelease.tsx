import {useEffect, useMemo, useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {fundReleaseTabs, getCurrentTab, getRouteName, Tabs} from './constants.tsx';
import FundReleaseOverview from './fundReleaseOverview.tsx';
import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import {CustomDivider, MainTitle, SectionBox, StyledTabs, TitleTabsWrapper} from '../../accounting/styles.tsx';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper.tsx';
import {useRoleCheck} from '../../../utils/useRoleCheck.ts';
import {UserRole} from '../../../constants.ts';

const FundRelease = () => {
  const {
    navigation: {
      navigate,
      location: {pathname},
    },
    contextMain: {role_id},
  } = useAppContext();

  const [activeTab, setActiveTab] = useState(getCurrentTab(pathname) || 1);
  const currentPath = pathname && pathname.split('/')[pathname.split('/').length - 1];

  const getTitle = () => {
    switch (activeTab) {
      case Tabs.RequestsScreen:
        return 'ZAHTJEVI';

      default:
        return 'OTPUŠTANJE SREDSTAVA';
    }
  };

  const currentFundReleaseRoute = useMemo(() => {
    switch (currentPath) {
      case 'requests':
        return <FundReleaseOverview />;
      default:
        return <FundReleaseOverview />;
    }
  }, [currentPath, activeTab]);

  const onTabChange = (tab: Tab) => {
    console.log(tab, ' - tab');

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
            tabs={fundReleaseTabs(useRoleCheck(role_id, [UserRole.MANAGER_OJ]))}
            activeTab={activeTab}
            onChange={onTabChange}
          />
        </TitleTabsWrapper>
        <CustomDivider style={{marginTop: 0}} />
        {currentFundReleaseRoute}
      </SectionBox>
    </ScreenWrapper>
  );
};

export default FundRelease;
