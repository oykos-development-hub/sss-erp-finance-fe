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
import useAppContext from '../../../context/useAppContext.ts';
import {checkActionRoutePermissions} from '../../../services/checkRoutePermissions.ts';

export const LiabilitiesLandingPage: React.FC = () => {
  const {
    contextMain: {permissions},
  } = useAppContext();
  const readPermittedRoutes = checkActionRoutePermissions(permissions, 'read');

  return (
    <ScreenWrapper showBreadcrumbs={false}>
      <div>
        <LandingPageTitle>
          <Typography variant="bodyLarge" style={{fontWeight: 600}} content="Obaveze" />
        </LandingPageTitle>
        <Container>
          {readPermittedRoutes.includes('/finance/liabilities-receivables/liabilities/invoices') && (
            <LandingPageContentBox
              title={'Unos računa'}
              path={'/finance/liabilities-receivables/liabilities/invoices'}
              icon={<FinesIcon />}
            />
          )}
          {readPermittedRoutes.includes('/finance/liabilities-receivables/liabilities/decisions') && (
            <LandingPageContentBox
              title={'Unos rješenja'}
              path={'/finance/liabilities-receivables/liabilities/decisions'}
              icon={<FeesIcon />}
            />
          )}
          {readPermittedRoutes.includes('/finance/liabilities-receivables/liabilities/contracts') && (
            <LandingPageContentBox
              title={'Unos ugovora'}
              path={'/finance/liabilities-receivables/liabilities/contracts'}
              icon={<FlatRateIcon />}
            />
          )}
          {readPermittedRoutes.includes('/finance/liabilities-receivables/liabilities/salaries') && (
            <LandingPageContentBox
              title={'Unos zarada'}
              path={'/finance/liabilities-receivables/liabilities/salaries'}
              icon={<ProceduralCostsIcon />}
            />
          )}
          {readPermittedRoutes.includes('/finance/liabilities-receivables/liabilities/related-expenses') && (
            <LandingPageContentBox
              title={'Vezani troškovi'}
              path={'/finance/liabilities-receivables/liabilities/related-expenses'}
              icon={<ConfiscationOfIllGottenGainsIcon />}
            />
          )}
        </Container>
      </div>
    </ScreenWrapper>
  );
};
