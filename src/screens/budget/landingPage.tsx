import {BuildingsIcon, ECommerceIcon, Typography} from 'client-library';
import React from 'react';
import useAppContext from '../../context/useAppContext';
import ScreenWrapper from '../../shared/screenWrapper/screenWrapper';
import {Container, ContentBox, IconWrapper, LandingPageTitle, Title, TitleWrapper} from './styles';

const BUDGET: React.FC = () => {
  const {
    navigation: {navigate},
    breadcrumbs,
  } = useAppContext();
  return (
    <ScreenWrapper showBreadcrumbs={false}>
      <div>
        <LandingPageTitle>
          <Typography variant="bodyLarge" style={{fontWeight: 600}} content="BUDŽET" />
        </LandingPageTitle>
        <Container>
          <ContentBox
            onClick={() => {
              navigate('/finance/budget/planning');
              breadcrumbs.add({name: 'Planiranje budžeta', path: '/finance/budget/planning'});
            }}>
            <TitleWrapper>
              <Title variant="bodyLarge" content="Planiranje budžeta" />
            </TitleWrapper>
            <IconWrapper>
              <ECommerceIcon />
            </IconWrapper>
          </ContentBox>
          <ContentBox
            onClick={() => {
              navigate('/finance/budget/current');
              breadcrumbs.add({name: 'Tekući budžet', path: '/finance/budget/current'});
            }}>
            <TitleWrapper>
              <Title variant="bodyLarge" content="Tekući budžet" />
            </TitleWrapper>
            <IconWrapper>
              <BuildingsIcon />
            </IconWrapper>
          </ContentBox>
        </Container>
      </div>
    </ScreenWrapper>
  );
};

export default BUDGET;
