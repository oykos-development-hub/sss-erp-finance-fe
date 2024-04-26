import styled from 'styled-components';
import {Theme} from 'client-library';

export const RowWrapper = styled.div`
  margin-block: 20px;
`;

export const FilterWrapper = styled.div`
  width: 450px;
`;

export const ButtonOverviewWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
`;

export const Row = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  align-items: flex-end;
`;

export const FileUploadWrapper = styled.div`
  align-items: center;
  width: 30%;
  margin-top: 10px;
  margin-bottom: 25px;

  > div > div {
    display: block;
    > :nth-child(2) {
      display: flex;
      justify-content: flex-start;
    }
    & div > p > p {
      font-weight: 600;
      line-height: 20px;
    }
  }
`;

export const ReturnWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const CaptionWrapper = styled.div`
  background: ${Theme.palette?.error50};
  display: 'flex';
  align-items: 'center';
  margin-block: 10px;
`;
