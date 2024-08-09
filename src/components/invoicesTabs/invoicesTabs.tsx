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
import {checkActionRoutePermissions} from '../../services/checkRoutePermissions.ts';

const InvoicesTabs = () => {
  const {
    navigation: {
      location: {pathname},
      navigate,
    },
    contextMain: {permissions},
  } = useAppContext();
  const createPermittedRoutes = checkActionRoutePermissions(permissions, 'create');
  const [activeTab, setActiveTab] = useState(getCurrentTab(pathname, invoicesTabs) || 1);

  const onTabChange = (tab: Tab) => {
    setActiveTab(tab.id as number);
    const routeName = getRouteName(tab.title as string, invoicesTabs);

    if (activeTab !== tab.id) {
      navigate(
        routeName
          ? '/finance/liabilities-receivables/liabilities/invoices/add-invoice'
          : '/finance/liabilities-receivables/liabilities/invoices',
      );
    }
  };

  const renderScreen = () => {
    if (pathname === '/finance/liabilities-receivables/liabilities/invoices') return <InvoicesOverview />;
    if (pathname === '/finance/liabilities-receivables/liabilities/invoices/add-invoice') return <InvoiceEntry />;

    return <NotFound404 />;
  };

  useEffect(() => {
    setActiveTab(getCurrentTab(pathname, invoicesTabs) || 1);
  }, [pathname]);

  return (
    <SectionBox>
      <StyledTabsWithTitle
        tabs={
          createPermittedRoutes.includes('/finance/liabilities-receivables/liabilities/invoices')
            ? invoicesTabs
            : invoicesTabs.slice(0, 1)
        }
        onChange={onTabChange}
        activeTab={activeTab}
      />
      {renderScreen()}
    </SectionBox>
  );
};

export default InvoicesTabs;
