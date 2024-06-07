import {Modal, Input, Button, Table, Theme, EditIconTwo, TrashIcon} from 'client-library';
import {useEffect, useState} from 'react';
import {useFieldArray, useFormContext} from 'react-hook-form';
import {ButtonWrapper, FormWrapper, IndicatorButtonWrapper, IndicatorTitle, InputWrapper} from './styles';
import {GoalsModalFinanceOfficerProps} from './types';
import {NonFinancialForm} from '../../types/nonFinance.ts';
import {IndicatorModalFinanceOfficer} from '../indicatorModalFinanceOfficer/indicatorModalFinanceOfficer.tsx';
import {goalIndicatorsTableHeads} from '../../screens/budget/planning/OUBudgetSubmission/constants.tsx';

// Goals modal used by finance officer when filling non-financial part of the budget
export const GoalsModalFinanceOfficer = ({goalId, onClose, handleAddGoal, disabled}: GoalsModalFinanceOfficerProps) => {
  const [indicatorId, setIndicatorId] = useState<number | undefined>(undefined);
  const toggleModal = (id?: number) => {
    id !== undefined ? setIndicatorId(id) : setIndicatorId(undefined);
  };
  const {
    register,
    formState: {errors},
    control,
  } = useFormContext<NonFinancialForm>();

  const {fields, append, remove} = useFieldArray({name: `goals.${goalId ?? 0}.indicators`, control});
  const [trigger, setTrigger] = useState(false);

  const tableActions = [
    {
      name: 'Izmijeni',
      onClick: (row: any) => {
        handleEditIndicator(row.id);
      },
      icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
    },
    {
      name: 'Izbriši',
      onClick: (row: any) => {
        handleRemoveIndicator(row.id);
      },
      icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
    },
  ];

  const findIndex = (id: any) => fields.findIndex(indicator => indicator.id === id);

  const handleSave = () => {
    handleAddGoal({title: '', description: '', indicators: []});
    onClose();
  };

  const handleAddIndicator = (data: any) => {
    append(data);
    setTrigger(true);
    toggleModal();
  };

  const handleRemoveIndicator = (id: number | string) => {
    remove(findIndex(id));
  };

  const handleEditIndicator = (id: number | string) => {
    toggleModal(findIndex(id));
  };

  useEffect(() => {
    // TODO remove
    //  temp fix because table won't update when adding new goal
    if (trigger) {
      handleRemoveIndicator(fields.length - 1);
      setTrigger(false);
    }
  }, [trigger, indicatorId]);

  return (
    <>
      <Modal
        open={goalId !== undefined}
        onClose={onClose}
        leftButtonText="Otkaži"
        rightButtonText="Sačuvaj"
        rightButtonOnClick={handleSave}
        //hides footer with buttons when in preview mode
        customButtonsControls={disabled ? <></> : undefined}
        title={disabled ? 'PREGLED CILJEVA' : 'DODAJTE NOVE CILJEVE'}
        content={
          <FormWrapper>
            <InputWrapper>
              <Input
                {...register(`goals.${goalId ?? 0}.title`)}
                label="NAZIV CILJA:"
                error={errors?.goals?.[goalId ?? 0]?.title?.message as string}
                placeholder="Unesite naziv..."
              />
            </InputWrapper>
            <Input
              {...register(`goals.${goalId ?? 0}.description`, {required: 'Ovo polje je obavezno'})}
              label="OPIS CILJA:"
              placeholder="Unesite opis..."
              textarea
              error={errors?.goals?.[goalId ?? 0]?.description?.message as string}
            />

            <IndicatorButtonWrapper>
              <IndicatorTitle content="INDIKATORI" variant="bodySmall" />
              <ButtonWrapper>
                <Button
                  variant="secondary"
                  content="Dodaj indikator"
                  onClick={() => toggleModal(fields.length)}
                  disabled={disabled}
                />
              </ButtonWrapper>
            </IndicatorButtonWrapper>
            {!!fields.length && (
              <Table
                tableHeads={goalIndicatorsTableHeads}
                emptyMessage={'Nema indikatora'}
                tableActions={disabled ? [] : tableActions}
                data={fields}
                onRowClick={row => {
                  handleEditIndicator(row.id);
                }}
              />
            )}
          </FormWrapper>
        }
      />
      {indicatorId !== undefined && (
        <IndicatorModalFinanceOfficer
          indicatorId={indicatorId}
          goalId={goalId}
          onClose={toggleModal}
          handleAddIndicator={handleAddIndicator}
          disabled={disabled}
        />
      )}
    </>
  );
};
