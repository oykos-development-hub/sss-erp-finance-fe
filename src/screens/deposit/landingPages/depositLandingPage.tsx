import {Typography, DepositIcon} from 'client-library';
import React from 'react';
import {Container, LandingPageTitle} from './styles.ts';
import LandingPageContentBox from '../../../components/landingPageContentBox/landingPageContentBox.tsx';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper.tsx';
import {checkActionRoutePermissions} from '../../../services/checkRoutePermissions.ts';
import useAppContext from '../../../context/useAppContext.ts';

export const DepositLandingPage: React.FC = () => {
  const {
    contextMain: {permissions},
  } = useAppContext();
  const readPermittedRoutes = checkActionRoutePermissions(permissions, 'read');

  return (
    <ScreenWrapper showBreadcrumbs={false}>
      <div>
        <LandingPageTitle>
          <Typography variant="bodyLarge" style={{fontWeight: 600}} content="DEPOZIT" />
        </LandingPageTitle>
        <Container>
          {readPermittedRoutes.includes('/finance/deposit/fixed') && (
            <LandingPageContentBox title={'Stalni depozit'} path={'/finance/deposit/fixed'} icon={<DepositIcon />} />
          )}
          {readPermittedRoutes.includes('/finance/deposit/transit') && (
            <LandingPageContentBox
              title={'Prolazni račun depozita'}
              path={'/finance/deposit/transit'}
              icon={<DepositIcon />}
            />
          )}
        </Container>
      </div>
    </ScreenWrapper>
  );
};
