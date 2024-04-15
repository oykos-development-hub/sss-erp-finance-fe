import {Tabs, Typography} from 'client-library';
import styled from 'styled-components';

export const InnerTableWrapper = styled.div`
  margin-block: 20px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 33px;
  margin-bottom: 10px;
`;

export const TitleTabsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const StyledTabs = styled(Tabs)`
  border-width: 1px;
  white-space: nowrap;

  button {
    border-radius: 0.5em 0.5em 0 0;
  }
`;

export const SubTitle = styled(Typography)`
  font-weight: 600;
`;

export const Price = styled(Typography)`
  padding-left: 10px;
`;

export const PlusButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-block: 5%;
`;
