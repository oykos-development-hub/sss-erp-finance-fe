import {Wrapper} from './styles.ts';
import {Badge, Typography} from 'client-library';

type statusTextWrapperProps = {
  status: string;
};
const StatusTableCell = (props: statusTextWrapperProps) => {
  const {status} = props;
  return (
    <Wrapper>
      <Badge content={<Typography content={status} variant="bodySmall" />} />
    </Wrapper>
  );
};

export default StatusTableCell;
