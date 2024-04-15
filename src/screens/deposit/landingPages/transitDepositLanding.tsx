import {DepositIcon, Typography} from 'client-library';
import React from 'react';
import LandingPageContentBox from '../../../components/landingPageContentBox/landingPageContentBox.tsx';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper.tsx';
import {Container, LandingPageTitle} from './styles.ts';

const TransitDepositLandingPage: React.FC = () => {
  //todo: add another icons
  return (
    <ScreenWrapper showBreadcrumbs={false}>
      <div>
        <LandingPageTitle>
          <Typography variant="bodyLarge" style={{fontWeight: 600}} content="PROLAZNI DEPOZIT" />
        </LandingPageTitle>
        <Container>
          <LandingPageContentBox
            title={'Uplata na račun'}
            path={'/finance/deposit/transit/payments/overview'}
            icon={<DepositIcon />}
          />
          <LandingPageContentBox
            title={'Nalozi za plaćanje'}
            path={'/finance/deposit/transit/payment-orders/overview'}
            icon={<DepositIcon />}
          />
          <LandingPageContentBox
            title={'Obračuni poreza i doprinosa'}
            path={'/finance/deposit/transit/tax-calculation'}
            icon={<DepositIcon />}
          />
        </Container>
      </div>
    </ScreenWrapper>
  );
};

export default TransitDepositLandingPage;
