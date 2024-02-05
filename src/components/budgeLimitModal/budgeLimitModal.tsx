import {Input, Modal} from 'client-library';
import {Controller, useForm, useFieldArray} from 'react-hook-form';
import useGetOrganizationUnits from '../../services/graphQL/organizationUnits/useGetOrganizationUnits.ts';
import {useEffect} from 'react';

interface BudgetOverviewModalProps {
  onClose: () => void;
  id?: number;
}

interface BudgetLimitModalForm {
  limits: number[];
}

const budgeLimitModal = ({onClose}: BudgetOverviewModalProps) => {
  const {
    handleSubmit,
    formState: {errors, isValid},
    control,
    register,
    reset,
  } = useForm<BudgetLimitModalForm>();
  // const {insertBudget} = useInsertBudget();
  // const {fields, append, remove} = useFieldArray({
  //   control,
  //   name: 'limits',
  // });

  const {organizationUnits} = useGetOrganizationUnits(undefined, {allOption: true});
  useEffect(() => {
    reset({limits: organizationUnits.map(item => 0)});
  }, [organizationUnits]);
  return (
    <Modal
      open={true}
      onClose={onClose}
      title="NOVI BUDŽET"
      leftButtonOnClick={onClose}
      rightButtonText="Kreiraj novi budžet"
      leftButtonText="Otkaži"
      content={
        <>
          {organizationUnits.map(item => (
            <Input
              {...register(`limits.${item.id}`, {required: 'Ovo polje je obavezno'})}
              label={item.title}
              placeholder="Unesite limit..."
              error={errors.limits?.message as string}
              type="number"
            />
          ))}
        </>
      }
    />
  );
};

export default budgeLimitModal;
