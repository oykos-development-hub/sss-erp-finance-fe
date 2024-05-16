import {BudgetRequestItem} from '../../../../../types/graphQL/budgetRequestDetails.ts';
import {BorderBox} from '../styles.ts';
import {Typography, Button} from 'client-library';
import useAppContext from '../../../../../context/useAppContext.ts';
import BudgetTable from '../../../../../shared/budgetTable/budgetTable.tsx';
import {BudgetTableStep} from '../../../../../shared/budgetTable/types.ts';
import Footer from '../../../../../shared/footer.ts';

const budgetFinancial = ({budgetRequestDetails}: {budgetRequestDetails?: BudgetRequestItem}) => {
  const {
    contextMain: {organization_unit},
  } = useAppContext();

  const year = budgetRequestDetails?.budget?.title ? parseInt(budgetRequestDetails.budget.title) : 0;

  return (
    <>
      <BorderBox>
        <>
          <Typography content={'Naziv predlagača:'} variant={'bodySmall'} style={{fontWeight: 600, marginRight: 10}} />
          <Typography content={organization_unit?.title ?? ''} variant={'bodySmall'} />
        </>
      </BorderBox>
      <Typography content={'Tekući:'} variant={'bodyMedium'} style={{fontWeight: 600, marginRight: 10}} />
      <BudgetTable
        step={BudgetTableStep.BUDGET_FINANCIAL}
        organizationUnitId={organization_unit.id}
        year={year}
        countsProps={budgetRequestDetails?.financial.current_accounts}
      />
      <Typography
        content={'Donacije:'}
        variant={'bodyMedium'}
        style={{fontWeight: 600, marginRight: 10, marginTop: 24}}
      />

      <BudgetTable
        step={BudgetTableStep.BUDGET_FINANCIAL}
        organizationUnitId={organization_unit.id}
        year={year}
        countsProps={budgetRequestDetails?.financial.donation_accounts}
      />
      <Footer>
        <Button content="Nazad" variant="secondary" onClick={() => console.log('Nazad')} />
        <Button content="Sačuvaj" variant="secondary" onClick={() => console.log('Sačuvaj')} />
      </Footer>
    </>
  );
};

export default budgetFinancial;
