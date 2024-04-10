import styled from 'styled-components';
import {Theme} from 'client-library';

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

export const FinePaymentDetailsWrapper = styled.div`
  display: flex;
  gap: 5px;
  flex-direction: column;
  padding: 5px;
  justify-content: space-between;
`;
