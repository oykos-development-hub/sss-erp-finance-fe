import {Modal} from 'client-library';
import React from 'react';
import {useFormContext} from 'react-hook-form';
import {FormWrapper, InputComponent, InputWrapper, MainTitle} from './styles';
import {IndicatorModalProps} from './types';
import {NonFinancialForm} from '../../types/nonFinance.ts';

export const IndicatorModalFinanceOfficer: React.FC<IndicatorModalProps> = ({open, onClose}) => {
  const {
    register,
    formState: {errors},
  } = useFormContext<NonFinancialForm>();

  const goalIndex = 0;
  const indicatorIndex = 0;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="DODAJTE INDIKATOR"
      leftButtonText="Otkaži"
      rightButtonText="Sačuvaj"
      content={
        <FormWrapper>
          <InputWrapper>
            <InputComponent
              {...register(`goals.${goalIndex}.indicators.${indicatorIndex}.performance_indicator_code`)}
              label="KOD INDIKATORA UČINKA:"
              error={
                errors?.goals?.[goalIndex]?.indicators?.[indicatorIndex]?.performance_indicator_code?.message as string
              }
            />
            <InputComponent
              {...register(`goals.${goalIndex}.indicators.${indicatorIndex}.indicator_source`)}
              label="IZVOR INDIKATORA:"
              error={errors?.goals?.[goalIndex]?.indicators?.[indicatorIndex]?.indicator_source?.message as string}
            />
            <InputComponent
              {...register(`goals.${goalIndex}.indicators.${indicatorIndex}.base_year`)}
              label="BAZNA GODINA:"
              error={errors?.goals?.[goalIndex]?.indicators?.[indicatorIndex]?.base_year?.message as string}
            />
          </InputWrapper>
          <InputWrapper>
            <InputComponent
              {...register(`goals.${goalIndex}.indicators.${indicatorIndex}.gender_equality`)}
              label="RODNA RAVNOPRAVNOST:"
              error={errors?.goals?.[goalIndex]?.indicators?.[indicatorIndex]?.gender_equality?.message as string}
            />
            <InputComponent
              {...register(`goals.${goalIndex}.indicators.${indicatorIndex}.base_value`)}
              label="BAZNA VRIJEDNOST:"
              error={errors?.goals?.[goalIndex]?.indicators?.[indicatorIndex]?.base_value?.message as string}
            />
            {/*/!*TODO check later rodne ravnopravnosti x2*!/*/}
            {/*<InputComponent*/}
            {/*  {...register(`goals.${goalIndex}.indicators.${indicatorIndex}.`)}*/}
            {/*  label="RODNE RAVNOPRAVNOSTI:"*/}
            {/*  error={errors?.goals?.[goalIndex]?.indicators?.[indicatorIndex]?.?.message as string}*/}
            {/*/>*/}
          </InputWrapper>
          <InputWrapper>
            <InputComponent
              {...register(`goals.${goalIndex}.indicators.${indicatorIndex}.source_of_information`)}
              label="IZVOR INFORMACIJA:"
              error={errors?.goals?.[goalIndex]?.indicators?.[indicatorIndex]?.source_of_information?.message as string}
            />
            <InputComponent
              {...register(`goals.${goalIndex}.indicators.${indicatorIndex}.unit_of_measure`)}
              label="JEDINICA MJERE:"
              error={errors?.goals?.[goalIndex]?.indicators?.[indicatorIndex]?.unit_of_measure?.message as string}
            />
            <InputComponent
              {...register(`goals.${goalIndex}.indicators.${indicatorIndex}.indicator_description`)}
              label="OPIS INDIKATORA:"
              error={errors?.goals?.[goalIndex]?.indicators?.[indicatorIndex]?.indicator_description?.message as string}
            />
          </InputWrapper>
          <MainTitle content="PLANIRANA, REVIDIRANA I OSTVARENA VRIJEDNOST U GODINI N+1" variant="bodyMedium" />
          <InputWrapper>
            <InputComponent
              {...register(`goals.${goalIndex}.indicators.${indicatorIndex}.planned_value_1`)}
              error={errors?.goals?.[goalIndex]?.indicators?.[indicatorIndex]?.planned_value_1?.message as string}
            />
            <InputComponent
              {...register(`goals.${goalIndex}.indicators.${indicatorIndex}.revised_value_1`)}
              error={errors?.goals?.[goalIndex]?.indicators?.[indicatorIndex]?.revised_value_1?.message as string}
            />
            <InputComponent
              {...register(`goals.${goalIndex}.indicators.${indicatorIndex}.achieved_value_1`)}
              error={errors?.goals?.[goalIndex]?.indicators?.[indicatorIndex]?.achieved_value_1?.message as string}
            />
          </InputWrapper>
          <MainTitle content="PLANIRANA, REVIDIRANA I OSTVARENA VRIJEDNOST U GODINI N+2" variant="bodyMedium" />
          <InputWrapper>
            <InputComponent
              {...register(`goals.${goalIndex}.indicators.${indicatorIndex}.planned_value_2`)}
              error={errors?.goals?.[goalIndex]?.indicators?.[indicatorIndex]?.planned_value_2?.message as string}
            />
            <InputComponent
              {...register(`goals.${goalIndex}.indicators.${indicatorIndex}.revised_value_2`)}
              error={errors?.goals?.[goalIndex]?.indicators?.[indicatorIndex]?.revised_value_2?.message as string}
            />
            <InputComponent
              {...register(`goals.${goalIndex}.indicators.${indicatorIndex}.achieved_value_2`)}
              error={errors?.goals?.[goalIndex]?.indicators?.[indicatorIndex]?.achieved_value_2?.message as string}
            />
          </InputWrapper>
          <MainTitle content="PLANIRANA, REVIDIRANA I OSTVARENA VRIJEDNOST U GODINI N+3" variant="bodyMedium" />
          <InputWrapper>
            <InputComponent
              {...register(`goals.${goalIndex}.indicators.${indicatorIndex}.planned_value_3`)}
              error={errors?.goals?.[goalIndex]?.indicators?.[indicatorIndex]?.planned_value_3?.message as string}
            />
            <InputComponent
              {...register(`goals.${goalIndex}.indicators.${indicatorIndex}.revised_value_3`)}
              error={errors?.goals?.[goalIndex]?.indicators?.[indicatorIndex]?.revised_value_3?.message as string}
            />
            <InputComponent
              {...register(`goals.${goalIndex}.indicators.${indicatorIndex}.achieved_value_3`)}
              error={errors?.goals?.[goalIndex]?.indicators?.[indicatorIndex]?.achieved_value_3?.message as string}
            />
          </InputWrapper>
        </FormWrapper>
      }
    />
  );
};
