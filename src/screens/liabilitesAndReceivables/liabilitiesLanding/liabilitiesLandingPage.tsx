import {
  FinesIcon,
  FeesIcon,
  ProceduralCostsIcon,
  FlatRateIcon,
  ConfiscationOfIllGottenGainsIcon,
  Typography,
} from 'client-library';
import React from 'react';
import {Container, LandingPageTitle} from '../../landingPage/styles.ts';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper.tsx';
import LandingPageContentBox from '../../../components/landingPageContentBox/landingPageContentBox.tsx';

export const LiabilitiesLandingPage: React.FC = () => {
  return (
    <ScreenWrapper showBreadcrumbs={false}>
      <div>
        <LandingPageTitle>
          <Typography variant="bodyLarge" style={{fontWeight: 600}} content="Kreiranje obaveza" />
        </LandingPageTitle>
        <Container>
          <LandingPageContentBox
            title={'Unos računa'}
            path={'/finance/liabilities-receivables/liabilities/invoices'}
            icon={<FinesIcon />}
          />
          <LandingPageContentBox
            title={'Unos rješenja'}
            path={'/finance/liabilities-receivables/liabilities/decisions'}
            icon={<FeesIcon />}
          />
          <LandingPageContentBox
            title={'Unos ugovora'}
            path={'/finance/liabilities-receivables/liabilities/contracts'}
            icon={<FlatRateIcon />}
          />
          <LandingPageContentBox
            title={'Unos zarada'}
            path={'/finance/liabilities-receivables/liabilities/salaries'}
            icon={<ProceduralCostsIcon />}
          />
          <LandingPageContentBox
            title={'Vezani troškovi'}
            path={'/finance/related-expenses'}
            icon={<ConfiscationOfIllGottenGainsIcon />}
          />
        </Container>
      </div>
    </ScreenWrapper>
  );
};
