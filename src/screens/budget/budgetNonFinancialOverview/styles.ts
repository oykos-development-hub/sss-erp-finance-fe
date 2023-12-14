import {Dropdown} from 'client-library';
import styled from 'styled-components';

export const StatusUpdateContainer = styled.div`
  display: flex;
  padding: 10px 0;
`;

export const StyledDropdown = styled(Dropdown)`
  width: 40%;
  margin-right: 10px;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;
