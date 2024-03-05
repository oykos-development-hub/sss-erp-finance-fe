import {Dropdown, Modal} from 'client-library';
import {Controller, useForm} from 'react-hook-form';
import useAppContext from '../../context/useAppContext.ts';
import {DropdownData} from '../../types/dropdownData';
import {getMonthOptions} from '../../utils/getMonthOptions.ts';

interface FundReleaseModalProps {
  onClose: () => void;
  open: boolean;
  id?: number;
}

interface FundReleaseModalForm {
  month: DropdownData<string>;
}

const initialValues = {
  month: {
    id: '',
    title: '',
  },
};

const FundReleaseModal = ({onClose, open}: FundReleaseModalProps) => {
  const {
    formState: {errors},
    control,
  } = useForm<FundReleaseModalForm>({defaultValues: initialValues});

  const {
    navigation: {navigate},
  } = useAppContext();

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="NOVI ZAHTJEV ZA OTPUŠTANJE SREDSTAVA"
      leftButtonOnClick={onClose}
      rightButtonOnClick={() => navigate('/finance/budget/current/fund-release/new-request')}
      rightButtonText="Kreiraj zahtjev"
      leftButtonText="Otkaži"
      content={
        <div>
          <Controller
            name="month"
            rules={{required: 'Ovo polje je obavezno'}}
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={value}
                onChange={onChange}
                options={getMonthOptions(false)}
                label="MJESEC:"
                error={errors.month?.message as string}
              />
            )}
          />
        </div>
      }
    />
  );
};

export default FundReleaseModal;
