import styled from 'styled-components';
import {Theme} from 'client-library';

export const Footer = styled.div`
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

export default Footer;
