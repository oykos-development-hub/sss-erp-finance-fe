import {yupResolver} from '@hookform/resolvers/yup';
import {Dropdown, Modal} from 'client-library';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import useAppContext from '../../context/useAppContext.ts';
import {DropdownData} from '../../types/dropdownData.ts';
import {optionsNumberSchema, optionsStringSchema} from '../../utils/formSchemas.ts';
import {budgetTypeModal} from '../budgetList/constants.tsx';
import {BudgetOverviewForm} from './styles.ts';

interface AddBudgetModalProps {
  onClose: () => void;
  id?: number;
  availableYearsForBudget: DropdownData<string>[];
}

interface AddBudgetModalForm {
  year: DropdownData<string> | null;
  budget_type: DropdownData<number>;
}

const addBudgetSchema = yup.object().shape({
  year: optionsStringSchema.required('Ovo polje je obavezno').nullable(),
  budget_type: optionsNumberSchema.required('Ovo polje je obavezno'),
});

type AddBudgetFormType = yup.InferType<typeof addBudgetSchema>;

const initialValues: AddBudgetFormType = {
  year: null,
  budget_type: {id: 2, title: 'Tekući'},
};

const AddBudgetModal = ({onClose, availableYearsForBudget}: AddBudgetModalProps) => {
  const {
    handleSubmit,
    formState: {errors, isValid},
    control,
    watch,
  } = useForm<AddBudgetFormType>({defaultValues: initialValues, resolver: yupResolver(addBudgetSchema)});

  const {
    navigation: {navigate},
  } = useAppContext();

  const budgetType = watch('budget_type').id;

  const onAddNewBudget = async (data: AddBudgetModalForm) => {
    if (isValid) {
      navigate(`/finance/${budgetType}/add-new`, {
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
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={value}
                onChange={onChange}
                options={availableYearsForBudget}
                label="GODINA:"
                error={errors.year?.message}
                placeholder="Odaberite godinu"
                isRequired
              />
            )}
          />
          <Controller
            name="budget_type"
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={value}
                onChange={onChange}
                options={budgetTypeModal}
                label="TIP BUDŽETA:"
                error={errors.budget_type?.message}
                isRequired
              />
            )}
          />
        </BudgetOverviewForm>
      }
    />
  );
};

export default AddBudgetModal;
