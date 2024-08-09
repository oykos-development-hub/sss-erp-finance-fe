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
import useAppContext from '../../context/useAppContext.ts';
import {checkActionRoutePermissions} from '../../services/checkRoutePermissions.ts';

export const LandingPage: React.FC = () => {
  const {
    contextMain: {permissions},
  } = useAppContext();
  const readPermittedRoutes = checkActionRoutePermissions(permissions, 'read');

  return (
    <ScreenWrapper showBreadcrumbs={false}>
      <div>
        <LandingPageTitle>
          <Typography variant="bodyLarge" style={{fontWeight: 600}} content="Kazne i takse" />
        </LandingPageTitle>
        <Container>
          {readPermittedRoutes.includes('/finance/fines-taxes/fines') && (
            <LandingPageContentBox title={'Kazne'} path={'/finance/fines-taxes/fines'} icon={<FinesIcon />} />
          )}
          {readPermittedRoutes.includes('/finance/fines-taxes/taxes') && (
            <LandingPageContentBox title={'Takse'} path={'/finance/fines-taxes/taxes'} icon={<FeesIcon />} />
          )}
          {readPermittedRoutes.includes('/finance/fines-taxes/procedural-costs') && (
            <LandingPageContentBox
              title={'Troškovi postupka'}
              path={'/finance/fines-taxes/procedural-costs'}
              icon={<ProceduralCostsIcon />}
            />
          )}
          {readPermittedRoutes.includes('/finance/fines-taxes/flat-rate') && (
            <LandingPageContentBox title={'Paušal'} path={'/finance/fines-taxes/flat-rate'} icon={<FlatRateIcon />} />
          )}
          {readPermittedRoutes.includes('/finance/fines-taxes/confiscation') && (
            <LandingPageContentBox
              title={'Oduzimanje imovinske koristi'}
              path={'/finance/fines-taxes/confiscation'}
              icon={<ConfiscationOfIllGottenGainsIcon />}
            />
          )}
        </Container>
      </div>
    </ScreenWrapper>
  );
};
