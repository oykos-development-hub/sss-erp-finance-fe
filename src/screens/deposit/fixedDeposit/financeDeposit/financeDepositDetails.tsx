import {Divider} from '@oykos-development/devkit-react-ts-styled-components';
import {EditIcon, Table, Theme, TrashIcon, Typography} from 'client-library';
import {useState} from 'react';
import DepositConfiscationModal from '../../../../components/depositConfiscationModal/depositConfiscationModal.tsx';
import DepositDispatchModal from '../../../../components/depositDispatchModal/depositDispatchModal.tsx';
import FixedDepositForm from '../../../../components/financeDepositForm.tsx/financialDepositForm.tsx';
import useAppContext from '../../../../context/useAppContext.ts';
import useDeleteDepositDispatch from '../../../../services/graphQL/fixedDeposits/useDeleteDepositDispatch.ts';
import useDeleteFixedDepositItem from '../../../../services/graphQL/fixedDeposits/useDeleteFixedDepositItem.ts';
import useGetFixedDeposits from '../../../../services/graphQL/fixedDeposits/useGetFixedDeposits.ts';
import {ConfirmationModal} from '../../../../shared/confirmationModal/confirmationModal.tsx';
import PlusButton from '../../../../shared/plusButton.tsx';
import ScreenWrapper from '../../../../shared/screenWrapper/screenWrapper.tsx';
import {TableTitle} from '../../../../shared/tableTitle.tsx';
import {DepositConfiscation, DepositDispatch} from '../../../../types/graphQL/fixedDeposits.ts';
import {fixedDepositDispatchTableHeads, fixedFinancialDepositItemTableHeads} from './constants.tsx';
import {MainTitle, PlusButtonWrapper, SectionBox} from './styles.tsx';

const FinanceDepositDetails = () => {
  const [confiscationModal, setConfiscationModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [itemEditData, setItemEditData] = useState<DepositConfiscation | null>(null);

  const [dispatchModal, setDispatchModal] = useState(false);
  const [deleteDispatchId, setDeleteDispatchId] = useState<number | null>(null);
  const [dispatchEditData, setDispatchEditData] = useState<DepositDispatch | null>(null);

  const {
    navigation: {
      location: {pathname},
    },
    contextMain: {organization_unit_id},
    alert,
  } = useAppContext();

  const id = pathname.split('/').pop();

  const {
    data: currentDeposit,
    refetch,
    loading,
  } = useGetFixedDeposits({
    id: id ? parseInt(id) : null,
    organization_unit_id,
    type: 'financial',
  });

  const {deleteFixedDepositItem} = useDeleteFixedDepositItem();
  const {deleteDepositDispatch} = useDeleteDepositDispatch();

  const handleDeleteItem = async () => {
    if (!deleteItemId) return;

    await deleteFixedDepositItem(
      deleteItemId,
      () => {
        refetch();
        alert.success('Uspješno obrisan depozit.');
      },
      () => alert.error('Greška. Brisanje depozita nije uspjelo.'),
    );

    setDeleteItemId(null);
  };

  const handleDeleteDispatch = async () => {
    if (!deleteDispatchId) return;

    await deleteDepositDispatch(
      deleteDispatchId,
      () => {
        refetch();
        alert.success('Uspješno obrisan povrat.');
      },
      () => alert.error('Greška. Brisanje povrata nije uspjelo.'),
    );

    setDeleteDispatchId(null);
  };

  const disabled = currentDeposit?.items[0]?.status === 'Zakljucen';

  return (
    <ScreenWrapper showBreadcrumbs={true}>
      <SectionBox>
        <MainTitle content={`STALNI FINANSKIJSKI DEPOZIT - ${currentDeposit?.items[0]?.case_number}`} />
        <Divider color={Theme?.palette?.gray200} height="1px" style={{marginBottom: 20}} />
        <FixedDepositForm data={currentDeposit?.items[0]} />
      </SectionBox>

      <SectionBox>
        {/* FIRST TABLE - CONFISCATIONS */}
        <TableTitle>
          <Typography variant="bodyLarge" content="Dodavanje depozita" style={{fontWeight: 'bold'}} />
          <PlusButtonWrapper>
            <PlusButton onClick={() => setConfiscationModal(true)} disabled={disabled} />
          </PlusButtonWrapper>
        </TableTitle>
        <Table
          tableHeads={fixedFinancialDepositItemTableHeads}
          data={currentDeposit?.items[0]?.items || []}
          isLoading={loading}
          tableActions={
            disabled
              ? undefined
              : [
                  {
                    name: 'edit',
                    onClick: row => {
                      setItemEditData(row);
                      setConfiscationModal(true);
                    },
                    icon: <EditIcon stroke={Theme?.palette?.gray800} />,
                  },
                  {
                    name: 'delete',
                    onClick: row => setDeleteItemId(row.id),
                    icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
                  },
                ]
          }
          style={{marginBottom: 22}}
        />
        {confiscationModal && (
          <DepositConfiscationModal
            data={itemEditData}
            open={confiscationModal}
            onClose={() => setConfiscationModal(false)}
            refetch={refetch}
          />
        )}
        {deleteItemId && (
          <ConfirmationModal
            open={true}
            onClose={() => setDeleteItemId(null)}
            onConfirm={handleDeleteItem}
            subTitle="Da li ste sigurni da želite da izbrišete ovaj depozit?"
          />
        )}
      </SectionBox>

      <SectionBox>
        {/* SECOND TABLE - RETURNS (DISPATCHES IN BACKEND) */}
        <TableTitle>
          <Typography variant="bodyLarge" content="Vraćanje depozita" style={{fontWeight: 'bold'}} />
          <PlusButtonWrapper>
            <PlusButton onClick={() => setDispatchModal(true)} disabled={disabled} />
          </PlusButtonWrapper>
        </TableTitle>
        <Table
          tableHeads={fixedDepositDispatchTableHeads}
          data={currentDeposit?.items[0]?.dispatches || []}
          isLoading={loading}
          tableActions={
            disabled
              ? undefined
              : [
                  {
                    name: 'edit',
                    onClick: row => {
                      setDispatchEditData(row);
                      setConfiscationModal(true);
                    },
                    icon: <EditIcon stroke={Theme?.palette?.gray800} />,
                  },
                  {
                    name: 'delete',
                    onClick: row => setDeleteItemId(row.id),
                    icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
                  },
                ]
          }
          style={{marginBottom: 22}}
        />
        {dispatchModal && (
          <DepositDispatchModal
            data={dispatchEditData}
            open={true}
            onClose={() => setDispatchModal(false)}
            refetch={refetch}
          />
        )}
        {deleteDispatchId && (
          <ConfirmationModal
            open={true}
            onClose={() => setDeleteDispatchId(null)}
            onConfirm={handleDeleteDispatch}
            subTitle="Da li ste sigurni da želite da izbrišete ovaj povrat?"
          />
        )}
      </SectionBox>
    </ScreenWrapper>
  );
};

export default FinanceDepositDetails;
