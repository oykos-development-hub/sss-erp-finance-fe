import {FeesIcon, FinesIcon, Typography} from 'client-library';
import React from 'react';
import LandingPageContentBox from '../../../components/landingPageContentBox/landingPageContentBox.tsx';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper.tsx';
import {Container, LandingPageTitle} from '../../landingPage/styles.ts';

export const ReceivablesLandingPage: React.FC = () => {
  return (
    <ScreenWrapper showBreadcrumbs={false}>
      <div>
        <LandingPageTitle>
          <Typography variant="bodyLarge" style={{fontWeight: 600}} content="Nalozi" />
        </LandingPageTitle>
        <Container>
          <LandingPageContentBox
            title={'Kreiranje naloga'}
            path={'/finance/liabilities-receivables/receivables/payment-orders'}
            icon={<FinesIcon />}
          />
          <LandingPageContentBox
            title={'Prinudne naplate'}
            path={'/finance/liabilities-receivables/receivables/enforced-payments'}
            icon={<FeesIcon />}
          />
        </Container>
      </div>
    </ScreenWrapper>
  );
};
