import {Dropdown, Modal} from 'client-library';
import {Controller, useForm} from 'react-hook-form';
import useAppContext from '../../context/useAppContext.ts';
import {DropdownData} from '../../types/dropdownData';
import {getYearOptions} from '../../utils/getYearOptions.ts';
import {budgetTypeModal} from '../budgetList/constants';
import {BudgetOverviewForm} from './styles';

interface BudgetOverviewModalProps {
  onClose: () => void;
  id?: number;
}

interface BudgetOverviewModalForm {
  year: DropdownData<string>;
  budget_type: DropdownData<number>;
}

const initialValues = {
  year: {
    id: '',
    title: '',
  },
  budget_type: {id: 2, title: 'Tekući'},
};

const BudgetOverviewModal = ({onClose}: BudgetOverviewModalProps) => {
  const {
    handleSubmit,
    formState: {errors, isValid},
    control,
    watch,
  } = useForm<BudgetOverviewModalForm>({defaultValues: initialValues});

  const context = useAppContext();

  const budgetType = watch('budget_type');

  const onAddNewBudget = async (data: BudgetOverviewModalForm) => {
    if (isValid) {
      context.navigation.navigate(`/finance/budget-create-${data.year.id}`, {
        state: {
          data,
          budgetType,
        },
      });
    }
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      title="NOVI BUDŽET"
      leftButtonOnClick={onClose}
      rightButtonOnClick={handleSubmit(onAddNewBudget)}
      rightButtonText="Kreiraj novi budžet"
      leftButtonText="Otkaži"
      content={
        <BudgetOverviewForm>
          <Controller
            name="year"
            rules={{required: 'Ovo polje je obavezno'}}
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={value}
                onChange={onChange}
                options={getYearOptions(7, false, 1)}
                label="GODINA:"
                error={errors.year?.message as string}
              />
            )}
          />

          <Controller
            name="budget_type"
            control={control}
            rules={{required: 'Ovo polje je obavezno'}}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={value}
                onChange={onChange}
                options={budgetTypeModal}
                label="TIP BUDŽETA:"
                error={errors.budget_type?.message as string}
              />
            )}
          />
        </BudgetOverviewForm>
      }
    />
  );
};

export default BudgetOverviewModal;
