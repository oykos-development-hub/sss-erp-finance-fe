import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import {useEffect, useMemo, useState} from 'react';
import {Tabs, getCurrentTab, getRouteName, stockTabs} from './constants';
import {CustomDivider, MainTitle, SectionBox, StyledTabs, TitleTabsWrapper} from './styles';
import useAppContext from '../../../context/useAppContext';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper';
import CurrentBudget from './currentBudgetPreview';
import {RequestsPage} from './requests';

export const CurrentBudgetTabs = () => {
  const {
    navigation: {
      navigate,
      location: {pathname},
    },
  } = useAppContext();
  const [activeTab, setActiveTab] = useState(getCurrentTab(location.pathname) || 1);
  const currentBudgetPath = pathname && pathname.split('/')[pathname.split('/').length - 1];

  const onTabChange = (tab: Tab) => {
    setActiveTab(tab.id as number);
    const routeName = getRouteName(tab.title as string);

    const pathname = location.pathname.split('/');
    pathname.pop();

    navigate(`${pathname.join('/')}/${routeName}`);
  };

  const currentBudgetRoute = useMemo(() => {
    switch (currentBudgetPath) {
      case 'requests':
        return <RequestsPage />;
      default:
        return <CurrentBudget />;
    }
  }, [currentBudgetPath]);

  const getTitle = () => {
    switch (activeTab) {
      case Tabs.Requests:
        return 'ZAHTJEVI';

      default:
        return 'PREGLED TEKUĆEG BUDŽETA';
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
          <StyledTabs tabs={stockTabs} activeTab={activeTab} onChange={onTabChange} />
        </TitleTabsWrapper>
        <CustomDivider style={{marginTop: 0}} />
        {currentBudgetRoute}
      </SectionBox>
    </ScreenWrapper>
  );
};
