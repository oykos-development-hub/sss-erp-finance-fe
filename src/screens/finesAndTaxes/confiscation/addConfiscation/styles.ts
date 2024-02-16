import styled from 'styled-components';
import {Theme} from 'client-library';
export const FinesFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 25px;
  > * {
    flex: 1;
  }
`;

export const Amount = styled.div`
  display: flex;
  gap: 8px;
`;

export const LabeledDivider = styled.div`
  display: flex;
  align-items: center;
  background-color: ${Theme?.palette?.gray50};
  padding: 24px 12px;
  margin: 20px 0;
`;
