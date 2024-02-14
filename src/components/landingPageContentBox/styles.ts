import styled from 'styled-components';
import {Theme, Typography} from 'client-library';
export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #dfd7d6ab;
  height: 40%;
`;

export const Title = styled(Typography)`
  font-weight: 600;
  color: ${Theme?.palette?.gray600};
  padding: 20px;
`;

export const ContentBox = styled.div`
  height: 160px;
  width: 100%;
  background-color: ${Theme?.palette?.white};
  padding: 0;
  cursor: pointer;

  :hover ${TitleWrapper} {
    background-color: ${Theme?.palette?.primary500};
  }

  :hover ${Title} {
    color: ${Theme?.palette?.white};
  }
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60%;
`;
