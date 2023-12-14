import styled from 'styled-components';
import {Breadcrumbs} from 'client-library';

export const Container = styled.div`
  font-family: 'Source Sans Pro', sans-serif;
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

export const StyledBreadcrumbs = styled(Breadcrumbs)`
  padding: 0;
  margin: 0;
`;
