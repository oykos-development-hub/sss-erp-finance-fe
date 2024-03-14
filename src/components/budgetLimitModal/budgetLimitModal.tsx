import {yupResolver} from '@hookform/resolvers/yup';
import {Input, Modal, Typography} from 'client-library';
import {useEffect} from 'react';
import {useFieldArray, useForm} from 'react-hook-form';
import * as yup from 'yup';
import useAppContext from '../../context/useAppContext.ts';
import {LimitObject} from '../../screens/budget/budgetCreate/budgetCreate.tsx';
import useGetBudgets from '../../services/graphQL/getBudgets/useGetBudgets.ts';
import useGetOrganizationUnits from '../../services/graphQL/organizationUnits/useGetOrganizationUnits.ts';
import {LabelWrapper, Row} from './styles.ts';

interface BudgetLimitModalProps {
  open: boolean;
  onSubmit: (data: LimitObject[]) => void;
  onClose: () => void;
  id?: number;
}

export type LimitFormObject = {
  limit: string;
  organization_unit_id: number;
  title: string;
};

export const limitSchema = yup.array().of(
  yup.object().shape({
    limit: yup.string().required('Ovo polje je obavezno'),
    title: yup.string(),
    organization_unit_id: yup.number().required(),
  }),
);

const limitFormSchema = yup.object().shape({limits: limitSchema.required().default([])});

type LimitFormType = yup.InferType<typeof limitFormSchema>;

const BudgetLimitModal = ({onClose, open, onSubmit}: BudgetLimitModalProps) => {
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
    handleSubmit,
  } = useForm<LimitFormType>({resolver: yupResolver(limitFormSchema)});

  const {replace, fields} = useFieldArray({name: 'limits', control, keyName: 'id'});

  const {organizationUnits} = useGetOrganizationUnits();
  const {budgets} = useGetBudgets({id: budgetID}, undefined, undefined, isNew);

  const handleSave = async (data: LimitFormType) => {
    const limits = data.limits.map(item => ({
      organization_unit_id: item.organization_unit_id,
      limit: parseInt(item.limit),
    }));

    if (limits.length) {
      onSubmit(limits);
      alert.success('Uspješno ste dodali limite.');
      onClose();
    }
  };

  useEffect(() => {
    if (organizationUnits) {
      const items = organizationUnits.map(item => {
        const limitObj: LimitFormObject = {
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
  }, [budgets, organizationUnits]);

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
      rightButtonOnClick={handleSubmit(handleSave)}
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
