import styled from 'styled-components';

export const ContractsFormContainer = styled.div`
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

export const HalfWidthContainer = styled.div`
  width: 50%;
`;
