import {StatusText, Wrapper} from './styles.ts';
import {Badge} from 'client-library';
import {BadgeVariants} from '@oykos-development/devkit-react-ts-styled-components';
import {ReallocationStatusEnum} from '../../constants.ts';

type statusTextWrapperProps = {
  status: string;
};
const StatusTableCell = (props: statusTextWrapperProps) => {
  const {status} = props;

  let variant: BadgeVariants = BadgeVariants.primary;
  switch (status) {
    case 'Odobren':
    case ReallocationStatusEnum.acceptedSSS:
      variant = BadgeVariants.success;
      break;
    case 'Odbijen':
    case ReallocationStatusEnum.rejectedOJ:
    case ReallocationStatusEnum.rejectedSSS:
      variant = BadgeVariants.warning;
      break;
  }

  return (
    <Wrapper>
      <Badge variant={variant} content={<StatusText content={status} variant="bodySmall" badgeVariant={variant} />} />
    </Wrapper>
  );
};

export default StatusTableCell;
