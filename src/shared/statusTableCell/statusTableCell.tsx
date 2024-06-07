import {Wrapper} from './styles.ts';
import {Badge, Typography} from 'client-library';
import {BadgeVariants} from '@oykos-development/devkit-react-ts-styled-components';

type statusTextWrapperProps = {
  status: string;
};
const StatusTableCell = (props: statusTextWrapperProps) => {
  const {status} = props;

  let variant: BadgeVariants = BadgeVariants.primary;
  switch (status) {
    case 'Odobren':
      variant = BadgeVariants.success;
      break;
    case 'Odbijen':
      variant = BadgeVariants.warning;
      break;
  }

  return (
    <Wrapper>
      <Badge variant={variant} content={<Typography content={status} variant="bodySmall" />} />
    </Wrapper>
  );
};

export default StatusTableCell;
