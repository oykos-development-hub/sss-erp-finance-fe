import {Dropdown, Modal} from 'client-library';
import {Controller, useForm} from 'react-hook-form';
import {DropdownData} from '../../types/dropdownData';
import {BudgetOverviewForm} from './styles';
import {budgetStatusModal, budgetTypeModal, budgetYearModal} from '../budgetList/constants';
import useInsertBudget from '../../services/graphQL/insertBudget/useInsertBudget.ts';
import useAppContext from '../../context/useAppContext.ts';

interface BudgetOverviewModalProps {
  onClose: () => void;
  id?: number;
  refetch?: () => void;
}

interface BudgetOverviewModalForm {
  year: DropdownData<string>;
  type: DropdownData<string>;
  source: DropdownData<string>;
}

const BudgetOverviewModal = ({onClose, refetch}: BudgetOverviewModalProps) => {
  const {
    handleSubmit,
    formState: {errors, isValid},
    control,
  } = useForm<BudgetOverviewModalForm>();

  const {alert} = useAppContext();

  const {insertBudget} = useInsertBudget();

  const onAddNewBudget = async (data: BudgetOverviewModalForm) => {
    if (isValid) {
      await insertBudget(
        {
          ...data,
          year: data.year.id,
          type: data.type.id,
          source: data.source.id,
          id: 0,
        },
        () => {
          alert.success('Budžet uspješno dodat');
          refetch && refetch();
          onClose();
        },
        () => {
          alert.error('Greška prilikom dodavanja budžeta');
        },
      );
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
            name="source"
            control={control}
            rules={{required: 'Ovo polje je obavezno'}}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={value}
                onChange={onChange}
                options={budgetStatusModal}
                label="IZVOR:"
                error={errors.source?.message as string}
              />
            )}
          />
          <Controller
            name="type"
            control={control}
            rules={{required: 'Ovo polje je obavezno'}}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={value}
                onChange={onChange}
                options={budgetTypeModal}
                label="TIP BUDŽETA:"
                error={errors.type?.message as string}
              />
            )}
          />
        </BudgetOverviewForm>
      }
    />
  );
};

export default BudgetOverviewModal;
