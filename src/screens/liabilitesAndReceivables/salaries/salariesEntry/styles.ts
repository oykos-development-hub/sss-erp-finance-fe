import styled from 'styled-components';
import {Theme, Typography} from 'client-library';

export const SalariesFormContainer = styled.div`
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

export const FileUploadStepTitle = styled(Typography)`
  color: ${Theme.palette.gray600};
  font-weight: 600;
`;
