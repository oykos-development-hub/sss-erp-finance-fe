import {Typography, DepositIcon} from 'client-library';
import React from 'react';
import {Container, LandingPageTitle} from './styles.ts';
import LandingPageContentBox from '../../../components/landingPageContentBox/landingPageContentBox.tsx';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper.tsx';

export const FixedDepositLandingPage: React.FC = () => {
  //TO DO add another icons
  return (
    <ScreenWrapper showBreadcrumbs={false}>
      <div>
        <LandingPageTitle>
          <Typography variant="bodyLarge" style={{fontWeight: 600}} content="STALNI DEPOZIT" />
        </LandingPageTitle>
        <Container>
          <LandingPageContentBox
            title={'Finansijski depozit'}
            path={'/finance/deposit/fixed/financial/overview'}
            icon={<DepositIcon />}
          />
          <LandingPageContentBox
            title={'Materijalni depozit'}
            path={'/finance/deposit/fixed/material/overview'}
            icon={<DepositIcon />}
          />
          <LandingPageContentBox
            title={'Testamentni depozit'}
            path={'/finance/deposit/fixed/will'}
            icon={<DepositIcon />}
          />
        </Container>
      </div>
    </ScreenWrapper>
  );
};
