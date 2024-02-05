import {Dropdown, Modal} from 'client-library';
import {Controller, useForm} from 'react-hook-form';
import {DropdownData} from '../../types/dropdownData';
import {BudgetOverviewForm} from './styles';
import {budgetTypeModal, budgetYearModal} from '../budgetList/constants';
import useInsertBudget from '../../services/graphQL/insertBudget/useInsertBudget.ts';
import useAppContext from '../../context/useAppContext.ts';
import {MicroserviceProps} from '../../types/micro-service-props.ts';

interface BudgetOverviewModalProps {
  onClose: () => void;
  id?: number;
  refetch?: () => void;
}

interface BudgetOverviewModalForm {
  year: DropdownData<string>;
  budget_type: DropdownData<number>;
}

const BudgetOverviewModal = ({onClose, refetch}: BudgetOverviewModalProps) => {
  const {
    handleSubmit,
    formState: {errors, isValid},
    control,
  } = useForm<BudgetOverviewModalForm>();

  const context = useAppContext();
  // const {insertBudget} = useInsertBudget();

  const onAddNewBudget = async (data: BudgetOverviewModalForm) => {
    if (isValid) {
      context.navigation.navigate(`/finance/budget-create-${data.year.id}`, {
        state: {
          data,
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
                options={budgetYearModal}
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
