import {Typography, Dropdown, Breadcrumbs, Tabs, Input, Theme} from 'client-library';
import styled from 'styled-components';
import SectionBox from '../../shared/sectionBox';

export const Header = styled.div`
  display: flex;
  margin-block: 22px;
  align-items: center;
  flex-wrap: wrap;
  row-gap: 30px;
  column-gap: 10px;
`;

export const Controls = styled.div`
  display: flex;
`;

export const Filters = styled.div`
  display: flex;
  gap: 8px;
  flex-grow: 1;
  flex-wrap: wrap;
`;

//TODO: on devkit and/or storybook, make dropdown to be at least the width of its label ??
export const FilterDropdown = styled(Dropdown)`
  width: 300px;
`;

export const FilterInput = styled(Input)`
  width: 300px;
`;

export const MainTitle = styled(Typography)`
  margin-bottom: 10px;
  font-weight: 600;
`;

export const OverviewBox = styled(SectionBox)`
  margin-top: 25px;
`;

export const ScreenWrapper = styled.div`
  background-color: #f8f8f8;
  padding: 28px 40px;
  height: calc(100vh - 157px);
  overflow-y: auto;
  box-sizing: border-box;

  ul {
    margin: 0;
    padding: 0;
  }
`;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const StyledBreadcrumbs = styled(Breadcrumbs)`
  padding: 0;
  margin: 0;
`;

export const StyledTabs = styled(Tabs)`
  /* width: 100%; */
  overflow-x: auto;
`;

export const FooterWrapper = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
  margin-top: 30px;
  justify-content: flex-end;
  background-color: ${Theme?.palette?.gray50};
  padding: 20px 10px;
  border-radius: 0px 0px 8px 8px;
  border-top: 2px solid ${Theme?.palette?.primary500};
`;
