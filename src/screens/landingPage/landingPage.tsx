import {
  BudgetIcon,
  LiabilitiesReceivablesIcon,
  AccountingIcon,
  CashRegisterIcon,
  DepositIcon,
  FinesTaxesIcon,
  Typography,
  ReportIcon,
} from 'client-library';
import React from 'react';
import {Container, LandingPageTitle} from './styles';
import ScreenWrapper from '../../shared/screenWrapper/screenWrapper.tsx';
import LandingPageContentBox from '../../components/landingPageContentBox/landingPageContentBox.tsx';
import useAppContext from '../../context/useAppContext.ts';
import {checkRoutePermissions} from '../../services/checkRoutePermissions.ts';

export const LandingPage: React.FC = () => {
  const {contextMain} = useAppContext();
  const allowedRoutes = checkRoutePermissions(contextMain?.permissions);

  return (
    <ScreenWrapper showBreadcrumbs={false}>
      <div>
        <LandingPageTitle>
          <Typography variant="bodyLarge" style={{fontWeight: 600}} content="Finansije" />
        </LandingPageTitle>
        <Container>
          {allowedRoutes.includes('/finance/budget') && (
            <LandingPageContentBox title={'Budžet'} path={'/finance/budget'} icon={<BudgetIcon />} />
          )}
          {allowedRoutes.includes('/finance/liabilities-receivables') && (
            <LandingPageContentBox
              title={'Obaveze i potraživanja'}
              path={'/finance/liabilities-receivables'}
              icon={<LiabilitiesReceivablesIcon />}
            />
          )}
          {allowedRoutes.includes('/finance/accounting') && (
            <LandingPageContentBox title={'Računovodstvo'} path={'/finance/accounting'} icon={<AccountingIcon />} />
          )}
          {allowedRoutes.includes('/finance/cash-register') && (
            <LandingPageContentBox title={'Blagajna'} path={'/finance/cash-register'} icon={<CashRegisterIcon />} />
          )}
          {allowedRoutes.includes('/finance/deposit') && (
            <LandingPageContentBox title={'Depozit'} path={'/finance/deposit'} icon={<DepositIcon />} />
          )}
          {allowedRoutes.includes('/finance/fines-taxes') && (
            <LandingPageContentBox title={'Kazne i takse'} path={'/finance/fines-taxes'} icon={<FinesTaxesIcon />} />
          )}
          {allowedRoutes.includes('/finance/reports') && (
            <LandingPageContentBox title={'Izvještaji'} path={'/finance/reports'} icon={<ReportIcon />} />
          )}
        </Container>
      </div>
    </ScreenWrapper>
  );
};
