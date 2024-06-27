import {
  SalariesFormContainer,
  Row,
  FileUploadStepTitle,
  InfoBoxWrapper,
  InfoBox,
  InfoBoxText,
  TitleDivider,
  Title,
  AddIcon,
  FileTypeWarning,
  FileUploadErrorsWrapper,
} from './styles.ts';
import Footer from '../../../../shared/footer.ts';
import {
  Dropdown,
  Datepicker,
  Input,
  Button,
  FileUpload,
  Typography,
  TableHead,
  Table,
  PlusIcon,
  Theme,
  TrashIcon,
} from 'client-library';
import {FileUploadWrapper} from '../../../../shared/FileUploadWrapper.ts';
import {generateDropdownOptions, requiredError} from '../../../../constants.ts';
import {Controller, useFieldArray, useForm} from 'react-hook-form';
import {getMonthOptions} from '../../../../utils/getMonthOptions.ts';
import {formatCurrency} from '../../../../utils/roundCurrency.ts';
import useGetCountOverview from '../../../../services/graphQL/counts/useGetCountOverview.ts';
import {useEffect, useMemo, useState} from 'react';
import {
  AdditionalSalaryExpenseType,
  contributionsTitleOptions,
  generateUsersDropdownOptions,
  mockedActivitiesDropdownOption,
  tableHeads,
} from '../constants.tsx';
import {Salary, SalaryAdditionalExpense, SalaryAdditionalExpenseParams} from '../../../../types/graphQL/salaries.ts';
import useGetUserProfiles from '../../../../services/graphQL/userProfiles/useGetUserProfiles.ts';
import useAppContext from '../../../../context/useAppContext.ts';
import useInsertSalary from '../../../../services/graphQL/salaries/useInsertSalary.ts';
import {parseDateForBackend} from '../../../../utils/dateUtils.ts';
import {importSuspensionsExcel} from '../../../../services/importExcel/importSuspensions.ts';
import {importSalariesExcel} from '../../../../services/importExcel/importSalaries.ts';
import useGetSuppliers from '../../../../services/graphQL/suppliers/useGetSuppliers.ts';
import {getSuppliersDropdown} from '../salaryUtils.ts';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {optionsNumberSchema, optionsStringSchema} from '../../../../utils/formSchemas.ts';
import {Supplier} from '../../../../types/graphQL/suppliers.ts';

const salaryAdditionalExpensesSchema = yup.object().shape({
  account: optionsNumberSchema.required(requiredError).default(null),
  amount: yup.number().required(requiredError).typeError('Morate unijeti broj').min(1, 'Iznos mora biti veći od 0'),
  subject: optionsNumberSchema.required(requiredError).default(null),
  bank_account: optionsStringSchema.required(requiredError).default(null),
  organization_unit_id: yup.number(),
  title: yup.string().required(requiredError),
  type: yup.string().required(requiredError),
  debtor: optionsNumberSchema.when('type', {
    is: 'suspensions',
    then: schema => schema.required(requiredError).default(null),
  }),
});

const salarySchema = yup.object().shape({
  activity: optionsNumberSchema.required(requiredError).default(null),
  month: optionsStringSchema.required(requiredError).default(null),
  date_of_calculation: yup.string().required(requiredError),
  description: yup.string(),
  salary_additional_expenses: yup
    .array()
    .of(salaryAdditionalExpensesSchema)
    .test('unique-title-for-contributions', 'Naziv doprinosa mora biti jedinstven', function (expenses) {
      // Collect all titles where type is 'contributions'
      const contributions = expenses?.filter(expense => expense.type === 'contributions').map(expense => expense.title);
      // Use a Set to find unique titles
      const uniqueContributions = new Set(contributions);
      return contributions?.length === uniqueContributions.size;
    }),
  // salary_additional_expenses: yup.array().of(salaryAdditionalExpensesSchema),
});

