import styled, {css} from 'styled-components';
import {Theme, Typography} from 'client-library';

const resolveBackgroundColor = (level: number, lastLevel: boolean, rebalanceCol: boolean) => {
  if (rebalanceCol && level > 1) return Theme.palette.gray50;
  if (lastLevel) return Theme.palette.success50;
  if (level === 1) return Theme.palette.gray100;
  return Theme.palette.white;
};

export const CustomTable = styled.table<{disabled: boolean}>`
  box-shadow: none;
  border-collapse: collapse;

  & * {
    font-family: ${Theme.fontFamily.two};
    color: ${({disabled}) => (disabled ? Theme.palette.gray300 : Theme.palette.gray900)};
  }
`;

export const CustomTableHead = styled.th<{rebalanceCol: boolean}>`
  padding: 60px 24px;
  border: 1px solid ${Theme.palette.gray300};
  background-color: ${({rebalanceCol}) => (rebalanceCol ? Theme.palette.gray50 : Theme.palette.white)};
`;

export const CountTableCell = styled.td<{level: number; first?: boolean; lastLevel?: boolean; rebalanceCol?: boolean}>`
  padding: 12px 24px;
  border: 1px solid ${Theme.palette.gray300};

  background-color: ${({level, lastLevel, rebalanceCol}) =>
    resolveBackgroundColor(level, lastLevel || false, rebalanceCol || false)};

  cursor: ${({level, first}) => (level === 1 && first ? 'pointer' : 'default')};
`;

export const FlexContainer = styled.div`
  display: flex;
  align-items: center;
`;

const BudgetInputStyles = css`
  border: none;
  outline: none;
  background-color: transparent;
  text-align: center;
  font-size: 14px;
  width: 100%;
`;

export const BudgetInput = styled.input`
  ${BudgetInputStyles}

  &[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
  }
`;

export const DescriptionTextarea = styled.textarea`
  ${BudgetInputStyles}

  resize: none;
`;

export const BudgetText = styled(Typography)`
  text-align: center;
`;
