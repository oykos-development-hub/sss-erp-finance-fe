import {Divider, Tabs, Theme, Typography, Table} from 'client-library';
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

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 33px;
  margin-bottom: 10px;
`;

export const Column = styled.div`
  width: 300px;
`;

export const DropdownWrapper = styled.div`
  width: 70%;
`;

export const DropdownWrapperRequests = styled.div`
  width: 300px;
  margin: 22px 0;
`;

export const Price = styled(Typography)`
  padding: 14px 0 0 12px;
`;

export const Totals = styled.div`
  margin: 40px 0px 20px 0px;
  display: flex;
`;

export const SubTitle = styled(Typography)`
  font-weight: 600;
`;

export const StyledTable = styled(Table)`
  tr {
    background-color: unset;
  }
`;
