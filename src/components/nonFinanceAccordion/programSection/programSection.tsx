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
} from '../styles.ts';
import {useState} from 'react';
import {GoalsModal} from '../../goalsModal/goalsModal';
import {SectionProps} from '../types.ts';

export const ProgramSection = (props: SectionProps) => {
  const {programNo} = props;
  const [showModal, setShowModal] = useState<boolean>(false);

  const {
    register,
    formState: {errors},
  } = useForm();

  return (
    <>
      <ProgramTitleContainer>
        <ProgramTitle variant="bodyMedium" content="SEKCIJA 1 OD 3 - DETALJI PROGRAMA" style={{fontWeight: 600}} />
      </ProgramTitleContainer>
      <ProgramWrapper>
        <InputWrapper>
          <Input {...register('title')} label="NAZIV PROGRAMA:" error={errors.title?.message as string} />
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
