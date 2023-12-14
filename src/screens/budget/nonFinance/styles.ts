import styled from 'styled-components';
import {Theme, Typography, Divider, Input} from 'client-library';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  box-shadow: 0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06);
  border-radius: 8px;
  background-color: ${Theme?.palette?.white};
  padding: 20px;

  & > span {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
  }
`;

export const MainTitle = styled(Typography)`
  margin-bottom: 10px;
  font-weight: 600;
`;

export const CustomDivider = styled(Divider)`
  height: 1px;
  width: 100%;
  color: ${Theme?.palette?.gray800};
`;

export const SectionWrapper = styled.div`
  margin-block: 20px;
`;

export const InputWrapper = styled.div`
  display: flex;
  margin-top: 20px;
  flex-direction: row;
`;

export const InputComponent = styled(Input)`
  margin-right: 10px;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;

export const AddProgramWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 16px;
  margin-block: 20px;
`;

export const AccordionMainWrapper = styled.div`
  margin-bottom: 20px;
`;
