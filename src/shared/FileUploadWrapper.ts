import styled from 'styled-components';

export const FileUploadWrapper = styled.div`
  align-items: center;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 25px;

  > div > div {
    display: block;
    width: 100%;
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
