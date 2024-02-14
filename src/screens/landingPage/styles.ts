import styled from 'styled-components';
import {Theme} from 'client-library';

export const LandingPageTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  background-color: ${Theme?.palette?.white};
  border-radius: 8px;
  box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.1);
`;

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 21px;
  margin-top: 20px;
  width: 100%;
`;
