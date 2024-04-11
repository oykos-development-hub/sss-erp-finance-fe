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

export const SubTitle = styled(Typography)`
  font-weight: 600;
`;

export const Row = styled.div`
  display: flex;
  margin-block: 20px;
  align-items: center;
`;

export const PlusButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-block: 5%;
`;
