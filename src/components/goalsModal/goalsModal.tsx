import {Modal, Input, Button} from 'client-library';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {ButtonWrapper, FormWrapper, IndicatorButtonWrapper, IndicatorTitle, InputWrapper} from './styles';
import {GoalsModalProps} from './types';
import {IndicatorModal} from '../indicatorModal/indicatorModal';
import useInsertGoals from '../../services/graphQL/insertNonFinancial/goals/useInsertGoals.ts';
import useAppContext from '../../context/useAppContext.ts';
import {ProgramGoal} from '../../types/nonFinance.ts';

export const GoalsModal = ({open, onClose, budgetProgramId}: GoalsModalProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const {insertGoals} = useInsertGoals();
  const {alert} = useAppContext();

  const {
    register,
    formState: {errors, isValid},
    handleSubmit,
  } = useForm<ProgramGoal>();

  const onSubmit = async (goalData: Partial<ProgramGoal>) => {
    if (isValid) {
      const data = {...goalData, budget_program_id: budgetProgramId};

      await insertGoals(
        data,
        () => {
          alert.success('Nefinansijski dio budžeta uspješno dodat');
          setShowModal(prevState => !prevState);
        },
        () => {
          alert.error('Greška prilikom dodavanja nefinansijskog dijela budžeta');
        },
      );
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={() => onClose()}
        leftButtonText="Otkaži"
        rightButtonText="Sačuvaj"
        rightButtonOnClick={handleSubmit(onSubmit)}
        content={
          <FormWrapper>
            <InputWrapper>
              <Input
                {...register('title')}
                label="NAZIV CILJA:"
                error={errors.title?.message as string}
                placeholder="Unesite naziv..."
              />
            </InputWrapper>
            <Input
              {...register('description', {required: 'Ovo polje je obavezno'})}
              label="OPIS CILJA:"
              placeholder="Unesite opis..."
              textarea
              error={errors.description?.message as string}
            />

            <IndicatorButtonWrapper>
              <IndicatorTitle content="INDIKATORI" variant="bodySmall" />
              <ButtonWrapper>
                <Button
                  variant="secondary"
                  content="Dodaj indikator"
                  onClick={() => setShowModal(prevState => !prevState)}
                />
              </ButtonWrapper>
            </IndicatorButtonWrapper>
          </FormWrapper>
        }
        title="DODAJTE NOVE CILJEVE"
      />
      {showModal && <IndicatorModal open={showModal} onClose={() => setShowModal(prevState => !prevState)} />}
    </>
  );
};
