import {Input, Modal, Typography} from 'client-library';
import {useForm} from 'react-hook-form';
import useAppContext from '../../context/useAppContext.ts';
import useGetBudgets from '../../services/graphQL/getBudgets/useGetBudgets.ts';
import useGetOrganizationUnits from '../../services/graphQL/organizationUnits/useGetOrganizationUnits.ts';
import {LimitType} from '../../types/graphQL/budgetInsert.ts';
import {LabelWrapper, Row} from './styles.ts';
import {useEffect} from 'react';
interface BudgetOverviewModalProps {
  onClose: () => void;
  onSubmit: (formData: LimitType[]) => void;
  id?: number;
  open: boolean;
}

interface BudgetLimitModalForm {
  limits: {[key: string]: number};
}

const BudgetLimitModal = ({onClose, onSubmit, open}: BudgetOverviewModalProps) => {
  const {
    navigation: {
      location: {pathname},
    },
    alert,
  } = useAppContext();

  const budgetID = pathname.split('/').at(-1);
  const {
    handleSubmit,
    formState: {errors},
    register,
    reset,
  } = useForm<BudgetLimitModalForm>();

  const {organizationUnits} = useGetOrganizationUnits();
  const {budgets} = useGetBudgets({
    id: budgetID,
    page: 1,
    size: 1000,
  });

  const handleSave = async (formData: any) => {
    const limitsData = organizationUnits.map(item => ({
      organization_unit_id: item.id,
      limit: Number(formData.limits[item.id]),
    }));

    alert.success('Uspješno ste dodali limite.');
    onSubmit(limitsData);
    onClose();
  };

  useEffect(() => {
    if (budgets && budgets.items.length > 0) {
      const initialLimitsData = organizationUnits.map(item => {
        const budget = budgets.items[0].limits.find(b => Number(b.organization_unit_id) === item.id);
        return {
          organization_unit_id: item.id,
          limit: budget ? budget.limit : 0,
        };
      });

      const initialLimitsObject: {[key: string]: number} = {};

      initialLimitsData.forEach(limit => {
        initialLimitsObject[`${limit.organization_unit_id}`] = limit.limit;
      });

      reset({
        limits: initialLimitsObject,
      });
    }
  }, [budgets, organizationUnits, reset]);

  return (
    <Modal
      onClose={onClose}
      open={open}
      title="DODAJTE LIMIT"
      leftButtonOnClick={onClose}
      rightButtonText="Dodajte limit"
      leftButtonText="Otkaži"
      rightButtonOnClick={handleSubmit(handleSave)}
      content={
        <>
          {organizationUnits.map(item => (
            <Row key={`limits.${item?.title}`}>
              <LabelWrapper>
                <Typography variant="bodySmall" content={<b>ORGANIZACIONA JEDINICA:</b>} />
                <Typography variant="bodySmall" content={item.title} />
              </LabelWrapper>
              <Input
                {...register(`limits.${item.id}`, {required: 'Ovo polje je obavezno'})}
                placeholder="Unesite limit..."
                error={errors.limits?.[item.id]?.message}
                type="number"
              />
            </Row>
          ))}
        </>
      }
    />
  );
};

export default BudgetLimitModal;
