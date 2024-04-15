import {Typography, DepositIcon} from 'client-library';
import React from 'react';
import {Container, LandingPageTitle} from './styles.ts';
import LandingPageContentBox from '../../../components/landingPageContentBox/landingPageContentBox.tsx';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper.tsx';

export const DepositLandingPage: React.FC = () => {
  //TO DO add another icons
  return (
    <ScreenWrapper showBreadcrumbs={false}>
      <div>
        <LandingPageTitle>
          <Typography variant="bodyLarge" style={{fontWeight: 600}} content="DEPOZIT" />
        </LandingPageTitle>
        <Container>
          <LandingPageContentBox title={'Stalni depozit'} path={'/finance/deposit/fixed'} icon={<DepositIcon />} />
          <LandingPageContentBox title={'Prolazni depozit'} path={'/finance/deposit/transit'} icon={<DepositIcon />} />
        </Container>
      </div>
    </ScreenWrapper>
  );
};
