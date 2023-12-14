import {Button, Input} from 'client-library';
import {useForm} from 'react-hook-form';
import {
  ButtonWrapper,
  InputComponent,
  InputWrapper,
  ProgramTitle,
  ProgramTitleContainer,
  ProgramWrapper,
  TextAreaWrapper,
} from './styles';
import {GoalsModal} from '../goalsModal/goalsModal';
import {useState} from 'react';
import {SectionProps} from './types.ts';

export const ActivitySection = (props: SectionProps) => {
  const {programNo} = props;
  const [showModal, setShowModal] = useState<boolean>(false);

  const {
    register,
    formState: {errors},
  } = useForm();
  return (
    <>
      <ProgramTitleContainer>
        <ProgramTitle variant="bodyMedium" content="SEKCIJA 3 OD 3 - DETALJI AKTIVNOSTI" style={{fontWeight: 600}} />
      </ProgramTitleContainer>
      <ProgramWrapper>
        <InputWrapper>
          <Input {...register('title')} label="NAZIV AKTIVNOSTI:" error={errors.title?.message as string} />
          <InputComponent {...register('code')} label="KOD:" error={errors.code?.message as string} />
        </InputWrapper>
        <TextAreaWrapper>
          <Input
            {...register('description', {required: 'Ovo polje je obavezno'})}
            label="OPIS:"
            placeholder="Unesite opis..."
            textarea
            error={errors.description?.message as string}
          />
        </TextAreaWrapper>
        <ButtonWrapper>
          <Button
            content="Dodajte ciljeve u program"
            variant="secondary"
            onClick={() => setShowModal(prevState => !prevState)}
          />
        </ButtonWrapper>
      </ProgramWrapper>
      {showModal && (
        <GoalsModal
          open={showModal}
          onClose={() => setShowModal(prevState => !prevState)}
          budgetProgramId={programNo}
        />
      )}
    </>
  );
};
