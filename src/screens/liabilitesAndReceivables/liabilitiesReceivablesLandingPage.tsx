import {FinesIcon, FeesIcon, Typography} from 'client-library';
import React from 'react';
import {Container, LandingPageTitle} from '../landingPage/styles.ts';
import ScreenWrapper from '../../shared/screenWrapper/screenWrapper.tsx';
import LandingPageContentBox from '../../components/landingPageContentBox/landingPageContentBox.tsx';
import useAppContext from '../../context/useAppContext.ts';
import {checkActionRoutePermissions} from '../../services/checkRoutePermissions.ts';

export const LiabilitiesReceivablesLandingPage: React.FC = () => {
  const {
    contextMain: {permissions},
  } = useAppContext();
  const readPermittedRoutes = checkActionRoutePermissions(permissions, 'read');

  return (
    <ScreenWrapper showBreadcrumbs={false}>
      <div>
        <LandingPageTitle>
          <Typography variant="bodyLarge" style={{fontWeight: 600}} content="Obaveze i potraživanja" />
        </LandingPageTitle>
        <Container>
          {readPermittedRoutes.includes('/finance/liabilities-receivables/liabilities') && (
            <LandingPageContentBox
              title={'Obaveze'}
              path={'/finance/liabilities-receivables/liabilities'}
              icon={<FinesIcon />}
            />
          )}
          {readPermittedRoutes.includes('/finance/liabilities-receivables/receivables') && (
            <LandingPageContentBox
              title={'Nalozi'}
              path={'/finance/liabilities-receivables/receivables'}
              icon={<FeesIcon />}
            />
          )}
        </Container>
      </div>
    </ScreenWrapper>
  );
};
