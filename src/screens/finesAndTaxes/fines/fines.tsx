import useAppContext from '../../../context/useAppContext.ts';
import {useEffect, useMemo, useState} from 'react';
import {getCurrentTab, stockTabs, Tabs, getRouteName} from './constants.ts';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper.tsx';
import {CustomDivider, MainTitle, SectionBox, StyledTabs, TitleTabsWrapper} from '../../accounting/styles.tsx';
import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import FinesOverview from './finesOverview.tsx';
import AddFines from './addFines/addFines.tsx';

const Fines = () => {
  const {
    navigation: {
      navigate,
      location: {pathname},
    },
  } = useAppContext();
  const [activeTab, setActiveTab] = useState(getCurrentTab(pathname) || 1);
  const currentPath = pathname && pathname.split('/')[pathname.split('/').length - 1];

  const getTitle = () => {
    switch (activeTab) {
      case Tabs.AddFines:
        return 'Dodaj kaznu';

      default:
        return 'KAZNE - PREGLED';
    }
  };

  const currentFinesRoute = useMemo(() => {
    switch (currentPath) {
      case 'fines':
        return <FinesOverview />;
      case 'add-fines':
        return <AddFines />;
      default:
        return <></>;
    }
  }, [currentPath, activeTab]);

  const onTabChange = (tab: Tab) => {
    console.log(tab, ' - tab');

    setActiveTab(tab.id as number);
    const routeName = getRouteName(tab.title as string);
    // if (activeTab !== tab.id) {
    navigate(routeName === 'fines' ? '/finance/fines-taxes/fines' : '/finance/fines-taxes/fines/add-fines');
    // }
  };

  useEffect(() => {
    setActiveTab(getCurrentTab(pathname) || 1);
  }, [pathname]);

  return (
    <ScreenWrapper>
      <SectionBox>
        <TitleTabsWrapper>
          <MainTitle variant="bodyMedium" content={getTitle()} style={{marginBottom: 0}} />
          <StyledTabs tabs={stockTabs} activeTab={activeTab} onChange={onTabChange} />
        </TitleTabsWrapper>
        <CustomDivider style={{marginTop: 0}} />
        {currentFinesRoute}
      </SectionBox>
    </ScreenWrapper>
  );
};

export default Fines;
