import {Typography, DepositIcon} from 'client-library';
import React from 'react';
import {Container, LandingPageTitle} from './styles.ts';
import LandingPageContentBox from '../../../components/landingPageContentBox/landingPageContentBox.tsx';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper.tsx';
import useAppContext from '../../../context/useAppContext.ts';
import {checkActionRoutePermissions} from '../../../services/checkRoutePermissions.ts';

export const FixedDepositLandingPage: React.FC = () => {
  const {
    contextMain: {permissions},
  } = useAppContext();
  const readPermittedRoutes = checkActionRoutePermissions(permissions, 'read');

  return (
    <ScreenWrapper showBreadcrumbs={false}>
      <div>
        <LandingPageTitle>
          <Typography variant="bodyLarge" style={{fontWeight: 600}} content="STALNI DEPOZIT" />
        </LandingPageTitle>
        <Container>
          {readPermittedRoutes.includes('/finance/deposit/fixed/financial') && (
            <LandingPageContentBox
              title={'Finansijski depozit'}
              path={'/finance/deposit/fixed/financial/overview'}
              icon={<DepositIcon />}
            />
          )}
          {readPermittedRoutes.includes('/finance/deposit/fixed/material') && (
            <LandingPageContentBox
              title={'Materijalni depozit'}
              path={'/finance/deposit/fixed/material/overview'}
              icon={<DepositIcon />}
            />
          )}
          {readPermittedRoutes.includes('/finance/deposit/fixed/wills') && (
            <LandingPageContentBox
              title={'Testamentni depozit'}
              path={'/finance/deposit/fixed/wills/overview'}
              icon={<DepositIcon />}
            />
          )}
        </Container>
      </div>
    </ScreenWrapper>
  );
};
