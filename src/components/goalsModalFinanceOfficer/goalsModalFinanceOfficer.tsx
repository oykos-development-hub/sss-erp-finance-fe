import {Modal, Input, Button} from 'client-library';
import {useState} from 'react';
import {useFormContext} from 'react-hook-form';
import {ButtonWrapper, FormWrapper, IndicatorButtonWrapper, IndicatorTitle, InputWrapper} from './styles';
import {GoalsModalFinanceOfficerProps} from './types';
import {NonFinancialForm} from '../../types/nonFinance.ts';
import {IndicatorModalFinanceOfficer} from '../indicatorModalFinanceOfficer/indicatorModalFinanceOfficer.tsx';

// Goals modal used by finance officer when filling non-financial part of the budget
export const GoalsModalFinanceOfficer = ({open, onClose, handleAddGoal, goals}: GoalsModalFinanceOfficerProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const {
    register,
    formState: {errors},
    getValues,
    // control,
  } = useFormContext<NonFinancialForm>();

  // const {fields, append, remove} = useFieldArray({name: `goals.${goals.length}.indicators`, control});

  const handleSave = () => {
    const title = getValues(`goals.${goals.length}.title`);
    const description = getValues(`goals.${goals.length}.description`);

    handleAddGoal({title, description, indicators: [], id: 12345});
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        leftButtonText="Otkaži"
        rightButtonText="Sačuvaj"
        rightButtonOnClick={handleSave}
        content={
          <FormWrapper>
            <InputWrapper>
              <Input
                {...register(`goals.${goals.length}.title`)}
                label="NAZIV CILJA:"
                error={errors?.goals?.[goals.length]?.title?.message as string}
                placeholder="Unesite naziv..."
              />
            </InputWrapper>
            <Input
              {...register(`goals.${goals.length}.description`, {required: 'Ovo polje je obavezno'})}
              label="OPIS CILJA:"
              placeholder="Unesite opis..."
              textarea
              error={errors?.goals?.[goals.length]?.description?.message as string}
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
      {showModal && (
        <IndicatorModalFinanceOfficer open={showModal} onClose={() => setShowModal(prevState => !prevState)} />
      )}
    </>
  );
};
