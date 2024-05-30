import {Button, Input} from 'client-library';
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
import {useEffect, useState} from 'react';
import {Goal, NonFinancialForm} from '../../../../../types/nonFinance.ts';
import {GoalsModalFinanceOfficer} from '../../../../../components/goalsModalFinanceOfficer/goalsModalFinanceOfficer.tsx';
import {Typography} from '@oykos-development/devkit-react-ts-styled-components';
import {Activity} from '../../../../../types/graphQL/budgetRequestDetails.ts';

interface NonFinancialActivitySectionProps {
  activity?: Activity;
  disabled?: boolean;
}

export const NonFinancialActivitySection = ({activity, disabled}: NonFinancialActivitySectionProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const {control} = useFormContext<NonFinancialForm>();
  const {fields, append} = useFieldArray({name: 'goals', control});

  // TODO remove
  useEffect(() => {
    console.log(fields, 'fields');
  }, [fields]);

  const handleAddGoal = (data: Goal) => {
    append({title: data.title, description: data.description, indicators: data.indicators, id: data.id});
  };
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
        <>
          {fields.map(goal => {
            return <Typography content={goal.title} variant="bodyMedium" key={goal.id} />;
          })}
        </>
        <ButtonWrapper>
          <Button
            content="Dodajte ciljeve"
            variant="secondary"
            onClick={() => setShowModal(prevState => !prevState)}
            disabled={disabled}
          />
        </ButtonWrapper>
      </ProgramWrapper>
      {showModal && (
        <GoalsModalFinanceOfficer
          open={showModal}
          onClose={() => setShowModal(prevState => !prevState)}
          handleAddGoal={handleAddGoal}
          goals={fields}
        />
      )}
    </>
  );
};
