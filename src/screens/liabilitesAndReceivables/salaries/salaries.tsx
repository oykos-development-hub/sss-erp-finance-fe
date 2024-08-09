import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper.tsx';
import SectionBox from '../../../shared/sectionBox.ts';
import {salariesTabs} from '../../../constants.ts';
import {useState} from 'react';
import {getCurrentTab} from '../../../utils/getCurrentTab.ts';
import useAppContext from '../../../context/useAppContext.ts';
import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import StyledTabsWithTitle from '../../../shared/styledTabsWithTitle/styledTabsWithTitle.tsx';
import {getRouteName} from '../../../utils/getRouteName.ts';
import {NotFound404} from '../../404.tsx';
import SalaryForm from './salaryForm/salaryForm.tsx';
import SalariesOverview from './salariesOverview/salariesOverview.tsx';
import {checkActionRoutePermissions} from '../../../services/checkRoutePermissions.ts';

const Salaries = () => {
  const {
    navigation: {
      navigate,
      location: {pathname},
    },
    contextMain: {permissions},
  } = useAppContext();
  const createPermittedRoutes = checkActionRoutePermissions(permissions, 'create');
  const [activeTab, setActiveTab] = useState(getCurrentTab(pathname, salariesTabs) || 1);
  const onTabChange = (tab: Tab) => {
    setActiveTab(tab.id as number);
    const routeName = getRouteName(tab.title as string, salariesTabs);

    if (activeTab !== tab.id) {
      navigate(
        routeName
          ? '/finance/liabilities-receivables/liabilities/salaries/add-salary'
          : '/finance/liabilities-receivables/liabilities/salaries',
      );
    }
  };

  const renderScreen = () => {
    if (pathname === '/finance/liabilities-receivables/liabilities/salaries') return <SalariesOverview />;
    if (pathname === '/finance/liabilities-receivables/liabilities/salaries/add-salary') return <SalaryForm />;
    return <NotFound404 />;
  };

  return (
    <ScreenWrapper>
      <SectionBox>
        <StyledTabsWithTitle
          tabs={
            createPermittedRoutes.includes('/finance/liabilities-receivables/liabilities/salaries')
              ? salariesTabs
              : salariesTabs.splice(0, 1)
          }
          onChange={onTabChange}
          activeTab={activeTab}
        />
        {renderScreen()}
      </SectionBox>
    </ScreenWrapper>
  );
};

export default Salaries;
