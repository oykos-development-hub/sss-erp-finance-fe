import styled from 'styled-components';
import {Typography, Theme} from 'client-library';
import {BadgeVariants} from '@oykos-development/devkit-react-ts-styled-components';

export const Wrapper = styled.div`
  white-space: nowrap;
  width: 200px;
`;

export const StatusText = styled(Typography)<{badgeVariant?: BadgeVariants | `${BadgeVariants}`}>`
  color: ${({badgeVariant}) =>
    badgeVariant === 'success'
      ? Theme?.palette?.success500
      : badgeVariant === 'warning'
      ? Theme?.palette?.error500
      : Theme?.palette?.gray600};
`;
