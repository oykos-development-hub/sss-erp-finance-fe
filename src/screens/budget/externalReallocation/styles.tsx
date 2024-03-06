import {Typography} from 'client-library';
import styled from 'styled-components';

export const SectionBox = styled.div`
  margin-top: 25px;
  box-shadow: 0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06);
  border-radius: 8px;
  background-color: #ffffff;
  padding: 20px;
`;

export const DropdownWrapper = styled.div`
  width: 300px;
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

export const MainTitle = styled(Typography)`
  margin-bottom: 10px;
  font-weight: 600;
`;
