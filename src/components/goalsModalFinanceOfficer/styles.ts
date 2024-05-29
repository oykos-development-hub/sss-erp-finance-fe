import {Typography, Theme} from 'client-library';
import styled from 'styled-components';

export const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
`;

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 15px;
`;

export const IndicatorButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${Theme?.palette?.gray50};
  gap: 22px;
  margin-top: 10px;
`;

export const ButtonWrapper = styled.div`
  margin-right: 10px;
`;

export const IndicatorTitle = styled(Typography)`
  margin-bottom: 10px;
  font-weight: 600;
  padding: 20px;
  color: ${Theme?.palette?.gray600};
`;
