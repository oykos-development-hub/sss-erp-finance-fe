import useAppContext from '../../../context/useAppContext.ts';
import {useEffect, useMemo, useState} from 'react';
import {getCurrentTab, stockTabs, Tabs, getRouteName} from './constants.tsx';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper.tsx';
import {CustomDivider, MainTitle, SectionBox, StyledTabs, TitleTabsWrapper} from '../../accounting/styles.tsx';
import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import ConfiscationOverview from './confiscationOverview.tsx';
import AddPropertyBenefitsConfiscation from './addPropertyBenefitsConfiscation/addPropertyBenefitsConfiscation.tsx';
import {checkActionRoutePermissions} from '../../../services/checkRoutePermissions.ts';

const Confiscation = () => {
  const {
    navigation: {
      navigate,
      location: {pathname},
    },
    contextMain: {permissions},
  } = useAppContext();

  const createPermittedRoutes = checkActionRoutePermissions(permissions, 'create');
  const createPermission = createPermittedRoutes.includes('/finance/fines-taxes/taxes');
  const [activeTab, setActiveTab] = useState(getCurrentTab(pathname) || 1);
  const currentPath = pathname && pathname.split('/')[pathname.split('/').length - 1];

  const getTitle = () => {
    switch (activeTab) {
      case Tabs.AddScreen:
        return 'Detalji oduzimanja imovinske koristi';

      default:
        return 'ODUZIMANJE IMOVINSKE KORISTI - PREGLED';
    }
  };

  const currentRoute = useMemo(() => {
    switch (currentPath) {
      case 'confiscation':
        return <ConfiscationOverview />;
      case 'add-confiscation':
        return <AddPropertyBenefitsConfiscation />;
      default:
        return <></>;
    }
  }, [currentPath, activeTab]);

  const onTabChange = (tab: Tab) => {
    console.log(tab, ' - tab');

    setActiveTab(tab.id as number);
    const routeName = getRouteName(tab.title as string);
    navigate(
      routeName === 'confiscation'
        ? '/finance/fines-taxes/confiscation'
        : '/finance/fines-taxes/confiscation/add-confiscation',
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
            tabs={createPermission ? stockTabs : stockTabs.slice(0, 1)}
            activeTab={activeTab}
            onChange={onTabChange}
          />
        </TitleTabsWrapper>
        <CustomDivider style={{marginTop: 0}} />
        {currentRoute}
      </SectionBox>
    </ScreenWrapper>
  );
};

export default Confiscation;
