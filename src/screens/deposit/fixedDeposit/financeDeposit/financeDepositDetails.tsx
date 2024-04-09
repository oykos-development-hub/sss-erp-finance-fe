import {yupResolver} from '@hookform/resolvers/yup';
import {Button, FileUpload, Table, Typography} from 'client-library';
import {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import {requiredError} from '../../../../constants.ts';
import useAppContext from '../../../../context/useAppContext.ts';
import useGetCountOverview from '../../../../services/graphQL/counts/useGetCountOverview.ts';
import Footer from '../../../../shared/footer.ts';
import PlusButton from '../../../../shared/plusButton.tsx';
import {optionsNumberSchema} from '../../../../utils/formSchemas.ts';
import {newEntrytableHeads} from './constants.tsx';
import {CustomDatepicker, CustomDropdown, CustomInput, PlusButtonWrapper, Price, Row, SubTitle} from './styles.tsx';

const fixedDepositSchema = yup.object({
  case_number: yup.string().required(requiredError),
  subject: yup.string().required(requiredError),
  account_id: optionsNumberSchema,
  // date_of_recipiet: yup.date().required(requiredError).default(null),
  // date_of_case: yup.date().required(requiredError).default(null),
});

type FixedDepositForm = yup.InferType<typeof fixedDepositSchema>;

const FinanceDepositDetails = () => {
  const [uploadedFile, setUploadedFile] = useState<FileList>();
  const {
    navigation: {
      navigate,
      // location: {pathname},
    },
    // contextMain: {organization_unit_id},
  } = useAppContext();

  // const id = pathname.split('/').pop();

  const {
    register,
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FixedDepositForm>({
    resolver: yupResolver(fixedDepositSchema),
  });

  // const {data: currentDeposit} = useGetFixedDeposits({
  //   id: id ? parseInt(id) : null,
  //   organization_unit_id,
  //   type: 'financial',
  // });

  const {counts} = useGetCountOverview({});

  const handleUpload = (files: FileList) => {
    setUploadedFile(files);
  };
  console.log(errors);

  const onSubmit = (data: FixedDepositForm) => {
    console.log(data, 'asdasdasdasd');
  };

  // TO DO add logic when the backend is ready

  return (
    <>
      <Row>
        <CustomInput {...register('case_number')} label="BROJ PREDMETA:" error={errors.case_number?.message} />
        <CustomInput {...register('subject')} label="IME I PREZIME STRANKE:" error={errors.subject?.message} />
      </Row>
      <Row>
        {/* <Controller control={control} /> */}
        <CustomDatepicker options={[]} label="DATUM PREDMETA" onChange={() => console.log('changed')} />
      </Row>
      <Row>
        <Controller
          name="account_id"
          control={control}
          render={({field: {name, value, onChange}}) => (
            <CustomDropdown
              value={value}
              onChange={onChange}
              name={name}
              options={counts}
              label="KONTO"
              error={errors.account_id?.message}
            />
          )}
        />
        <CustomDatepicker options={[]} label="DATUM ZAKLJUČENJA" onChange={() => console.log('changed')} />
      </Row>
      <Row>
        <FileUpload
          icon={null}
          files={uploadedFile}
          variant="secondary"
          onUpload={handleUpload}
          note={<Typography variant="bodySmall" content="Dodaj fajl" />}
          buttonText="Učitaj"
        />
        {/* <FileList files={[currentDeposit.items[0]?.file && currentDeposit.items[0].file]} /> */}
      </Row>
      <Footer>
        <Button content="Odustani" variant="secondary" onClick={() => navigate('/finance/deposit/fixed/finance')} />
        <Button content="Sačuvaj" variant="primary" onClick={handleSubmit(onSubmit)} />
      </Footer>

      <PlusButtonWrapper>
        <PlusButton onClick={() => console.log('click')} />
      </PlusButtonWrapper>

      <Table tableHeads={newEntrytableHeads} data={[]} style={{marginBottom: 22}} />

      <Row>
        <SubTitle variant="bodySmall" content="SALDO/IZNOS:" />
        <Price variant="bodySmall" content="100,00 Є" />
      </Row>
    </>
  );
};

export default FinanceDepositDetails;
