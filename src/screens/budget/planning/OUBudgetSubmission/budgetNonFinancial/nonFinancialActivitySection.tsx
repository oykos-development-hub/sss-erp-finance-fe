import {Button, Input, Table, EditIconTwo, Theme, TrashIcon} from 'client-library';
import {useFieldArray, useFormContext} from 'react-hook-form';
import {
  ButtonWrapper,
  InputComponent,
  InputWrapper,
  ProgramTitle,
  ProgramTitleContainer,
  ProgramWrapper,
  TextAreaWrapper,
} from './styles';
import {useEffect, useMemo, useState} from 'react';
import {Goal, NonFinancialForm} from '../../../../../types/nonFinance.ts';
import {GoalsModalFinanceOfficer} from '../../../../../components/goalsModalFinanceOfficer/goalsModalFinanceOfficer.tsx';
import {Activity} from '../../../../../types/graphQL/budgetRequestDetails.ts';
import {activityGoalsTableHeads} from '../constants.tsx';

interface NonFinancialActivitySectionProps {
  activity?: Activity;
  disabled?: boolean;
}

export const NonFinancialActivitySection = ({activity, disabled}: NonFinancialActivitySectionProps) => {
  const [goalId, setGoalId] = useState<number | undefined>(undefined);
  const [trigger, setTrigger] = useState(false);
  const toggleModal = (id?: number) => {
    console.log(id, 'toggle modal id');
    id !== undefined ? setGoalId(id) : setGoalId(undefined);
  };

  const {control} = useFormContext<NonFinancialForm>();
  const {fields, append, remove} = useFieldArray({name: 'goals', control});

  const findIndex = (id: any) => fields.findIndex(goal => goal.id === id);

  const tableActions = [
    {
      name: 'Izmijeni',
      onClick: (row: any) => {
        handleEditGoal(row.id);
      },
      icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
    },
    {
      name: 'Izbriši',
      onClick: (row: any) => handleRemoveGoal(row.id),
      icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
    },
  ];

  const handleAddGoal = (data: Goal) => {
    console.log('handleAddGoal', data);
    append({title: data.title, description: data.description, indicators: data.indicators});
    setTrigger(true);
    toggleModal();
  };

  useEffect(() => {
    // TODO remove
    //  temp fix because table won't update when adding new goal
    console.log(trigger, 'trigger');
    if (trigger) {
      handleRemoveGoal(fields.length - 1);
      setTrigger(false);
    }
  }, [trigger, goalId]);

  const handleRemoveGoal = (id: number | string) => {
    remove(findIndex(id));
  };

  const handleEditGoal = (id: number | string) => {
    toggleModal(findIndex(id));
  };

  const memoizedTable = useMemo(() => {
    return (
      !!fields.length && (
        <Table
          tableHeads={activityGoalsTableHeads}
          emptyMessage={'Nema ciljeva'}
          tableActions={tableActions}
          data={fields}
          onRowClick={row => {
            handleEditGoal(row.id);
          }}
        />
      )
    );
  }, [fields, goalId]);
  return (
    <>
      <ProgramTitleContainer>
        <ProgramTitle variant="bodyMedium" content="DETALJI AKTIVNOSTI" style={{fontWeight: 600}} />
      </ProgramTitleContainer>
      <ProgramWrapper>
        <InputWrapper>
          <Input label="NAZIV AKTIVNOSTI:" value={activity?.title ?? ''} style={{marginRight: 10}} disabled />
          <InputComponent label="KOD:" value={activity?.code ?? ''} disabled />
        </InputWrapper>
        <TextAreaWrapper>
          <Input label="OPIS:" textarea value={activity?.description ?? ''} disabled />
        </TextAreaWrapper>
        {memoizedTable}
        <ButtonWrapper>
          {/*<Button content="Dodajte ciljeve" variant="secondary" onClick={toggleModal} disabled={disabled} />*/}
          <Button
            content="Dodajte ciljeve"
            variant="secondary"
            onClick={() => toggleModal(fields.length)}
            disabled={disabled}
          />
        </ButtonWrapper>
      </ProgramWrapper>
      {goalId !== undefined && (
        <GoalsModalFinanceOfficer
          goalId={goalId}
          onClose={() => toggleModal()}
          handleAddGoal={handleAddGoal}
          goals={fields}
        />
      )}
    </>
  );
};
