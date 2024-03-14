import {Typography, Theme} from 'client-library';
import styled from 'styled-components';

export const Box = styled.div`
  border-radius: 4px;
  border: 1px solid ${Theme.palette.gray300};
  padding: 20px;
  margin-bottom: 10px;
`;

export const BoldText = styled(Typography)`
  font-weight: 600;
`;

export const TableGrid = styled.div`
  display: grid;
  grid-template-columns: max-content auto;
  grid-gap: 10px;
  align-items: center;
`;

export const Controls = styled.div`
  display: flex;
  justify-content: space-between;
`;
