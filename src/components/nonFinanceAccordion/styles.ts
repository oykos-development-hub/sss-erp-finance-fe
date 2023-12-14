import {Theme, Input, Typography} from 'client-library';
import styled from 'styled-components';

export const AccordionWrapper = styled.div<{isOpen: boolean}>`
  position: relative;

  & > div > div {
    max-height: ${props => props.isOpen && '4000px'};
    background-color: ${Theme?.palette?.gray50};
    padding: 0;
  }
`;

export const AccordionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${Theme?.palette?.gray50};
  padding: 10px 16px;
  border-bottom: 0;
`;

export const AccordionIconsWrapper = styled.div<{isOpen: boolean}>`
  display: flex;
  align-items: center;
  gap: 10px;
  > svg {
    padding: 5px;
    border-radius: 8px;
    height: 16px;
    :hover {
      background-color: ${Theme?.palette?.gray100};
    }
  }
  & svg:first-child {
    transition: transform 0.3s ease-in-out;
    transform: rotate(${props => (props.isOpen ? '180deg' : '0deg')});
  }
`;

export const Menu = styled.div<{open: boolean}>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: ${Theme?.palette?.white};
  border-radius: 8px;
  box-shadow: 0 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03);
  position: absolute;
  right: 45px;
  top: 10px;
  z-index: 99;
  height: ${props => (props.open ? 'auto' : '0')};
  overflow: hidden;
  transition: height 0.3s ease;
`;

export const MenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 14px;
  z-index: 99;

  :hover {
    background-color: ${Theme?.palette?.gray100};
  }
`;

export const ProgramTitleContainer = styled.div`
  width: 30%;
  background-color: ${Theme?.palette?.white};
  margin-inline: 20px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  margin-top: 20px;
`;

export const ProgramTitle = styled(Typography)`
  padding: 10px;
`;

export const ProgramWrapper = styled.div`
  background-color: ${Theme?.palette?.white};
  margin-inline: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
`;

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px;
`;

export const InputComponent = styled(Input)`
  margin-left: 20px;
  width: 30%;
`;

export const TextAreaWrapper = styled.div`
  margin-inline: 10px;
  margin-top: 10px;
  padding-bottom: 10px;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-block: 20px;
  margin-right: 10px;
`;

export const PreviewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 10px;
`;

export const TextWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

export const ItemWrapper = styled.div`
  margin-bottom: 25px;
`;
