import {FinesIcon, FeesIcon, Typography} from 'client-library';
import React from 'react';
import {Container, LandingPageTitle} from '../landingPage/styles.ts';
import ScreenWrapper from '../../shared/screenWrapper/screenWrapper.tsx';
import LandingPageContentBox from '../../components/landingPageContentBox/landingPageContentBox.tsx';

export const LiabilitiesReceivablesLandingPage: React.FC = () => {
  return (
    <ScreenWrapper showBreadcrumbs={false}>
      <div>
        <LandingPageTitle>
          <Typography variant="bodyLarge" style={{fontWeight: 600}} content="Obaveze i potraživanja" />
        </LandingPageTitle>
        <Container>
          <LandingPageContentBox
            title={'Kreiranje obaveza'}
            path={'/finance/liabilities-receivables/liabilities'}
            icon={<FinesIcon />}
          />
          <LandingPageContentBox
            title={'Kreiranje naloga'}
            path={'/finance/liabilities-receivables/receivables'}
            icon={<FeesIcon />}
          />
        </Container>
      </div>
    </ScreenWrapper>
  );
};
