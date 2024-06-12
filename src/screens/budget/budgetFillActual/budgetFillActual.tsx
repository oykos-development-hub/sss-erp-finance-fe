import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper.tsx';
import BudgetTableFinanceManager from '../../../shared/budgetTable/budgetTableFinanceManager.tsx';
import {BudgetTableMethods, BudgetTableStep} from '../../../shared/budgetTable/types.ts';
import {Typography, Button} from 'client-library';
import {useMemo, useRef, useState} from 'react';
import useGetBudgetRequestDetails from '../../../services/graphQL/budgetRequestDetails/useGetBudgetRequestDetails.ts';
import useAppContext from '../../../context/useAppContext.ts';
import Footer from '../../../shared/footer.ts';
import {flattenActualBudgetData} from '../../../shared/budgetTable/utils.ts';
import useFinancialBudgetActualFill from '../../../services/graphQL/financialBudgetActualFill/useFinancialBudgetActualFIll.ts';
import {ConfirmationModal} from '../../../shared/confirmationModal/confirmationModal.tsx';

const BudgetFillActual = () => {
  const {
    navigation: {
      navigate,
      location: {pathname},
    },
    alert,
    breadcrumbs,
  } = useAppContext();

  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const toggleModal = () => setConfirmationModalOpen(!confirmationModalOpen);

  const ids = useMemo(() => {
    const path = pathname.split('/');
    return {budgetId: parseInt(path[path.length - 4]), organizationUnitId: parseInt(path[path.length - 2])};
  }, [pathname]);

  const {budgetRequestDetails} = useGetBudgetRequestDetails(ids);
  const {financialBudgetActualFill} = useFinancialBudgetActualFill();

  const year = budgetRequestDetails?.budget?.title ? parseInt(budgetRequestDetails.budget.title) : 0;
  const budgetTableActualRef = useRef<BudgetTableMethods>(null);

  const handleSubmitActualBudget = () => {
    const data = flattenActualBudgetData(budgetTableActualRef.current?.getInternalState());
    const redirectPath = pathname.split('/').slice(0, -2).join('/');
    financialBudgetActualFill(
      {data, request_id: budgetRequestDetails?.financial.current_request_id ?? 0},
      () => {
        navigate(redirectPath);
        breadcrumbs.remove();
        alert.success('Uspješno sačuvan tekući budžet.');
      },
      () => {
        alert.error('Došlo je do greške prilikom čuvanja tekućeg budžeta.');
      },
    );
    toggleModal();
  };

  return (
    <ScreenWrapper>
      <Typography
        content={'Tekući:'}
        variant={'bodyMedium'}
        style={{fontWeight: 600, marginRight: 10, marginTop: 24}}
      />
      <BudgetTableFinanceManager
        step={BudgetTableStep.BUDGETING_ACTUAL}
        organizationUnitId={ids.organizationUnitId}
        year={year}
        ref={budgetTableActualRef}
        countsProps={budgetRequestDetails?.financial.current_accounts}
      />
      <Footer>
        <Button content="Sačuvaj" variant="secondary" onClick={toggleModal} />
      </Footer>
      <ConfirmationModal
        open={confirmationModalOpen}
        onClose={toggleModal}
        onConfirm={handleSubmitActualBudget}
        customContent={
          <>
            <Typography
              content="Da li ste sigurni da želite sačuvati tekući budžet?"
              variant="bodyMedium"
              style={{fontWeight: 600, textAlign: 'center'}}
            />
            <Typography
              content={'Naknadne izmjene neće biti moguće.'}
              variant="bodySmall"
              style={{textAlign: 'center'}}
            />
          </>
        }
      />
    </ScreenWrapper>
  );
};

export default BudgetFillActual;
