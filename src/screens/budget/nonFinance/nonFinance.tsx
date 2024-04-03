import {MouseEvent} from 'react';
import {useForm} from 'react-hook-form';
import {
  Container,
  CustomDivider,
  InputWrapper,
  MainTitle,
  SectionWrapper,
  InputComponent,
  ButtonWrapper,
  AddProgramWrapper,
  AccordionMainWrapper,
} from './styles.ts';
import {Input, Button, PlusIcon, Theme} from 'client-library';
import {NonFinanceAccordion} from '../../../components/nonFinanceAccordion/nonFinanceAccordion.tsx';
import {useState} from 'react';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper.tsx';
import {NonFinanceForm} from '../../../types/nonFinance.ts';
import useInsertNonFinancial from '../../../services/graphQL/insertNonFinancial/useInsertNonFinancial.ts';
import useAppContext from '../../../context/useAppContext.ts';

export const NonFinance = () => {
  const [programs, setPrograms] = useState<number[]>([]);
  const {alert} = useAppContext();

  const {
    register,
    formState: {errors, isValid},
    handleSubmit,
  } = useForm<NonFinanceForm>();

  const handleAddProgram = (e: MouseEvent<HTMLElement> | undefined) => {
    e?.preventDefault();
    e?.stopPropagation();
    setPrograms(prevPrograms => {
      if (prevPrograms.length) {
        return [...prevPrograms, prevPrograms[prevPrograms.length - 1] + 1];
      } else {
        return [1];
      }
    });
  };

  const handleDeleteProgram = (id: number) => {
    setPrograms(prevPrograms => prevPrograms.filter(program => program !== id));
  };

  const {insertNonFinancial} = useInsertNonFinancial();
  const onSubmit = async (data: NonFinanceForm) => {
    if (isValid) {
      await insertNonFinancial(
        data,
        () => {
          alert.success('Nefinansijski dio budžeta uspješno dodat');
        },
        () => {
          alert.error('Greška prilikom dodavanja nefinansijskog dijela budžeta');
        },
      );
    }
  };

  return (
    <ScreenWrapper>
      <Container>
        <MainTitle content="BUDŽET 2022 - XXXXXXXX " variant="bodyMedium" />
        <CustomDivider />
        <SectionWrapper>
          <MainTitle content="OSNOVNE INFORMACIJE" variant="bodyMedium" />
          <InputWrapper>
            <Input
              label="Naziv organizacione jedinice:"
              //TODO check if this should just display data or be editable
              //{...register('name_of_organization_unit')}
              //error={errors.name_of_organization_unit?.message as string}
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              label="Kod:"
              //TODO check if this should just display data or be editable
              //{...register('organization_code')}
              //error={errors.organization_code?.message as string}
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              label="Izjava:"
              //TODO check if this should just display data or be editable
              //{...register('mission_statement')}
              //error={errors.mission_statement?.message as string}
            />
          </InputWrapper>
        </SectionWrapper>
        <SectionWrapper>
          <MainTitle content="ODGOVORNO LICE ZA SPROVOĐENJE PROGRAMA" variant="bodyMedium" />
          <InputWrapper>
            <InputComponent
              {...register('person_responsible_name_surname')}
              label="Ime i prezime:"
              error={errors.person_responsible_name_surname?.message as string}
            />
            <Input
              {...register('person_responsible_working_place')}
              label="Radno mjesto:"
              error={errors.person_responsible_working_place?.message as string}
            />
          </InputWrapper>
          <InputWrapper>
            <InputComponent
              {...register('person_responsible_telephone_number')}
              label="Broj telefona:"
              error={errors.person_responsible_telephone_number?.message as string}
            />
            <Input
              {...register('person_responsible_email')}
              label="Email adresa:"
              error={errors.person_responsible_email?.message as string}
            />
          </InputWrapper>
        </SectionWrapper>
        <SectionWrapper>
          <MainTitle content="KONTAKT OSOBA" variant="bodyMedium" />
          <InputWrapper>
            <InputComponent
              {...register('contact_person_name_surname')}
              label="Ime i prezime:"
              error={errors.contact_person_name_surname?.message as string}
            />
            <Input
              {...register('contact_person_working_place')}
              label="Radno mjesto:"
              error={errors.contact_person_working_place?.message as string}
            />
          </InputWrapper>
          <InputWrapper>
            <InputComponent
              {...register('contact_person_telephone_number')}
              label="Broj telefona:"
              error={errors.contact_person_telephone_number?.message as string}
            />
            <Input
              {...register('contact_person_email')}
              label="Email adresa:"
              error={errors.contact_person_email?.message as string}
            />
          </InputWrapper>
        </SectionWrapper>

        <ButtonWrapper>
          <Button content="Završi" variant="primary" onClick={handleSubmit(onSubmit)} />
        </ButtonWrapper>

        <AddProgramWrapper>
          <MainTitle content="DODAJTE PROGRAM" variant="bodyMedium" />
          <PlusIcon stroke={Theme?.palette?.gray800} onClick={handleAddProgram} />
        </AddProgramWrapper>

        {programs.map(programNo => (
          <AccordionMainWrapper key={`acc-wrap-${programNo}`}>
            <NonFinanceAccordion
              programNo={programNo}
              key={`acc-${programNo}`}
              handleDeleteProgram={handleDeleteProgram}
            />
          </AccordionMainWrapper>
        ))}
      </Container>
    </ScreenWrapper>
  );
};
