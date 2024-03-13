import {yupResolver} from '@hookform/resolvers/yup';
import {Input, Modal, Typography} from 'client-library';
import {useEffect} from 'react';
import {useFieldArray, useForm} from 'react-hook-form';
import * as yup from 'yup';
import useAppContext from '../../context/useAppContext.ts';
import useGetBudgets from '../../services/graphQL/getBudgets/useGetBudgets.ts';
import useGetOrganizationUnits from '../../services/graphQL/organizationUnits/useGetOrganizationUnits.ts';
import {LimitType} from '../../types/graphQL/budgetInsert.ts';
import {LabelWrapper, Row} from './styles.ts';

interface BudgetLimitModalProps {
  onClose: () => void;
  onSubmit: (formData: LimitType[]) => void;
  id?: number;
  open: boolean;
}

const limitSchema = yup.object().shape({
  limits: yup.array().of(
    yup.object().shape({
      limit: yup.string().required('Ovo polje je obavezno'),
      title: yup.string(),
      organization_unit_id: yup.number().required(),
    }),
  ),
});

type BudgetLimitModalForm = yup.InferType<typeof limitSchema>;

type LimitObject = {
  limit: string;
  organization_unit_id: number;
  title: string;
};

const BudgetLimitModal = ({onClose, onSubmit, open}: BudgetLimitModalProps) => {
  const {
    navigation: {
      location: {pathname},
    },
    alert,
  } = useAppContext();

  // todo: fix this
  const budgetID = pathname.split('/').at(-1);
  const isNew = budgetID === 'new-budget';

  const {
    handleSubmit,
    formState: {errors},
    register,
    reset,
    control,
  } = useForm<BudgetLimitModalForm>({resolver: yupResolver(limitSchema)});

  const {replace, fields} = useFieldArray({name: 'limits', control, keyName: 'id'});

  const {organizationUnits} = useGetOrganizationUnits();
  const {budgets} = useGetBudgets({id: budgetID}, undefined, undefined, isNew);

  const handleSave = async (data: BudgetLimitModalForm) => {
    if (data.limits) {
      const limitsData = data.limits.map(item => ({
        organization_unit_id: item.organization_unit_id,
        limit: Number(item.limit),
      }));

      alert.success('Uspješno ste dodali limite.');
      onSubmit(limitsData);
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
  }, [budgets, organizationUnits, reset]);

  const onModalClose = () => {
    reset();
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
