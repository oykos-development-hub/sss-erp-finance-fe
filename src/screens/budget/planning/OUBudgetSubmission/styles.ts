import {Theme} from 'client-library';
import styled from 'styled-components';

export const Container = styled.div`
  padding: 30px 0;
`;

export const BorderBox = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  border: 1px solid ${Theme.palette.gray600};
  margin-bottom: 24px;

  div:last-child {
    margin-bottom: 0;
  }
`;

export const BorderBoxItem = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 16px;
`;

export const TextAreaWrapper = styled.div`
  width: 50%;
  margin: 24px 0;
`;
