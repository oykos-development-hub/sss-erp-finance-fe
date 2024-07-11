import {FormProvider, useForm} from 'react-hook-form';
import {Container, InputWrapper, MainTitle, SectionWrapper, InputComponent} from './styles.ts';
import {Input, Button} from 'client-library';
import {useEffect} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {NonFinancialActivitySection} from '../planning/OUBudgetSubmission/budgetNonFinancial/nonFinancialActivitySection.tsx';
import {NonFinancialForm} from '../../../types/nonFinance.ts';
import Footer from '../../../shared/footer.ts';
import useGetNonFinancialBudgetOverview from '../../../services/graphQL/budget/useGetNonFinancialBudgetOverview.ts';
import useUpdateNonFinancial from '../../../services/graphQL/insertNonFinancial/useUpdateNonFinancial.ts';

export const NonFinance = ({isPreview, refetch}: {isPreview?: boolean; refetch?: () => void}) => {
  const {
    alert,
    navigation: {
      navigate,
      location: {pathname},
    },
  } = useAppContext();

  const year = parseInt(pathname.split('/').pop());

  const {nonFinancialBudgets} = useGetNonFinancialBudgetOverview(year);
  const {updateNonFinancial} = useUpdateNonFinancial();

  const nonFinancialBudgetDetails = nonFinancialBudgets[0];
  //TODO unify all statuses in one enum - {id: 3, title: "Na čekanju"}
  const editingDisabled = nonFinancialBudgetDetails?.status?.id === 3;

  const methods = useForm<NonFinancialForm>({disabled: editingDisabled});
  const {
    register,
    formState: {isValid, errors},
    setValue,
    handleSubmit,
  } = methods;

  useEffect(() => {
    if (nonFinancialBudgetDetails) {
      setValue('statement', nonFinancialBudgetDetails.statement);
      setValue('contact_email', nonFinancialBudgetDetails.contact_email);
      setValue('contact_phone', nonFinancialBudgetDetails.contact_phone);
      setValue('contact_fullname', nonFinancialBudgetDetails.contact_fullname);
      setValue('contact_working_place', nonFinancialBudgetDetails.contact_working_place);
      setValue('impl_contact_email', nonFinancialBudgetDetails.impl_contact_email);
      setValue('impl_contact_fullname', nonFinancialBudgetDetails.impl_contact_fullname);
      setValue('impl_contact_phone', nonFinancialBudgetDetails.impl_contact_phone);
      setValue('impl_contact_working_place', nonFinancialBudgetDetails.impl_contact_working_place);
      setValue('goals', nonFinancialBudgetDetails.activity.goals ?? []);
    }
  }, [nonFinancialBudgetDetails]);

  const handleSubmitNonFinancial = async (data: NonFinancialForm) => {
    if (isValid && nonFinancialBudgetDetails.request_id) {
      await updateNonFinancial(
        {...data, request_id: nonFinancialBudgetDetails.request_id},
        () => {
          refetch && refetch();
          navigate('/finance/budget/current/non-financial');
          alert.success('Nefinansijski dio budžeta uspješno izmijenjen');
        },
        () => {
          alert.error('Greška prilikom izmjene nefinansijskog dijela budžeta');
        },
      );
    }
  };

  return (
    //   TODO check breadcrumbs and add screen wrapper
    <Container>
      <FormProvider {...methods}>
        <SectionWrapper>
          <MainTitle content="OSNOVNE INFORMACIJE" variant="bodyMedium" />
          <InputWrapper>
            <Input
              label="Naziv organizacione jedinice:"
              value={nonFinancialBudgetDetails?.activity?.organization_unit?.title ?? ''}
              disabled
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              label="Kod:"
              disabled
              value={nonFinancialBudgetDetails?.activity?.organization_unit?.code?.toString() ?? ''}
            />
          </InputWrapper>
          <InputWrapper>
            <Input label="Izjava:" {...register('statement')} error={errors.statement?.message as string} />
          </InputWrapper>
        </SectionWrapper>
        <SectionWrapper>
          <MainTitle content="ODGOVORNO LICE ZA SPROVOĐENJE PROGRAMA" variant="bodyMedium" />
          <InputWrapper>
            <InputComponent
              {...register('impl_contact_fullname')}
              label="Ime i prezime:"
              error={errors.impl_contact_fullname?.message as string}
            />
            <Input
              {...register('impl_contact_working_place')}
              label="Radno mjesto:"
              error={errors.impl_contact_working_place?.message as string}
            />
          </InputWrapper>
          <InputWrapper>
            <InputComponent
              {...register('impl_contact_phone')}
              label="Broj telefona:"
              error={errors.impl_contact_phone?.message as string}
            />
            <Input
              {...register('impl_contact_email')}
              label="Email adresa:"
              error={errors.impl_contact_email?.message as string}
            />
          </InputWrapper>
        </SectionWrapper>
        <SectionWrapper>
          <MainTitle content="KONTAKT OSOBA" variant="bodyMedium" />
          <InputWrapper>
            <InputComponent
              {...register('contact_fullname')}
              label="Ime i prezime:"
              error={errors.contact_fullname?.message as string}
            />
            <Input
              {...register('contact_working_place')}
              label="Radno mjesto:"
              error={errors.contact_working_place?.message as string}
            />
          </InputWrapper>
          <InputWrapper>
            <InputComponent
              {...register('contact_phone')}
              label="Broj telefona:"
              error={errors.contact_phone?.message as string}
            />
            <Input
              {...register('contact_email')}
              label="Email adresa:"
              error={errors.contact_email?.message as string}
            />
          </InputWrapper>
        </SectionWrapper>

        <NonFinancialActivitySection
          activity={nonFinancialBudgetDetails?.activity}
          disabled={editingDisabled || isPreview}
        />
        {!isPreview && (
          <Footer>
            {/*<Button content="Nazad" variant="secondary" onClick={handleReset} />*/}
            <Button
              content="Sačuvaj"
              variant="secondary"
              onClick={handleSubmit(handleSubmitNonFinancial)}
              disabled={editingDisabled}
            />
          </Footer>
        )}
      </FormProvider>
    </Container>
  );
};
