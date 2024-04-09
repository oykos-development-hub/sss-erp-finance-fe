import styled from 'styled-components';
import {Typography} from 'client-library';

export const Row = styled.div`
  display: flex;
  gap: 10px;
`;

export const FileListWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-block: 10px;
`;

export const MainTitle = styled(Typography)`
  margin-bottom: 10px;
  font-weight: 600;
`;
