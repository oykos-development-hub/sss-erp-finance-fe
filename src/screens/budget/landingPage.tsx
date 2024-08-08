import {BuildingsIcon, ECommerceIcon, Typography} from 'client-library';
import React from 'react';
import ScreenWrapper from '../../shared/screenWrapper/screenWrapper';
import {Container, LandingPageTitle} from '../landingPage/styles.ts';
import LandingPageContentBox from '../../components/landingPageContentBox/landingPageContentBox.tsx';
import {checkActionRoutePermissions} from '../../services/checkRoutePermissions.ts';
import useAppContext from '../../context/useAppContext.ts';

const BUDGET: React.FC = () => {
  const {
    contextMain: {permissions},
  } = useAppContext();
  const readPermittedRoutes = checkActionRoutePermissions(permissions, 'read');

  return (
    <ScreenWrapper showBreadcrumbs={false}>
      <div>
        <LandingPageTitle>
          <Typography variant="bodyLarge" style={{fontWeight: 600}} content="BUDŽET" />
        </LandingPageTitle>
        <Container>
          {readPermittedRoutes.includes('/finance/budget/planning') && (
            <LandingPageContentBox
              path={'/finance/budget/planning'}
              title={'Planiranje budžeta'}
              icon={<ECommerceIcon />}
            />
          )}
          {readPermittedRoutes.includes('/finance/budget/current') && (
            <LandingPageContentBox path={'/finance/budget/current'} title={'Tekući budžet'} icon={<BuildingsIcon />} />
          )}
        </Container>
      </div>
    </ScreenWrapper>
  );
};

export default BUDGET;
