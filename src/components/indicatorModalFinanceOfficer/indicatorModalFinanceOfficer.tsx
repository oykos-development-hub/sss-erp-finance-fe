import {Modal} from 'client-library';
import React from 'react';
import {useFormContext} from 'react-hook-form';
import {FormWrapper, InputComponent, InputWrapper, MainTitle} from './styles';
import {IndicatorModalProps} from './types';
import {NonFinancialForm} from '../../types/nonFinance.ts';

export const IndicatorModalFinanceOfficer: React.FC<IndicatorModalProps> = ({
  goalId = 0,
  indicatorId = 0,
  onClose,
  handleAddIndicator,
}) => {
  const {
    register,
    formState: {errors},
  } = useFormContext<NonFinancialForm>();

  const handleSave = () => {
    handleAddIndicator({});
    onClose();
  };
  return (
    <Modal
      open={indicatorId !== undefined}
      onClose={() => onClose()}
      title="DODAJTE INDIKATOR"
      leftButtonText="Otkaži"
      rightButtonText="Sačuvaj"
      rightButtonOnClick={handleSave}
      content={
        <FormWrapper>
          <InputWrapper>
            <InputComponent
              {...register(`goals.${goalId}.indicators.${indicatorId}.performance_indicator_code`)}
              label="KOD INDIKATORA UČINKA:"
              error={errors?.goals?.[goalId]?.indicators?.[indicatorId]?.performance_indicator_code?.message as string}
            />
            <InputComponent
              {...register(`goals.${goalId}.indicators.${indicatorId}.indicator_source`)}
              label="IZVOR INDIKATORA:"
              error={errors?.goals?.[goalId]?.indicators?.[indicatorId]?.indicator_source?.message as string}
            />
            <InputComponent
              {...register(`goals.${goalId}.indicators.${indicatorId}.base_year`)}
              label="BAZNA GODINA:"
              error={errors?.goals?.[goalId]?.indicators?.[indicatorId]?.base_year?.message as string}
            />
          </InputWrapper>
          <InputWrapper>
            <InputComponent
              {...register(`goals.${goalId}.indicators.${indicatorId}.gender_equality`)}
              label="RODNA RAVNOPRAVNOST:"
              error={errors?.goals?.[goalId]?.indicators?.[indicatorId]?.gender_equality?.message as string}
            />
            <InputComponent
              {...register(`goals.${goalId}.indicators.${indicatorId}.base_value`)}
              label="BAZNA VRIJEDNOST:"
              error={errors?.goals?.[goalId]?.indicators?.[indicatorId]?.base_value?.message as string}
            />
          </InputWrapper>
          <InputWrapper>
            <InputComponent
              {...register(`goals.${goalId}.indicators.${indicatorId}.source_of_information`)}
              label="IZVOR INFORMACIJA:"
              error={errors?.goals?.[goalId]?.indicators?.[indicatorId]?.source_of_information?.message as string}
            />
            <InputComponent
              {...register(`goals.${goalId}.indicators.${indicatorId}.unit_of_measure`)}
              label="JEDINICA MJERE:"
              error={errors?.goals?.[goalId]?.indicators?.[indicatorId]?.unit_of_measure?.message as string}
            />
            <InputComponent
              {...register(`goals.${goalId}.indicators.${indicatorId}.indicator_description`)}
              label="OPIS INDIKATORA:"
              error={errors?.goals?.[goalId]?.indicators?.[indicatorId]?.indicator_description?.message as string}
            />
          </InputWrapper>
          <MainTitle content="PLANIRANA, REVIDIRANA I OSTVARENA VRIJEDNOST U GODINI N+1" variant="bodyMedium" />
          <InputWrapper>
            <InputComponent
              {...register(`goals.${goalId}.indicators.${indicatorId}.planned_value_1`)}
              error={errors?.goals?.[goalId]?.indicators?.[indicatorId]?.planned_value_1?.message as string}
            />
            <InputComponent
              {...register(`goals.${goalId}.indicators.${indicatorId}.revised_value_1`)}
              error={errors?.goals?.[goalId]?.indicators?.[indicatorId]?.revised_value_1?.message as string}
            />
            <InputComponent
              {...register(`goals.${goalId}.indicators.${indicatorId}.achieved_value_1`)}
              error={errors?.goals?.[goalId]?.indicators?.[indicatorId]?.achieved_value_1?.message as string}
            />
          </InputWrapper>
          <MainTitle content="PLANIRANA, REVIDIRANA I OSTVARENA VRIJEDNOST U GODINI N+2" variant="bodyMedium" />
          <InputWrapper>
            <InputComponent
              {...register(`goals.${goalId}.indicators.${indicatorId}.planned_value_2`)}
              error={errors?.goals?.[goalId]?.indicators?.[indicatorId]?.planned_value_2?.message as string}
            />
            <InputComponent
              {...register(`goals.${goalId}.indicators.${indicatorId}.revised_value_2`)}
              error={errors?.goals?.[goalId]?.indicators?.[indicatorId]?.revised_value_2?.message as string}
            />
            <InputComponent
              {...register(`goals.${goalId}.indicators.${indicatorId}.achieved_value_2`)}
              error={errors?.goals?.[goalId]?.indicators?.[indicatorId]?.achieved_value_2?.message as string}
            />
          </InputWrapper>
          <MainTitle content="PLANIRANA, REVIDIRANA I OSTVARENA VRIJEDNOST U GODINI N+3" variant="bodyMedium" />
          <InputWrapper>
            <InputComponent
              {...register(`goals.${goalId}.indicators.${indicatorId}.planned_value_3`)}
              error={errors?.goals?.[goalId]?.indicators?.[indicatorId]?.planned_value_3?.message as string}
            />
            <InputComponent
              {...register(`goals.${goalId}.indicators.${indicatorId}.revised_value_3`)}
              error={errors?.goals?.[goalId]?.indicators?.[indicatorId]?.revised_value_3?.message as string}
            />
            <InputComponent
              {...register(`goals.${goalId}.indicators.${indicatorId}.achieved_value_3`)}
              error={errors?.goals?.[goalId]?.indicators?.[indicatorId]?.achieved_value_3?.message as string}
            />
          </InputWrapper>
        </FormWrapper>
      }
    />
  );
};
