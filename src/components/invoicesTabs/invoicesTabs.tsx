import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import {useEffect, useState} from 'react';
import {invoicesTabs} from '../../constants';
import SectionBox from '../../shared/sectionBox';
import {getRouteName} from '../../utils/getRouteName';
import useAppContext from '../../context/useAppContext';
import {NotFound404} from '../../screens/404';
import InvoicesOverview from '../../screens/liabilitesAndReceivables/invoices/invoicesOverview/invoicesOverview';
import InvoiceEntry from '../../screens/liabilitesAndReceivables/invoices/invoiceEntry/InvoiceEntry';
import StyledTabsWithTitle from '../../shared/styledTabsWithTitle/styledTabsWithTitle.tsx';
import {getCurrentTab} from '../../utils/getCurrentTab.ts';

const InvoicesTabs = () => {
  const {
    navigation: {
      location: {pathname},
      navigate,
    },
  } = useAppContext();
  const [activeTab, setActiveTab] = useState(getCurrentTab(pathname, invoicesTabs) || 1);

  const onTabChange = (tab: Tab) => {
    setActiveTab(tab.id as number);
    const routeName = getRouteName(tab.title as string, invoicesTabs);

    if (activeTab !== tab.id) {
      navigate(
        routeName
          ? '/finance/liabilities-receivables/invoices/add-invoice'
          : '/finance/liabilities-receivables/invoices',
      );
    }
  };

  const renderScreen = () => {
    if (pathname === '/finance/liabilities-receivables/invoices') return <InvoicesOverview />;
    if (pathname === '/finance/liabilities-receivables/invoices/add-invoice') return <InvoiceEntry />;
    return <NotFound404 />;
  };

  useEffect(() => {
    setActiveTab(getCurrentTab(pathname, invoicesTabs) || 1);
  }, [pathname]);

  return (
    <SectionBox>
      <StyledTabsWithTitle tabs={invoicesTabs} onChange={onTabChange} activeTab={activeTab} />
      {renderScreen()}
    </SectionBox>
  );
};

export default InvoicesTabs;
