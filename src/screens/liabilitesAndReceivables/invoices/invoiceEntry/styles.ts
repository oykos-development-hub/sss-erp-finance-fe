import styled from 'styled-components';
import {Theme} from 'client-library';
import {Switch, SwitchProps} from '@oykos-development/devkit-react-ts-styled-components';
import {rem} from 'polished';

export const InvoiceEntryForm = styled.form`
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

export const Amount = styled.div`
  display: flex;
  gap: 8px;
`;

export const InvoiceAmount = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 50px;
  margin-bottom: 25px;
  > :first-child {
    color: ${Theme.palette.gray600};
  }
`;

export const PlusButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-block: 20px;
`;

export const StyledSwitch = styled(Switch)<SwitchProps>`
  ${({checked, disabled, theme}) => `
  label {
    background-color: ${checked && !disabled ? theme.palette.primary500 : theme.palette.gray300} 
    box-shadow: ${!disabled && `0 0 0 ${rem('4px')} ${theme.palette.primary50}`};
  }
    `}
`;
