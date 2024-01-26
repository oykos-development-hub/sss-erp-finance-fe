import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper.tsx';
import SectionBox from '../../../shared/sectionBox.ts';
import {contractTabs} from '../../../constants.ts';
import {useState} from 'react';
import {getCurrentTab} from '../../../utils/getCurrentTab.ts';
import useAppContext from '../../../context/useAppContext.ts';
import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import StyledTabsWithTitle from '../../../shared/styledTabsWithTitle/styledTabsWithTitle.tsx';
import {getRouteName} from '../../../utils/getRouteName.ts';
import {NotFound404} from '../../404.tsx';
import ContractsOverview from './contractsOverview/contractsOverview.tsx';
import ContractsEntry from './contractsEntry/contractsEntry.tsx';

const Contracts = () => {
  const {
    navigation: {
      navigate,
      location: {pathname},
    },
  } = useAppContext();
  const [activeTab, setActiveTab] = useState(getCurrentTab(pathname, contractTabs) || 1);
  const onTabChange = (tab: Tab) => {
    setActiveTab(tab.id as number);
    const routeName = getRouteName(tab.title as string, contractTabs);

    if (activeTab !== tab.id) {
      navigate(
        routeName
          ? '/finance/liabilities-receivables/liabilities/contracts/add-contract'
          : '/finance/liabilities-receivables/liabilities/contracts',
      );
    }
  };

  const renderScreen = () => {
    if (pathname === '/finance/liabilities-receivables/liabilities/contracts') return <ContractsOverview />;
    if (pathname === '/finance/liabilities-receivables/liabilities/contracts/add-contract') return <ContractsEntry />;
    return <NotFound404 />;
  };

  return (
    <ScreenWrapper>
      <SectionBox>
        <StyledTabsWithTitle tabs={contractTabs} onChange={onTabChange} activeTab={activeTab} />
        {renderScreen()}
      </SectionBox>
    </ScreenWrapper>
  );
};

export default Contracts;
