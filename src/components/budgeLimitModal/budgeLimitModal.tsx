import {Input, Modal, Typography} from 'client-library';
import {useForm} from 'react-hook-form';
import useGetOrganizationUnits from '../../services/graphQL/organizationUnits/useGetOrganizationUnits.ts';
import {LimitType} from '../../types/graphQL/budgetInsert.ts';
import {LabelWrapper, Row} from './styles.ts';

interface BudgetOverviewModalProps {
  onClose: () => void;
  onSubmit: (formData: LimitType[]) => void;
  id?: number;
}

interface BudgetLimitModalForm {
  limits: number[];
}

const BudgetLimitModal = ({onClose, onSubmit}: BudgetOverviewModalProps) => {
  const {
    handleSubmit,
    formState: {errors},
    register,
  } = useForm<BudgetLimitModalForm>();

  const {organizationUnits} = useGetOrganizationUnits(undefined, {allOption: true});
  const filteredOrganizationUnits = organizationUnits.filter(item => item.title !== 'Sve organizacione jedinice');

  const handleSave = async (formData: any) => {
    const limitsData = filteredOrganizationUnits.map(item => ({
      organization_unit_id: item.id,
      limit: Number(formData.limits[item.id]),
    }));

    onSubmit(limitsData);
    onClose();
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      title="DODAJTE LIMIT"
      leftButtonOnClick={onClose}
      rightButtonText="Dodajte limit"
      leftButtonText="Otkaži"
      rightButtonOnClick={handleSubmit(handleSave)}
      content={
        <>
          {filteredOrganizationUnits.map(item => (
            <Row key={`limits.${item?.title}`}>
              <LabelWrapper>
                <Typography variant="bodySmall" content={<b>ORGANIZACIONA JEDINICA:</b>} />
                <Typography variant="bodySmall" content={item.title} />
              </LabelWrapper>
              <Input
                {...register(`limits.${item.id}`, {required: 'Ovo polje je obavezno'})}
                placeholder="Unesite limit..."
                error={errors.limits?.message as string}
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
