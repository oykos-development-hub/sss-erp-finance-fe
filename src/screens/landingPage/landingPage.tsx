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

export const LandingPage: React.FC = () => {
  return (
    <ScreenWrapper showBreadcrumbs={false}>
      <div>
        <LandingPageTitle>
          <Typography variant="bodyLarge" style={{fontWeight: 600}} content="Finansije" />
        </LandingPageTitle>
        <Container>
          <LandingPageContentBox title={'Budžet'} path={'/finance/budget'} icon={<BudgetIcon />} />
          <LandingPageContentBox
            title={'Obaveze i potraživanja'}
            path={'/finance/liabilities-receivables'}
            icon={<LiabilitiesReceivablesIcon />}
          />
          <LandingPageContentBox title={'Računovodstvo'} path={'/finance/accounting'} icon={<AccountingIcon />} />
          <LandingPageContentBox title={'Blagajna'} path={'/finance/cash-register'} icon={<CashRegisterIcon />} />
          <LandingPageContentBox title={'Depozit'} path={'/finance/deposit'} icon={<DepositIcon />} />
          <LandingPageContentBox title={'Kazne i takse'} path={'/finance/fines-taxes'} icon={<FinesTaxesIcon />} />
          <LandingPageContentBox title={'Izvještaji'} path={'/finance/reports'} icon={<ReportIcon />} />
        </Container>
      </div>
    </ScreenWrapper>
  );
};
