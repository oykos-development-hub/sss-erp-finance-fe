import {Divider, Tabs, Theme, Typography} from 'client-library';
import styled from 'styled-components';

export const SectionBox = styled.div`
  margin-top: 25px;
  box-shadow: 0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06);
  border-radius: 8px;
  background-color: #ffffff;
  padding: 20px;
`;

export const TitleTabsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const MainTitle = styled(Typography)`
  font-weight: 600;
`;

export const StyledTabs = styled(Tabs)`
  border-width: 1px;
  white-space: nowrap;

  button {
    border-radius: 0.5em 0.5em 0 0;
  }
`;

export const CustomDivider = styled(Divider)`
  height: 1px;
  width: 100%;
  color: ${Theme?.palette?.gray200};
`;

export const FormFooter = styled.div`
  width: 100%;
  height: 91px;
  border-top: 1px solid ${Theme.palette.gray500};
  background-color: ${Theme.palette.gray50};
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 14px;
  box-sizing: border-box;
  margin-top: 20px;
`;

export const FormControls = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const DropdownWrapper = styled.div`
  width: 350px;
  display: flex;
  margin-right: 20px;
`;

export const HeaderWrapper = styled.div`
  display: flex;
  margin-block: 10px;
  flex-wrap: wrap;
  justify-content: space-between;
`;

export const SubTitle = styled(Typography)`
  font-weight: 600;
`;

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SubmitContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  position: absolute;
  bottom: -50px;
`;

export const TableWrapper = styled.div`
  overflow-x: scroll;
  margin-top: 22;
  position: relative;
`;

const resolveBackgroundColor = (level: number) => {
  if (level === 1) return Theme.palette.gray200;
  if (level === 2) return Theme.palette.gray100;
  if (level === 3) return Theme.palette.gray50;
  return Theme.palette.white;
};

export const DynamicTableCell = styled.td<{
  level: number;
  first?: boolean;
  lastLevel?: boolean;
  hasChildren?: boolean;
}>`
  padding: 12px 24px;
  border: 1px solid ${Theme.palette.gray300};

  background-color: ${({level}) => resolveBackgroundColor(level)};

  cursor: ${({first, hasChildren}) => (first && hasChildren ? 'pointer' : 'default')};

  ${({first}) => first && 'min-width: 280px'}
`;
