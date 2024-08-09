import useAppContext from '../../../context/useAppContext.ts';
import {useEffect, useMemo, useState} from 'react';
import {getCurrentTab, stockTabs, Tabs, getRouteName} from './constants.tsx';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper.tsx';
import {CustomDivider, MainTitle, SectionBox, StyledTabs, TitleTabsWrapper} from '../../accounting/styles.tsx';
import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import TaxesOverview from './taxesOverview.tsx';
import AddFee from './addFee/addFee.tsx';
import {checkActionRoutePermissions} from '../../../services/checkRoutePermissions.ts';

const Taxes = () => {
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
      case Tabs.AddTaxes:
        return 'Dodaj takse';

      default:
        return 'TAKSE - PREGLED';
    }
  };

  const currentTaxesRoute = useMemo(() => {
    switch (currentPath) {
      case 'taxes':
        return <TaxesOverview />;
      case 'add-taxes':
        return <AddFee />;
      default:
        return <></>;
    }
  }, [currentPath, activeTab]);

  const onTabChange = (tab: Tab) => {
    setActiveTab(tab.id as number);
    const routeName = getRouteName(tab.title as string);
    navigate(routeName === 'taxes' ? '/finance/fines-taxes/taxes' : '/finance/fines-taxes/taxes/add-taxes');
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
        {currentTaxesRoute}
      </SectionBox>
    </ScreenWrapper>
  );
};

export default Taxes;
