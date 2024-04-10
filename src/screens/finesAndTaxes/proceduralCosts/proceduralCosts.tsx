import useAppContext from '../../../context/useAppContext.ts';
import {useEffect, useMemo, useState} from 'react';
import {getCurrentTab, stockTabs, Tabs, getRouteName} from './constants.tsx';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper.tsx';
import {CustomDivider, MainTitle, SectionBox, StyledTabs, TitleTabsWrapper} from '../../accounting/styles.tsx';
import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import ProceduralCostsOverview from './proceduralCostsOverview.tsx';
import AddProceduralCosts from './addProceduralCosts/addProceduralCosts.tsx';

const ProceduralCosts = () => {
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
      case Tabs.AddScreen:
        return 'Detalji troškova postupka';

      default:
        return 'TROŠKOVI POSTUPKA - PREGLED';
    }
  };

  const currentFinesRoute = useMemo(() => {
    switch (currentPath) {
      case 'procedural-costs':
        return <ProceduralCostsOverview />;
      case 'add-procedural-costs':
        return <AddProceduralCosts />;
      default:
        return <></>;
    }
  }, [currentPath, activeTab]);

  const onTabChange = (tab: Tab) => {
    console.log(tab, ' - tab');

    setActiveTab(tab.id as number);
    const routeName = getRouteName(tab.title as string);
    navigate(
      routeName === 'procedural-costs'
        ? '/finance/fines-taxes/procedural-costs'
        : '/finance/fines-taxes/procedural-costs/add-procedural-costs',
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
          <StyledTabs tabs={stockTabs} activeTab={activeTab} onChange={onTabChange} />
        </TitleTabsWrapper>
        <CustomDivider style={{marginTop: 0}} />
        {currentFinesRoute}
      </SectionBox>
    </ScreenWrapper>
  );
};

export default ProceduralCosts;
