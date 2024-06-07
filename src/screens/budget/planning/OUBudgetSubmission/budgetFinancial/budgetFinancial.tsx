import {BudgetRequestItem} from '../../../../../types/graphQL/budgetRequestDetails.ts';
import {BorderBox, BorderBoxItem, TextAreaWrapper} from '../styles.ts';
import {Typography, Button, Input, Theme} from 'client-library';
import useAppContext from '../../../../../context/useAppContext.ts';
import {BudgetTableMethods, BudgetTableStep} from '../../../../../shared/budgetTable/types.ts';
import Footer from '../../../../../shared/footer.ts';
import useFinancialBudgetFill from '../../../../../services/graphQL/financialBudgetFill/useFinancialBudgetFill.ts';
import {flattenBudgetData} from '../../../../../shared/budgetTable/utils.ts';
import {useEffect, useRef, useState} from 'react';
import BudgetTableFinanceManager from '../../../../../shared/budgetTable/budgetTableFinanceManager.tsx';

const budgetFinancial = ({budgetRequestDetails}: {budgetRequestDetails?: BudgetRequestItem}) => {
  const {
    contextMain: {organization_unit},
    alert,
    navigation: {navigate},
  } = useAppContext();

  const year = budgetRequestDetails?.budget?.title ? parseInt(budgetRequestDetails.budget.title) : 0;

  const budgetTableCurrentRef = useRef<BudgetTableMethods>(null);
  const budgetTableDonationsRef = useRef<BudgetTableMethods>(null);

  const [comment, setComment] = useState('');
  const [currentBudgetSuccessfullySaved, setCurrentBudgetSuccessfullySaved] = useState(false);
  const [donationsBudgetSuccessfullySaved, setDonationsBudgetSuccessfullySaved] = useState(false);

  //TODO unify all statuses in one enum -
  //   {id: 3, title: "Na čekanju"}
  //   {id: 4, title: "Odobreno"}
  const editingDisabled = budgetRequestDetails?.status?.id === 3 || budgetRequestDetails?.status?.id === 4;

  useEffect(() => {
    if (!currentBudgetSuccessfullySaved || !donationsBudgetSuccessfullySaved) return;
    navigate(`/finance/budget/planning/${budgetRequestDetails?.budget.id}/summary`);
  }, [currentBudgetSuccessfullySaved, donationsBudgetSuccessfullySaved]);

  useEffect(() => {
    if (!budgetRequestDetails) return;

    setComment(budgetRequestDetails?.financial.current_budget_comment ?? '');
  }, [budgetRequestDetails]);

  const {financialBudgetFill, loading} = useFinancialBudgetFill();

  const handleSubmitFinancial = () => {
    const currentData = flattenBudgetData(budgetTableCurrentRef.current?.getInternalState());
    const donationData = flattenBudgetData(budgetTableDonationsRef.current?.getInternalState());

    financialBudgetFill(
      {data: currentData, request_id: budgetRequestDetails?.financial.current_request_id ?? 0, comment},
      () => {
        setCurrentBudgetSuccessfullySaved(true);
        alert.success('Uspješno sačuvan tekući budžet.');
      },
      () => {
        alert.error('Došlo je do greške prilikom čuvanja tekućeg budžeta.');
      },
    );
    financialBudgetFill(
      {data: donationData, request_id: budgetRequestDetails?.financial.donation_request_id ?? 0, comment},
      () => {
        setDonationsBudgetSuccessfullySaved(true);
        alert.success('Uspješno sačuvan budžet donacija.');
      },
      () => {
        alert.error('Došlo je do greške prilikom čuvanja budžeta donacija.');
      },
    );
  };

  // TODO check if needed
  // const handleReset = () => {
  //   budgetTableCurrentRef.current?.resetForm();
  //   budgetTableDonationsRef.current?.resetForm();
  // };

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
          <Typography
            content={'Razlog odbijanja:'}
            variant={'bodySmall'}
            style={{fontWeight: 600, marginRight: 10, color: Theme?.palette?.error500}}
          />
          <Typography
            content={budgetRequestDetails?.financial?.current_budget_comment ?? ''}
            variant={'bodySmall'}
            style={{color: Theme?.palette?.error500}}
          />
        </BorderBoxItem>
      </BorderBox>
      <Typography content={'Tekući:'} variant={'bodyMedium'} style={{fontWeight: 600, marginRight: 10}} />
      <BudgetTableFinanceManager
        step={BudgetTableStep.BUDGET_FINANCIAL}
        organizationUnitId={organization_unit.id}
        year={year}
        countsProps={budgetRequestDetails?.financial.current_accounts}
        ref={budgetTableCurrentRef}
        isTableDisabled={editingDisabled}
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
        ref={budgetTableDonationsRef}
        isTableDisabled={editingDisabled}
      />
      <TextAreaWrapper>
        <Input
          onChange={e => {
            setComment(e.target.value);
          }}
          value={comment}
          label={'Komentar:'}
          textarea
          placeholder={'Dodaj komentar'}
          disabled={editingDisabled}
        />
      </TextAreaWrapper>

      <Footer>
        {/*<Button content="Nazad" variant="secondary" onClick={handleReset} />*/}
        <Button
          content="Sačuvaj"
          variant="secondary"
          onClick={handleSubmitFinancial}
          disabled={editingDisabled}
          loader={loading}
        />
      </Footer>
    </>
  );
};

export default budgetFinancial;
