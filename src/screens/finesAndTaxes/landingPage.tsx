import {
  FinesIcon,
  FeesIcon,
  ProceduralCostsIcon,
  FlatRateIcon,
  ConfiscationOfIllGottenGainsIcon,
  Typography,
} from 'client-library';
import React from 'react';
import {Container, LandingPageTitle} from '../landingPage/styles.ts';
import ScreenWrapper from '../../shared/screenWrapper/screenWrapper.tsx';
import LandingPageContentBox from '../../components/landingPageContentBox/landingPageContentBox.tsx';

export const LandingPage: React.FC = () => {
  return (
    <ScreenWrapper showBreadcrumbs={false}>
      <div>
        <LandingPageTitle>
          <Typography variant="bodyLarge" style={{fontWeight: 600}} content="Kazne i takse" />
        </LandingPageTitle>
        <Container>
          <LandingPageContentBox title={'Kazne'} path={'/finance/fines-taxes/fines'} icon={<FinesIcon />} />
          <LandingPageContentBox title={'Takse'} path={'/finance/fines-taxes/fees'} icon={<FeesIcon />} />
          <LandingPageContentBox
            title={'Troškovi postupka'}
            path={'/finance/fines-taxes/procedural-costs'}
            icon={<ProceduralCostsIcon />}
          />
          <LandingPageContentBox title={'Paušal'} path={'/finance/fines-taxes/flat-rate'} icon={<FlatRateIcon />} />
          <LandingPageContentBox
            title={'Oduzimanje imovinske koristi'}
            path={'/finance/fines-taxes/confiscation-of-material-gains'}
            icon={<ConfiscationOfIllGottenGainsIcon />}
          />
        </Container>
      </div>
    </ScreenWrapper>
  );
};
