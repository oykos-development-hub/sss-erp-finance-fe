import styled from 'styled-components';
import {Theme} from 'client-library';

export const TableTitle = styled.div`
  height: 86px;
  background-color: ${Theme?.palette?.gray50};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 12px !important;
  padding-right: 20px !important;
`;
