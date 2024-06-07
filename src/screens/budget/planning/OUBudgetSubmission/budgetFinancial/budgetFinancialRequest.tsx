import {BudgetRequestItem} from '../../../../../types/graphQL/budgetRequestDetails.ts';
import {BorderBox, BorderBoxItem} from '../styles.ts';
import {Typography} from 'client-library';
import useAppContext from '../../../../../context/useAppContext.ts';
import {BudgetTableStep} from '../../../../../shared/budgetTable/types.ts';
import BudgetTableFinanceManager from '../../../../../shared/budgetTable/budgetTableFinanceManager.tsx';

const budgetFinancialRequest = ({budgetRequestDetails}: {budgetRequestDetails?: BudgetRequestItem}) => {
  const {
    contextMain: {organization_unit},
  } = useAppContext();

  const year = budgetRequestDetails?.budget?.title ? parseInt(budgetRequestDetails.budget.title) : 0;

  return (
    <>
      <BorderBox>
        <BorderBoxItem>
          <Typography content={'Naziv predlagača: '} variant={'bodySmall'} style={{fontWeight: 600, marginRight: 10}} />
          <Typography content={'Sekretarijat Sudskog savjeta'} variant={'bodySmall'} />
        </BorderBoxItem>
        <BorderBoxItem>
          <Typography content={'Limit: :'} variant={'bodySmall'} style={{fontWeight: 600, marginRight: 10}} />
          <Typography content={budgetRequestDetails?.limit ?? ''} variant={'bodySmall'} />
        </BorderBoxItem>
        <BorderBoxItem>
          <Typography content={'Komentar OJ:'} variant={'bodySmall'} style={{fontWeight: 600, marginRight: 10}} />
          <Typography content={budgetRequestDetails?.financial?.current_budget_comment ?? ''} variant={'bodySmall'} />
        </BorderBoxItem>
      </BorderBox>
      <Typography content={'Tekući:'} variant={'bodyMedium'} style={{fontWeight: 600, marginRight: 10}} />
      <BudgetTableFinanceManager
        step={BudgetTableStep.BUDGET_FINANCIAL}
        organizationUnitId={organization_unit.id}
        year={year}
        countsProps={budgetRequestDetails?.financial.current_accounts}
        isTableDisabled={true}
      />
      <Typography
        content={'Donacije:'}
        variant={'bodyMedium'}
        style={{fontWeight: 600, marginRight: 10, marginTop: 24}}
      />

      <BudgetTableFinanceManager
        step={BudgetTableStep.BUDGET_FINANCIAL}
        organizationUnitId={organization_unit.id}
        year={year}
        countsProps={budgetRequestDetails?.financial.donation_accounts}
        isTableDisabled={true}
      />
    </>
  );
};

export default budgetFinancialRequest;
