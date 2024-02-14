import {BuildingsIcon, ECommerceIcon, Typography} from 'client-library';
import React from 'react';
import ScreenWrapper from '../../shared/screenWrapper/screenWrapper';
import {Container, LandingPageTitle} from '../landingPage/styles.ts';
import LandingPageContentBox from '../../components/landingPageContentBox/landingPageContentBox.tsx';

const BUDGET: React.FC = () => {
  return (
    <ScreenWrapper showBreadcrumbs={false}>
      <div>
        <LandingPageTitle>
          <Typography variant="bodyLarge" style={{fontWeight: 600}} content="BUDŽET" />
        </LandingPageTitle>
        <Container>
          <LandingPageContentBox
            path={'/finance/budget/planning'}
            title={'Planiranje budžeta'}
            icon={<ECommerceIcon />}
          />
          <LandingPageContentBox path={'/finance/budget/current'} title={'Tekući budžet'} icon={<BuildingsIcon />} />
        </Container>
      </div>
    </ScreenWrapper>
  );
};

export default BUDGET;
