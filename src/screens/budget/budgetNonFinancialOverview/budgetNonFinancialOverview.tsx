import {NonFinanceAccordion} from '../../../components/nonFinanceAccordion/nonFinanceAccordion.tsx';
import {ButtonsContainer, StatusUpdateContainer, StyledDropdown} from './styles.ts';
import {budgetStatusModal} from '../../../components/budgetList/constants.tsx';
import {Button, Input} from 'client-library';
import {Controller, useForm} from 'react-hook-form';

const initialValues = {
  status: null,
  comment: '',
};

const onSubmit = (data: any) => {
  // TODO add sumbit api call
  console.log(data);
};
const BudgetNonFinancialOverview = () => {
  const {control, register, handleSubmit} = useForm({defaultValues: initialValues});
  return (
    <div>
      <NonFinanceAccordion programNo={1} key={`acc-${1}`} isPreview />
      <StatusUpdateContainer>
        {/*TODO check if options should be budgetStatusModal or something else*/}
        <Controller
          name="status"
          control={control}
          render={({field: {name, value, onChange}}) => (
            <StyledDropdown value={value} name={name} options={budgetStatusModal} onChange={onChange} />
          )}
        />
        <Input {...register('comment')} textarea placeholder={'Dodaj komentar'} />
      </StatusUpdateContainer>
      <ButtonsContainer>
        <Button content="Nazad" variant="secondary" />
        <Button content="Izmijeni status" variant="primary" type={'submit'} onClick={handleSubmit(onSubmit)} />
      </ButtonsContainer>
    </div>
  );
};

export default BudgetNonFinancialOverview;
