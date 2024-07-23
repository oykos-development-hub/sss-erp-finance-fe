import {useEffect, useMemo} from 'react';
import {Dropdown, Input, Modal, Button} from 'client-library';
import {Controller, useForm} from 'react-hook-form';
import useGetOrganizationUnits from '../../services/graphQL/organizationUnits/useGetOrganizationUnits';
import {generateDropdownOptions} from '../../constants';
import {InsertExternalReallocationsFormData, ReallocationItem} from '../../types/graphQL/externalReallocations.ts';
import {RowWrapper} from './styles.ts';
import useAppContext from '../../context/useAppContext.ts';
import PlusButton from '../../shared/plusButton.tsx';
import useInsertExternalReallocations from '../../services/graphQL/externalReallocations/useInsertExternalReallocations.ts';
import {ModalControlButtons} from '../../shared/confirmationModal/styles.ts';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import useGetCurrentBudget from '../../services/graphQL/currentBudget/useGetCurrentBudget.ts';
import {flattenAccounts} from '../../shared/budgetTable/utils.ts';

interface ExternalReallocationProps {
  onClose: () => void;
  open: boolean;
  activeReallocation?: ReallocationItem;
  refetch: () => void;
}

const initialValues: InsertExternalReallocationsFormData = {
  source_organization_unit_id: 0,
  destination_organization_unit_id: 0,
  budget_id: 0,
  items: [
    {
      destination_account_id: 0,
      amount: '',
    },
  ],
};

const externalReallocationSchema = yup.object().shape({
  source_organization_unit_id: yup.number().required('Ovo polje je obavezno').min(1, 'Ovo polje je obavezno'),
  items: yup.array().of(
    yup.object().shape({
      destination_account_id: yup.number().required('Ovo polje je obavezno').min(1, 'Ovo polje je obavezno'),
      amount: yup.string().required('Ovo polje je obavezno'),
    }),
  ),
});

export const ExternalReallocationModal = ({open, onClose, activeReallocation, refetch}: ExternalReallocationProps) => {
  const {
    contextMain: {
      organization_unit: {id: organization_unit_id},
    },
    alert,
  } = useAppContext();

  const {
    formState: {errors},
    register,
    setValue,
    control,
    watch,
    handleSubmit,
    reset,
  } = useForm<InsertExternalReallocationsFormData>({
    defaultValues: initialValues,
    resolver: yupResolver(externalReallocationSchema),
  });

  const {organizationUnits} = useGetOrganizationUnits({disable_filters: true});
  const {currentBudgetAccounts, budget_id} = useGetCurrentBudget({organization_unit_id});
  const {insertExternalReallocations, loading} = useInsertExternalReallocations();
  const counts = flattenAccounts(currentBudgetAccounts, true);
  const items = watch('items');

  const dropdownCountsOptions = useMemo(() => {
    return generateDropdownOptions(counts);
  }, [counts]);

  useEffect(() => {
    if (!activeReallocation) return;
    setValue('source_organization_unit_id', activeReallocation.source_organization_unit.id);
    setValue('destination_organization_unit_id', activeReallocation.destination_organization_unit.id);
    setValue(
      'items',
      activeReallocation.items.map(item => ({
        destination_account_id: item.destination_account.id,
        amount: item.amount,
      })),
    );
  }, [activeReallocation]);

  const onSubmit = (data: InsertExternalReallocationsFormData) => {
    const payload = {...data, destination_organization_unit_id: organization_unit_id, budget_id};
    insertExternalReallocations(
      payload,
      () => {
        alert.success('Uspješno ste poslali zahtjev..');
        handleClose();
        refetch();
      },
      () => {
        alert.error('Došlo je do greške prilikom slanja zahtjeva.');
      },
    );
  };

  const addRow = () => {
    if (items[items.length - 1].destination_account_id === 0 || items[items.length - 1].amount === '') return;
    setValue('items', [...items, {destination_account_id: 0, amount: ''}]);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const buttonControls = (
    <ModalControlButtons>
      <Button content={'Otkaži'} onClick={onClose} variant="secondary" />
      {!activeReallocation && (
        <Button content={'Pošalji zahtjev'} onClick={handleSubmit(onSubmit)} variant="primary" loader={loading} />
      )}
    </ModalControlButtons>
  );

  const rowItem = (index: number) => {
    if (!!activeReallocation && items[index]?.destination_account_id === 0) return null;

    return (
      <RowWrapper key={index} style={{marginBlock: '10px'}}>
        <Controller
          name={`items.${index}.destination_account_id`}
          control={control}
          rules={{required: 'Ovo polje je obavezno'}}
          render={({field: {name, value, onChange}}) => (
            <Dropdown
              name={name}
              value={dropdownCountsOptions?.find(option => option.id === value)}
              onChange={value => onChange(value.id)}
              options={dropdownCountsOptions}
              label="KONTO:"
              error={errors.items?.[index]?.destination_account_id?.message}
              isDisabled={!!activeReallocation}
            />
          )}
        />

        <Input
          {...register(`items.${index}.amount`, {required: 'Ovo polje je obavezno'})}
          label="NEDOSTAJUĆI IZNOS:"
          error={errors.items?.[index]?.amount?.message}
          disabled={!!activeReallocation}
        />
      </RowWrapper>
    );
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={activeReallocation ? 'EKSTERNO PREUSMJERENJE' : 'KREIRAJ EKSTERNO PREUSMJERENJE'}
      customButtonsControls={buttonControls}
      width={600}
      content={
        <div>
          <Controller
            name="source_organization_unit_id"
            rules={{required: 'Ovo polje je obavezno'}}
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={organizationUnits.find(unit => unit.id === value)}
                onChange={value => onChange(value.id)}
                options={organizationUnits}
                label="ORGANIZACIONA JEDINICA:"
                error={errors.source_organization_unit_id?.message as string}
                isDisabled={!!activeReallocation}
              />
            )}
          />
          {items?.map((_, index) => rowItem(index))}
          <PlusButton onClick={addRow} style={{marginLeft: 'auto'}} disabled={!!activeReallocation} />
        </div>
      }
    />
  );
};
