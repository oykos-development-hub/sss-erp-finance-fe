import {Button, Table, Typography} from 'client-library';
import useAppContext from '../../../../context/useAppContext';
import {FooterWrapper} from '../budgetList/styles';
import {budgetSummaryTableHeads} from './constants';
import {BudgetRequestItem} from '../../../../types/graphQL/budgetRequestDetails.ts';
import useSendBudgetOnReview from '../../../../services/graphQL/sendBudgetOnReview/useSendBudgetOnReview.ts';
import {ConfirmationModal} from '../../../../shared/confirmationModal/confirmationModal.tsx';
import {useState} from 'react';

const BudgetSummary = ({budgetRequestDetails}: {budgetRequestDetails?: BudgetRequestItem}) => {
  const {
    navigation: {
      navigate,
      location: {pathname},
      alert,
    },
    breadcrumbs,
  } = useAppContext();

  const [showModal, setShowModal] = useState<boolean>(false);
  const toggleModal = () => setShowModal(prevState => !prevState);

  const tableData = [
    {
      type: 'Finansijski',
      status: budgetRequestDetails?.financial.status,
      //   TODO change id
      id: 123,
    },
    {
      type: 'Nefinansijski',
      status: budgetRequestDetails?.non_financial.status,
      //   TODO change id
      id: 1234,
    },
  ];

  const path = pathname.split('/');
  const id = path[path.length - 2];

  // TODO confirm budget statuses on BE and add all to BudgetSubmissionStatusEnum
  // Status with id 2 is 'Popunjeno'
  const isButtonEnabled =
    budgetRequestDetails?.financial.status.id === 2 && budgetRequestDetails?.non_financial.status.id === 2;

  const handleRowClick = (rowType: string) => {
    if (rowType === 'Finansijski') {
      breadcrumbs.add({name: 'Finansijski', to: `/finance/budget/planning/${id}/financial`});
      navigate(`/finance/budget/planning/${id}/financial`);
    }
    if (rowType === 'Nefinansijski') {
      breadcrumbs.add({name: 'Nefinansijski', to: `/finance/budget/planning/${id}/non-financial`});
      navigate(`/finance/budget/planning/${id}/non-financial`);
    }
  };

  const {sendBudgetOnReview} = useSendBudgetOnReview();

  const handleSend = () => {
    if (!budgetRequestDetails) return;

    sendBudgetOnReview(
      budgetRequestDetails.request_id,
      () => {
        navigate('/finance/budget/planning');
        alert.success('Uspješno poslat budžet.');
      },
      () => {
        alert.error('Došlo je do greške prilikom slanja budžeta.');
      },
    );
    toggleModal();
  };

  return (
    <>
      <Table
        tableHeads={budgetSummaryTableHeads}
        data={tableData}
        style={{marginBottom: 22}}
        onRowClick={row => handleRowClick(row.type)}
      />
      <FooterWrapper>
        <Button
          content="Nazad"
          variant="secondary"
          onClick={() => {
            navigate('/finance/budget/planning');
            breadcrumbs.remove();
          }}
        />
        <Button content="Pošalji" variant="primary" disabled={!isButtonEnabled} onClick={toggleModal} />
      </FooterWrapper>
      <ConfirmationModal
        open={showModal}
        onClose={toggleModal}
        onConfirm={handleSend}
        customContent={
          <>
            <Typography
              content="Da li ste sigurni da želite poslati budžet?"
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
    </>
  );
};

export default BudgetSummary;
