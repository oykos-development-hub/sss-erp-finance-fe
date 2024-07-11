import {FormProvider, useForm} from 'react-hook-form';
import {Container, InputWrapper, MainTitle, SectionWrapper, InputComponent} from './styles.ts';
import {Input, Button} from 'client-library';
import {NonFinancialForm} from '../../../../../types/nonFinance.ts';
import useAppContext from '../../../../../context/useAppContext.ts';
import {NonFinancialActivitySection} from './nonFinancialActivitySection.tsx';
import useNonFinancialBudgetFill from '../../../../../services/graphQL/nonFinancialBudgetFill/useNonFinancialBudgetFill.ts';
import {BudgetRequestItem} from '../../../../../types/graphQL/budgetRequestDetails.ts';
import Footer from '../../../../../shared/footer.ts';
import {useEffect} from 'react';

export const NonFinanceOfficial = ({
  budgetRequestDetails,
  isPreview,
  refetch,
}: {
  budgetRequestDetails?: BudgetRequestItem;
  isPreview?: boolean;
  refetch?: () => void;
}) => {
  // const [programs, setPrograms] = useState<number[]>([]);
  const {
    alert,
    navigation: {navigate},
  } = useAppContext();

  const {nonFinancialBudgetFill} = useNonFinancialBudgetFill();

  //TODO unify all statuses in one enum - {id: 3, title: "Na čekanju"}
  const editingDisabled = budgetRequestDetails?.status?.id === 3;

  const methods = useForm<NonFinancialForm>({disabled: editingDisabled});
  const {
    register,
    formState: {isValid, errors},
    setValue,
    handleSubmit,
  } = methods;

  useEffect(() => {
    const {non_financial} = budgetRequestDetails ?? {};
    if (non_financial) {
      setValue('statement', non_financial.statement);
      setValue('contact_email', non_financial.contact_email);
      setValue('contact_phone', non_financial.contact_phone);
      setValue('contact_fullname', non_financial.contact_fullname);
      setValue('contact_working_place', non_financial.contact_working_place);
      setValue('impl_contact_email', non_financial.impl_contact_email);
      setValue('impl_contact_fullname', non_financial.impl_contact_fullname);
      setValue('impl_contact_phone', non_financial.impl_contact_phone);
      setValue('impl_contact_working_place', non_financial.impl_contact_working_place);
      setValue('goals', non_financial.activity.goals ?? []);
    }
  }, [budgetRequestDetails]);

  const handleSubmitNonFinancial = async (data: NonFinancialForm) => {
    if (isValid && budgetRequestDetails?.non_financial.request_id) {
      await nonFinancialBudgetFill(
        {...data, request_id: budgetRequestDetails?.non_financial.request_id},
        () => {
          refetch && refetch();
          navigate(`/finance/budget/planning/${budgetRequestDetails?.budget.id}/summary`);
          alert.success('Nefinansijski dio budžeta uspješno dodat');
        },
        () => {
          alert.error('Greška prilikom dodavanja nefinansijskog dijela budžeta');
        },
      );
    }
  };

  return (
    <Container>
      <FormProvider {...methods}>
        <SectionWrapper>
          {/*/!*TODO check if comment goes here*!/*/}
          {/*<BorderBox>*/}
          {/*  <BorderBoxItem>*/}
          {/*    <Typography content={'Komentar OJ:'} variant={'bodySmall'} style={{fontWeight: 600, marginRight: 10}} />*/}
          {/*    <Typography content={budgetRequestDetails?.non_financial?.official_comment ?? ''} variant={'bodySmall'} />*/}
          {/*  </BorderBoxItem>*/}
          {/*</BorderBox>*/}
          <MainTitle content="OSNOVNE INFORMACIJE" variant="bodyMedium" />
          <InputWrapper>
            <Input
              label="Naziv organizacione jedinice:"
              value={budgetRequestDetails?.non_financial?.activity?.organization_unit?.title ?? ''}
              disabled
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              label="Kod:"
              disabled
              value={budgetRequestDetails?.non_financial?.activity?.organization_unit?.code?.toString() ?? ''}
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
          activity={budgetRequestDetails?.non_financial.activity}
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
