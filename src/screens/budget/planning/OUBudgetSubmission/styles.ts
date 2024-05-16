import {Theme} from 'client-library';
import styled from 'styled-components';

export const Container = styled.div`
  padding: 30px 0;
`;

export const BorderBox = styled.div`
  display: flex;
  align-items: center;
  padding: 24px;
  border: 1px solid ${Theme.palette.gray600};
  margin-bottom: 24px;
`;
