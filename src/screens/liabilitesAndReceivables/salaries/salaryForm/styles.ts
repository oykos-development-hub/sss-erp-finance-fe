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
export const FileTypeWarning = styled(Typography)`
  color: ${Theme.palette.error200};
  font-weight: 400;
`;

export const InfoBoxWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const InfoBox = styled.div`
  width: 350px;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border: 1px solid ${Theme.palette.gray600};
  border-radius: 8px;
  margin-right: 24px;
  margin-bottom: 24px;

  &:last-child {
    margin-right: 0;
  }
`;

export const InfoBoxText = styled(Typography)`
  color: ${Theme.palette.gray600};
  font-weight: 600;
  height: 20px;
  margin: 4px 0;
`;

export const TitleDivider = styled.div`
  height: 86px;
  background-color: ${Theme?.palette?.gray50};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  margin-bottom: 16px;
  margin-top: 50px;
`;
export const Title = styled(Typography)`
  color: ${Theme?.palette?.gray600};
  font-weight: 600;
`;

export const AddIcon = styled.div`
  border: 1px solid ${Theme?.palette?.primary500};
  border-radius: 8px;
  height: 48px;
  width: 48px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: ${Theme?.palette?.white};
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${Theme?.palette?.primary500};

    > svg path {
      transition: stroke 0.2s ease-in-out;
      stroke: ${Theme?.palette?.white};
    }
  }
`;

export const FileUploadErrorsWrapper = styled.div`
  margin-top: 10px;
  padding: 5;
`;
