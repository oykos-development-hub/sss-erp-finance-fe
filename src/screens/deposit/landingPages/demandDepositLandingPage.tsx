import {Typography, DepositIcon} from 'client-library';
import React from 'react';
import {Container, LandingPageTitle} from './styles.ts';
import LandingPageContentBox from '../../../components/landingPageContentBox/landingPageContentBox.tsx';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper.tsx';

export const DemandDepositLandingPage: React.FC = () => {
  //TO DO add another icons
  return (
    <ScreenWrapper showBreadcrumbs={false}>
      <div>
        <LandingPageTitle>
          <Typography variant="bodyLarge" style={{fontWeight: 600}} content="PROLAZNI DEPOZIT" />
        </LandingPageTitle>
        <Container>
          <LandingPageContentBox
            title={'Početno stanje'}
            path={'/finance/deposit/demand/initial-state'}
            icon={<DepositIcon />}
          />
          <LandingPageContentBox
            title={'Uplata na račun'}
            path={'/finance/deposit/demand/payment'}
            icon={<DepositIcon />}
          />
          <LandingPageContentBox
            title={'Obračuni poreza i doprinosa'}
            path={'/finance/deposit/demand/tax-contribution-calculation'}
            icon={<DepositIcon />}
          />
          <LandingPageContentBox
            title={'Nalozi za plaćanje'}
            path={'/finance/deposit/demand/payment-orders'}
            icon={<DepositIcon />}
          />
        </Container>
      </div>
    </ScreenWrapper>
  );
};
