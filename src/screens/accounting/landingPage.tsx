import {FileInvoice, SafeRetrieval, Typography, DocumentForAccounting, RefundsIcon} from 'client-library';
import React from 'react';
import ScreenWrapper from '../../shared/screenWrapper/screenWrapper';
import {Container, LandingPageTitle} from '../landingPage/styles.ts';
import LandingPageContentBox from '../../components/landingPageContentBox/landingPageContentBox.tsx';

const ACCOUNTING: React.FC = () => {
  return (
    <ScreenWrapper showBreadcrumbs={false}>
      <div>
        <LandingPageTitle>
          <Typography variant="bodyLarge" style={{fontWeight: 600}} content="RAČUNOVODSTVO" />
        </LandingPageTitle>
        <Container>
          <LandingPageContentBox
            path={'/finance/accounting/obligations'}
            title={'Knjiženje obaveza'}
            icon={<SafeRetrieval />}
          />
          <LandingPageContentBox
            path={'/finance/accounting/payment-orders'}
            title={'Knjiženje naloga za plaćanje'}
            icon={<FileInvoice />}
          />
          <LandingPageContentBox
            path={'/finance/accounting/enforced-payments'}
            title={'Knjiženje prinudnih naplata'}
            icon={<DocumentForAccounting />}
          />
          <LandingPageContentBox
            path={'/finance/accounting/returned-enforced-payments'}
            title={'Knjiženje povrata prinudnih naplata'}
            icon={<RefundsIcon />}
          />
        </Container>
      </div>
    </ScreenWrapper>
  );
};

export default ACCOUNTING;