const initialValues = {
  activity: undefined,
  month: undefined,
  date_of_calculation: '',
  description: '',
  salary_additional_expenses: [
    {
      account: undefined,
      amount: 0,
      subject: undefined,
      debtor: undefined,
      bank_account: undefined,
      organization_unit_id: 0,
      title: '',
      type: '',
    },
  ],
};

type SalaryForm = yup.InferType<typeof salarySchema>;

interface SalaryFormProps {
  salary?: Salary;
  refetchSalary?: () => Promise<void>;
}

const SalaryForm = ({salary, refetchSalary}: SalaryFormProps) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: {errors},
    watch,
    setValue,
    clearErrors,
  } = useForm<SalaryForm>({defaultValues: initialValues, resolver: yupResolver(salarySchema)});

  const {
    contextMain: {
      organization_unit: {id: organization_unit_id},
      token,
    },
    navigation: {navigate},
    alert,
  } = useAppContext();
  const monthOptions = getMonthOptions(false);

  const {counts} = useGetCountOverview({});
  const {insertSalary} = useInsertSalary();
  const {suppliers} = useGetSuppliers({entity: 'other'});
  const {suppliers: banks} = useGetSuppliers({entity: 'bank'});
  const [importSuspensionsErrors, setImportSuspensionsErrors] = useState<string[]>([]);
  const [importSalariesErrors, setImportSalariesErrors] = useState<string[]>([]);
  const [totalEmployees, setTotalEmployees] = useState(0);

  const additionalSalaryExpenses = watch('salary_additional_expenses');
  const contributionsExpenses = additionalSalaryExpenses
    ?.filter(expense => expense.type === 'contributions')
    .map(expense => expense.title);

  const suppliersDropdownOptions = useMemo(() => {
    return getSuppliersDropdown(suppliers);
  }, [suppliers]);

  const countsDropdownOptions = useMemo(() => {
    return generateDropdownOptions(counts);
  }, [counts]);

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'salary_additional_expenses',
  });

  const {userProfiles} = useGetUserProfiles({
    page: 1,
    size: 10000,
    organization_unit_id,
  });

  const onDelete = (row: any) => {
    remove(findIndexInFieldsArray(row.id));
  };

  const tableActions = [
    {
      name: 'Izbriši',
      onClick: onDelete,
      icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
      shouldRender: () => !salary?.registred,
    },
  ];

  const debtorDropdownOptions = generateUsersDropdownOptions(userProfiles);

  const handleImportResponse = (response: any, type: 'salaries' | 'suspensions') => {
    if (!response?.status) return;

    if (response?.validation?.length) {
      const errorsArr = response?.validation?.map(
        (error: {column: number; message: string; row: number}) =>
          `Red ${error.row}, Kolona ${error.column}: ${error.message}`,
      );

      type === 'salaries' && setImportSalariesErrors(errorsArr);
      type === 'suspensions' && setImportSuspensionsErrors(errorsArr);
      return;
    }

    if (!response.data?.length) return;
    setImportSalariesErrors([]);
    setImportSuspensionsErrors([]);

    if (type === 'salaries') {
      setTotalEmployees(response.number_of_employees);
    }

    response.data.forEach((additionalExpense: SalaryAdditionalExpenseParams) => {
      append({
        ...additionalExpense,
        amount: Math.round(additionalExpense.amount * 100) / 100,
        // TODO check if there is subject in the response, until then let the user select it manually
        subject: undefined,
        account: countsDropdownOptions.find(option => option.id === additionalExpense.account_id) ?? undefined,
        organization_unit_id: additionalExpense.organization_unit_id,
        debtor: debtorDropdownOptions.find(debtor => debtor.id === additionalExpense.debtor_id) ?? undefined,
        title: additionalExpense.title,
        bank_account: additionalExpense.bank_account
          ? {id: additionalExpense.bank_account, title: additionalExpense.bank_account}
          : undefined,
      } as any);
    });
  };

  const handleImportSuspensions = async (files: FileList) => {
    importSuspensionsExcel(files[0], organization_unit_id, token).then((response: any) =>
      handleImportResponse(response, 'suspensions'),
    );
  };

  const handleImportSalaries = async (files: FileList) => {
    importSalariesExcel(files[0], organization_unit_id, token).then((response: any) =>
      handleImportResponse(response, 'salaries'),
    );
  };

  const isNew = !salary;

  const onSubmit = async (data: any) => {
    const payload = {
      id: isNew ? undefined : salary?.id,
      activity_id: data.activity.id,
      month: data.month.id,
      date_of_calculation: parseDateForBackend(data.date_of_calculation) ?? '',
      organization_unit_id,
      description: data.description,
      number_of_employees: totalEmployees,
      salary_additional_expenses: data.salary_additional_expenses.map((additionalExpense: SalaryAdditionalExpense) => ({
        title: additionalExpense.title,
        account_id: additionalExpense.account.id,
        amount: additionalExpense.amount,
        subject_id: additionalExpense.subject.id,
        debtor_id: additionalExpense.type === 'suspensions' ? additionalExpense.debtor?.id : null,
        bank_account: additionalExpense.bank_account?.id,
        organization_unit_id,
        type: additionalExpense.type,
      })),
    };

    insertSalary(
      payload,
      salaryId => {
        if (isNew) {
          navigate(`/finance/liabilities-receivables/liabilities/salaries/${salaryId}`);
        }
        refetchSalary && refetchSalary();
        alert.success('Uspješno sačuvano.');
      },
      () => alert?.error('Greška. Promjene nisu sačuvane.'),
    );
  };

  const appendNewRow = (type: keyof typeof AdditionalSalaryExpenseType) => {
    append({
      subject: null,
      debtor: null,
      account: null,
      organization_unit_id,
      type,
      amount: 0,
      bank_account: null,
      title: '',
    } as any);
  };

  useEffect(() => {
    remove();
    if (!salary) return;

    // fill inputs
    reset({
      ...salary,
      activity: mockedActivitiesDropdownOption.find(option => option.id === salary.activity.id),
      month: monthOptions.find(option => option.id === salary.month),
      date_of_calculation: salary.date_of_calculation,
      description: salary.description,
      salary_additional_expenses: [],
    });

    // fill additional expenses inputs
    if (!salary.salary_additional_expenses.length) return;
    salary.salary_additional_expenses.forEach(additionalExpense => {
      append({
        ...additionalExpense,
        subject: additionalExpense.subject ?? undefined,
        debtor: additionalExpense.debtor
          ? additionalExpense.debtor.id === 0
            ? undefined
            : additionalExpense.debtor
          : undefined,
        account: countsDropdownOptions?.find(option => option.id === additionalExpense.account.id) ?? undefined,
        organization_unit_id: additionalExpense.organization_unit.id,
        title: additionalExpense.title,
        bank_account: additionalExpense.bank_account,
      } as any);
    });
  }, [salary]);

  const groupByType = (fields: any[]) => {
    return fields.reduce((acc, field) => {
      (acc[field.type] = acc[field.type] || []).push(field);
      return acc;
    }, {});
  };

  const groupedFields = useMemo(() => groupByType(fields), [fields, salary]);
  // const groupedFields = groupByType(fields);
  const suspensionsFields = groupedFields['suspensions'] ?? [];
  const contributionsFields = groupedFields['contributions'] ?? [];
  const taxesFields = groupedFields['taxes'] ?? [];
  const subtaxesFields = groupedFields['subtaxes'] ?? [];
  const banksFields = groupedFields['banks'] ?? [];

  const findIndexInFieldsArray = (id: string) => {
    return fields.findIndex(field => field.id === id);
  };

  const debtorTableHead: TableHead = {
    title: 'Dužnik',
    accessor: 'debtor',
    type: 'custom',
    renderContents: (_item, row) => {
      const index = findIndexInFieldsArray(row.id);

      return (
        <Controller
          name={`salary_additional_expenses.${index}.debtor`}
          control={control}
          render={({field: {name, value, onChange}}) => (
            <Dropdown
              name={name}
              value={value}
              onChange={onChange}
              placeholder={'Odaberite dužnika'}
              options={debtorDropdownOptions}
              isRequired
              error={errors.salary_additional_expenses?.[index]?.debtor?.message}
              isDisabled={salary?.registred}
            />
          )}
        />
      );
    },
  };

  const salariesAdditionalExpensesTableHeads: TableHead[] = [
    {
      title: 'Naziv',
      accessor: 'title',
      type: 'custom',
      width: '20%',
      renderContents: (_item, row) => {
        const index = findIndexInFieldsArray(row.id);
        return row.type === 'contributions' ? (
          <Controller
            name={`salary_additional_expenses.${index}.title`}
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={contributionsTitleOptions.find(option => option.id === value)}
                onChange={e => {
                  onChange(e?.id ?? '');
                }}
                placeholder={'Odaberite naziv'}
                //Filter options that were already selected
                options={contributionsTitleOptions.filter(option => !contributionsExpenses?.includes(option.id))}
                isRequired
                error={errors.salary_additional_expenses?.[index]?.title?.message}
                isDisabled={salary?.registred}
              />
            )}
          />
        ) : (
          <Input
            {...register(`salary_additional_expenses.${index}.title`)}
            error={errors.salary_additional_expenses?.[index]?.title?.message}
            disabled={salary?.registred}
          />
        );
      },
    },
    {
      title: 'Konto',
      accessor: 'account',
      type: 'custom',
      width: '20%',
      renderContents: (_item, row) => {
        const index = findIndexInFieldsArray(row.id);

        return (
          <Controller
            name={`salary_additional_expenses.${index}.account`}
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={value}
                onChange={onChange}
                placeholder={'Odaberite konto'}
                options={countsDropdownOptions}
                isRequired
                error={errors.salary_additional_expenses?.[index]?.account?.message}
                isDisabled={salary?.registred}
              />
            )}
          />
        );
      },
    },
    {
      title: 'Iznos',
      accessor: 'amount',
      type: 'custom',
      width: '200px',
      renderContents: (_item, row) => {
        const index = findIndexInFieldsArray(row.id);

        return (
          <Input
            {...register(`salary_additional_expenses.${index}.amount`)}
            type="number"
            leftContent={<div>€</div>}
            error={errors.salary_additional_expenses?.[index]?.amount?.message}
            disabled={salary?.registred}
          />
        );
      },
    },
    {
      title: 'Subjekat',
      accessor: 'subject',
      type: 'custom',
      renderContents: (_item, row) => {
        const index = findIndexInFieldsArray(row.id);

        const currentSubject = watch(`salary_additional_expenses.${index}.subject`);
        const isBank = row.type === 'banks';
        const dropdownOptions = isBank ? banks : (suppliersDropdownOptions as Supplier[]);
        const bankAccounts =
          dropdownOptions
            .find(option => option.id === currentSubject?.id)
            ?.bank_accounts.map(bankAcc => {
              return {id: bankAcc, title: bankAcc};
            }) ?? [];

        useEffect(() => {
          if (!bankAccounts.length) return;
          // automatically select first bank account for the subject
          setValue(`salary_additional_expenses.${index}.bank_account`, bankAccounts[0]);
          // clear bank account error if subject is changed and account is selected
          if (errors.salary_additional_expenses?.[index]?.bank_account?.message) {
            clearErrors(`salary_additional_expenses.${index}.bank_account`);
          }
        }, [currentSubject, bankAccounts, index, setValue]);

        return (
          <Controller
            name={`salary_additional_expenses.${index}.subject`}
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={value}
                onChange={selectedValue => {
                  onChange(selectedValue);
                  setValue(
                    `salary_additional_expenses.${index}.bank_account`,
                    bankAccounts?.length ? bankAccounts[0] : {id: '', title: ''},
                  );
                }}
                placeholder={'Odaberite subjekat'}
                options={row.type === 'banks' ? banks : (suppliersDropdownOptions as Supplier[])}
                isRequired
                error={errors.salary_additional_expenses?.[index]?.subject?.message}
                isDisabled={salary?.registred}
              />
            )}
          />
        );
      },
    },
    {
      title: 'Račun subjekta',
      accessor: 'bank_account',
      type: 'custom',
      renderContents: (_item, row) => {
        const index = findIndexInFieldsArray(row.id);

        const currentSubject = watch(`salary_additional_expenses.${index}.subject`);

        const isBank = row.type === 'banks';
        const dropdownOptions = isBank ? banks : (suppliersDropdownOptions as Supplier[]);
        const bankAccounts =
          dropdownOptions
            .find(option => option.id === currentSubject?.id)
            ?.bank_accounts.map(bankAcc => {
              return {id: bankAcc, title: bankAcc};
            }) ?? [];

        return (
          <Controller
            name={`salary_additional_expenses.${index}.bank_account`}
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={value}
                onChange={onChange}
                placeholder={'Odaberite račun subjekta'}
                options={bankAccounts}
                isRequired
                error={errors.salary_additional_expenses?.[index]?.bank_account?.message}
                isDisabled={salary?.registred}
              />
            )}
          />
        );
      },
    },
    {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
  ];
  const salariesAdditionalExpensesTableHeadsWithDebtor = [...salariesAdditionalExpensesTableHeads];
  salariesAdditionalExpensesTableHeadsWithDebtor.splice(1, 0, debtorTableHead);

  const renderInfoBox = (label: string, value: number, isCurrency = false) => {
    return (
      <InfoBox>
        <InfoBoxText variant="bodySmall" content={isCurrency ? formatCurrency(value, 'left') : value} />
        <InfoBoxText variant="bodySmall" content={label} />
      </InfoBox>
    );
  };

  const renderTitleDivider = (type: keyof typeof AdditionalSalaryExpenseType) => {
    return (
      <TitleDivider>
        <Title content={AdditionalSalaryExpenseType[type]} />
        {!salary?.registred && (
          <AddIcon onClick={() => appendNewRow(type)}>
            <PlusIcon width={'18px'} stroke={Theme?.palette?.primary500} />
          </AddIcon>
        )}
      </TitleDivider>
    );
  };

  return (
    <SalariesFormContainer>
      <>
        <Row>
          <Controller
            name="activity"
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={value}
                onChange={onChange}
                label="AKTIVNOST"
                placeholder={'Odaberite aktivnost'}
                // TODO activities not yet done, send 0 until it's fixed
                options={mockedActivitiesDropdownOption}
                error={errors.activity?.message}
                isDisabled={salary?.registred}
              />
            )}
          />
        </Row>
        <Row>
          <Controller
            name={'month'}
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={value}
                onChange={onChange}
                label="MJESEC:"
                placeholder={'Odaberite mjesec'}
                options={monthOptions}
                error={errors.month?.message}
                isDisabled={salary?.registred}
              />
            )}
          />
          <Controller
            name={'date_of_calculation'}
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Datepicker
                name={name}
                selected={value ? new Date(value) : ''}
                label="DATUM OBRAČUNA:"
                onChange={onChange}
                error={errors.date_of_calculation?.message}
                disabled={salary?.registred}
              />
            )}
          />
        </Row>
        <Row>
          <Input
            {...register('description')}
            label="OPIS:"
            textarea
            placeholder="Unesite opis"
            error={errors.description?.message}
            disabled={salary?.registred}
          />
        </Row>

        <InfoBoxWrapper>
          {renderInfoBox('BROJ ZAPOSLENIH', salary ? salary.number_of_employees : 0)}
          {renderInfoBox('UKUPNI NETO IZNOS', salary ? salary.net_price + salary.obligations_price : 0, true)}
          {renderInfoBox('UKUPNO OBUSTAVE', salary ? salary.obligations_price : 0, true)}
          {renderInfoBox('ZA ISPLATU BANKAMA', salary ? salary.net_price : 0, true)}
        </InfoBoxWrapper>
        <Row>
          <FileUploadStepTitle variant="bodyMedium" content="STEP 1: UVEZI REKAPITULACIJU MJESEČNE ZARADE" />
        </Row>
        <FileUploadWrapper>
          <FileUpload
            icon={<></>}
            variant="secondary"
            onUpload={handleImportSalaries}
            accept=".xlsx"
            note={
              <>
                <Typography variant="bodySmall" content="UVEZI REKAPITULACIJU MJESEČNE ZARADE" />
                <FileTypeWarning variant="bodySmall" content="Fajl mora biti u .xlsx formatu!" />
              </>
            }
            buttonText="UČITAJ FAJL"
            disabled={salary?.registred}
          />
          <FileUploadErrorsWrapper>
            {importSalariesErrors.map((error, index) => (
              <Typography key={index} variant="bodySmall" content={error} style={{color: Theme.palette?.error500}} />
            ))}
          </FileUploadErrorsWrapper>
        </FileUploadWrapper>
        <Row>
          <FileUploadStepTitle variant="bodyMedium" content="STEP 2: UVEZI REKAPITULACIJU OBUSTAVA ZARADA" />
        </Row>
        <FileUploadWrapper>
          <FileUpload
            icon={<></>}
            variant="secondary"
            onUpload={handleImportSuspensions}
            accept=".xlsx"
            note={
              <>
                <Typography variant="bodySmall" content="UVEZI REKAPITULACIJU OBUSTAVA ZARADA" />
                <FileTypeWarning variant="bodySmall" content="Fajl mora biti u .xlsx formatu!" />
              </>
            }
            buttonText="UČITAJ FAJL"
            disabled={salary?.registred}
          />
          <FileUploadErrorsWrapper>
            {importSuspensionsErrors.map((error, index) => (
              <Typography key={index} variant="bodySmall" content={error} style={{color: Theme.palette?.error500}} />
            ))}
          </FileUploadErrorsWrapper>
        </FileUploadWrapper>
        {renderTitleDivider('contributions')}
        <Table
          tableHeads={salariesAdditionalExpensesTableHeads}
          data={contributionsFields}
          tableActions={tableActions}
        />
        {errors?.salary_additional_expenses?.root?.message && (
          <Typography
            variant="bodySmall"
            content={errors.salary_additional_expenses.root.message}
            style={{color: Theme.palette?.error500, padding: 5}}
          />
        )}
        {renderTitleDivider('taxes')}
        <Table tableHeads={salariesAdditionalExpensesTableHeads} data={taxesFields} tableActions={tableActions} />
        {renderTitleDivider('subtaxes')}
        <Table tableHeads={salariesAdditionalExpensesTableHeads} data={subtaxesFields} tableActions={tableActions} />
        {renderTitleDivider('banks')}
        <Table tableHeads={salariesAdditionalExpensesTableHeads} data={banksFields} tableActions={tableActions} />
        {renderTitleDivider('suspensions')}
        <Table
          tableHeads={salariesAdditionalExpensesTableHeadsWithDebtor}
          data={suspensionsFields}
          tableActions={tableActions}
        />

        {salary?.account_amounts[0].account && salary?.account_amounts[0]?.amount && (
          <>
            <Table tableHeads={tableHeads} data={salary.account_amounts} />
          </>
        )}
        <Footer>
          <Button
            content="Odustani"
            variant="secondary"
            onClick={() => navigate('/finance/liabilities-receivables/liabilities/salaries')}
          />
          <Button content="Sačuvaj" variant="primary" onClick={handleSubmit(onSubmit)} disabled={salary?.registred} />
        </Footer>
      </>
    </SalariesFormContainer>
  );
};

export default SalaryForm;
