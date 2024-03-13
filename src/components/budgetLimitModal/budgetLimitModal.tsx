import {Input, Modal, Typography} from 'client-library';
import {useEffect} from 'react';
import {useFieldArray, useFormContext} from 'react-hook-form';
import useAppContext from '../../context/useAppContext.ts';
import {AddBudgetFormType} from '../../screens/budget/budgetCreate/budgetCreate.tsx';
import useGetBudgets from '../../services/graphQL/getBudgets/useGetBudgets.ts';
import useGetOrganizationUnits from '../../services/graphQL/organizationUnits/useGetOrganizationUnits.ts';
import {LabelWrapper, Row} from './styles.ts';

interface BudgetLimitModalProps {
  onClose: () => void;
  id?: number;
  open: boolean;
}

export type LimitObject = {
  limit: string;
  organization_unit_id: number;
  title: string;
};

const BudgetLimitModal = ({onClose, open}: BudgetLimitModalProps) => {
  const {
    navigation: {
      location: {pathname},
    },
    alert,
  } = useAppContext();

  // todo: fix this
  const budgetID = pathname.split('/').at(-1);
  const isNew = budgetID === 'add-new';

  const {
    register,
    control,
    formState: {errors},
    resetField,
    trigger,
  } = useFormContext<AddBudgetFormType>();

  const {replace, fields} = useFieldArray({name: 'limits', control, keyName: 'id'});

  const {organizationUnits} = useGetOrganizationUnits();
  const {budgets} = useGetBudgets({id: budgetID}, undefined, undefined, isNew);

  const handleSave = async () => {
    await trigger('limits');
    const errorsExist = errors.limits && Object.keys(errors.limits).length > 0;

    if (fields && !errorsExist) {
      alert.success('Uspješno ste dodali limite.');
      onClose();
    }
  };

  useEffect(() => {
    if (organizationUnits) {
      const items = organizationUnits.map(item => {
        const limitObj: LimitObject = {
          limit: '',
          organization_unit_id: item.id,
          title: item.title,
        };

        if (!isNew && budgets && budgets.items.length > 0) {
          const budget = budgets.items[0].limits.find(b => Number(b.organization_unit_id) === item.id);

          if (budget) {
            limitObj.limit = budget.limit.toString();
          }
        }

        return limitObj;
      });

      replace(items);
    }
  }, [budgets, organizationUnits, open]);

  const onModalClose = () => {
    resetField('limits');
    onClose();
  };

  return (
    <Modal
      onClose={onModalClose}
      open={open}
      title="DODAJTE LIMIT"
      leftButtonOnClick={onModalClose}
      rightButtonText="Dodajte limit"
      leftButtonText="Otkaži"
      rightButtonOnClick={handleSave}
      content={
        <>
          {fields.map((item, index) => (
            <Row key={`limits.${item?.id}`}>
              <LabelWrapper>
                <Typography variant="bodySmall" content={item.title} />
              </LabelWrapper>
              <Input
                {...register(`limits.${index}.limit`)}
                placeholder="Unesite limit..."
                type="number"
                error={errors.limits?.[index]?.limit?.message}
              />
            </Row>
          ))}
        </>
      }
    />
  );
};

export default BudgetLimitModal;
