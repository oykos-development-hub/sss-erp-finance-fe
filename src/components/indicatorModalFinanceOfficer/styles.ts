import {Typography, Input} from 'client-library';
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

export const InputComponent = styled(Input)`
  margin-right: 10px;
`;

export const MainTitle = styled(Typography)`
  margin-bottom: 10px;
  font-weight: 600;
`;
