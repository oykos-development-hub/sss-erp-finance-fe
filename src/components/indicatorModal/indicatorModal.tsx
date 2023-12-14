import {Modal} from 'client-library';
import React from 'react';
import {useForm} from 'react-hook-form';
import {FormWrapper, InputComponent, InputWrapper, MainTitle} from './styles';
import {IndicatorModalProps} from './types';

export const IndicatorModal: React.FC<IndicatorModalProps> = ({open, onClose}) => {
  const {
    register,
    formState: {errors},
  } = useForm();

  // TODO when BE is done register all fields with correct names
  return (
    <Modal
      open={open}
      onClose={() => onClose()}
      leftButtonText="Otkaži"
      rightButtonText="Sačuvaj"
      content={
        <FormWrapper>
          <InputWrapper>
            <InputComponent
              {...register('title')}
              label="KOD INDIKATORA UČINKA:"
              error={errors.title?.message as string}
            />
            <InputComponent {...register('title')} label="IZVOR INDIKATORA:" error={errors.title?.message as string} />
            <InputComponent {...register('title')} label="BAZNA GODINA:" error={errors.title?.message as string} />
          </InputWrapper>
          <InputWrapper>
            <InputComponent
              {...register('title')}
              label="RODNA RAVNOPRAVNOST:"
              error={errors.title?.message as string}
            />
            <InputComponent {...register('title')} label="BAZNA VRIJEDNOST:" error={errors.title?.message as string} />
            <InputComponent
              {...register('title')}
              label="RODNE RAVNOPRAVNOSTI:"
              error={errors.title?.message as string}
            />
          </InputWrapper>
          <InputWrapper>
            <InputComponent {...register('title')} label="IZVOR INFORMACIJA:" error={errors.title?.message as string} />
            <InputComponent {...register('title')} label="JEDINICA MJERE:" error={errors.title?.message as string} />
            <InputComponent {...register('title')} label="OPIS INDIKATORA:" error={errors.title?.message as string} />
          </InputWrapper>
          <MainTitle content="PLANIRANA, REVIDIRANA I OSTVARENA VRIJEDNOST U GODINI N+1" variant="bodyMedium" />
          <InputWrapper>
            <InputComponent {...register('title')} error={errors.title?.message as string} />
            <InputComponent {...register('title')} error={errors.title?.message as string} />
            <InputComponent {...register('title')} error={errors.title?.message as string} />
          </InputWrapper>
          <MainTitle content="PLANIRANA, REVIDIRANA I OSTVARENA VRIJEDNOST U GODINI N+2" variant="bodyMedium" />
          <InputWrapper>
            <InputComponent {...register('title')} error={errors.title?.message as string} />
            <InputComponent {...register('title')} error={errors.title?.message as string} />
            <InputComponent {...register('title')} error={errors.title?.message as string} />
          </InputWrapper>
          <MainTitle content="PLANIRANA, REVIDIRANA I OSTVARENA VRIJEDNOST U GODINI N+3" variant="bodyMedium" />
          <InputWrapper>
            <InputComponent {...register('title')} error={errors.title?.message as string} />
            <InputComponent {...register('title')} error={errors.title?.message as string} />
            <InputComponent {...register('title')} error={errors.title?.message as string} />
          </InputWrapper>
        </FormWrapper>
      }
      title="DODAJTE INDIKATOR"
    />
  );
};
