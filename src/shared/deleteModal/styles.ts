import styled from 'styled-components';
import {AlertTriangleIcon} from 'client-library';

export const DeleteModalContent = styled.div`
  display: flex;
  flex-direction: column;
  height: auto;
  align-items: center;
  > div {
    padding-top: 5px;
  }
`;
export const TriangleIcon = styled(AlertTriangleIcon)`
  padding-bottom: 13px;
  width: 40px;
  height: 40px;
`;
export const DeleteModalControlButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;
