import {FeesIcon, FinesIcon, Typography} from 'client-library';
import React from 'react';
import LandingPageContentBox from '../../../components/landingPageContentBox/landingPageContentBox.tsx';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper.tsx';
import {Container, LandingPageTitle} from '../../landingPage/styles.ts';
import useAppContext from '../../../context/useAppContext.ts';
import {checkActionRoutePermissions} from '../../../services/checkRoutePermissions.ts';

export const ReceivablesLandingPage: React.FC = () => {
  const {
    contextMain: {permissions},
  } = useAppContext();
  const readPermittedRoutes = checkActionRoutePermissions(permissions, 'read');

  return (
    <ScreenWrapper showBreadcrumbs={false}>
      <div>
        <LandingPageTitle>
          <Typography variant="bodyLarge" style={{fontWeight: 600}} content="Nalozi" />
        </LandingPageTitle>
        <Container>
          {readPermittedRoutes.includes('/finance/liabilities-receivables/receivables/payment-orders') && (
            <LandingPageContentBox
              title={'Nalozi za plaćanje'}
              path={'/finance/liabilities-receivables/receivables/payment-orders'}
              icon={<FinesIcon />}
            />
          )}
          {readPermittedRoutes.includes('/finance/liabilities-receivables/receivables/enforced-payments') && (
            <LandingPageContentBox
              title={'Prinudne naplate'}
              path={'/finance/liabilities-receivables/receivables/enforced-payments'}
              icon={<FeesIcon />}
            />
          )}
        </Container>
      </div>
    </ScreenWrapper>
  );
};
