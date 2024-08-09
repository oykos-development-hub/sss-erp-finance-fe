import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import {useEffect, useMemo, useState} from 'react';
import useAppContext from '../../../context/useAppContext';
import {CustomDivider, StyledTabs, TitleTabsWrapper} from '../../accounting/styles';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper';
import SectionBox from '../../../shared/sectionBox';
import {MainTitle} from '../../../shared/pageElements';
import {Tabs, contractTabs, getCurrentTab, getRouteName} from './constants';
import ContractsEntry from './contractsEntry/contractsEntry';
import ContractsOverview from './contractsOverview/contractsOverview';
import {checkActionRoutePermissions} from '../../../services/checkRoutePermissions.ts';

export const Contracts = () => {
  const {
    navigation: {
      navigate,
      location: {pathname},
    },
    contextMain: {permissions},
  } = useAppContext();
  const createPermittedRoutes = checkActionRoutePermissions(permissions, 'create');
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
      case 'add-contract':
        return <ContractsEntry />;
      default:
        return <ContractsOverview />;
    }
  }, [currentAccountingPath]);

  const getTitle = () => {
    switch (activeTab) {
      case Tabs.AddContract:
        return 'UNOS UGOVORA';

      default:
        return 'PREGLED UGOVORA';
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
          <StyledTabs
            tabs={
              createPermittedRoutes.includes('/finance/liabilities-receivables/liabilities/contracts')
                ? contractTabs
                : contractTabs.splice(0, 1)
            }
            activeTab={activeTab}
            onChange={onTabChange}
          />
        </TitleTabsWrapper>
        <CustomDivider style={{marginTop: 0}} />
        {currentAccountingRoute}
      </SectionBox>
    </ScreenWrapper>
  );
};
