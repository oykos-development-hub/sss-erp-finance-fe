import styled from 'styled-components';
import {Theme} from 'client-library';

export const InvoiceEntryForm = styled.form`
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

export const InvoiceAmount = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 50px;
  margin-bottom: 25px;
  > :first-child {
    color: ${Theme.palette.gray600};
  }
`;
