import {Divider} from '@oykos-development/devkit-react-ts-styled-components';
import {EditIcon, Table, Theme, TrashIcon, Typography} from 'client-library';
import {useState} from 'react';
import WillDispatchModal from '../../../../components/willDipatchModal/willDispatchModal.tsx';
import WillForm from '../../../../components/willForm/willForm.tsx';
import useAppContext from '../../../../context/useAppContext.ts';
import useDeleteWillDispatch from '../../../../services/graphQL/wills/useDeleteWillDispatch.ts';
import useGetWills from '../../../../services/graphQL/wills/useGetWills.ts';
import {ConfirmationModal} from '../../../../shared/confirmationModal/confirmationModal.tsx';
import {MainTitle} from '../../../../shared/pageElements.ts';
import PlusButton from '../../../../shared/plusButton.tsx';
import ScreenWrapper from '../../../../shared/screenWrapper/screenWrapper.tsx';
import SectionBox from '../../../../shared/sectionBox.ts';
import {TableTitle} from '../../../../shared/tableTitle.tsx';
import {WillDispatch} from '../../../../types/graphQL/wills.ts';
import {PlusButtonWrapper} from '../../styles.ts';
import {willDispatchTableHeads} from './constants.tsx';
import {checkActionRoutePermissions} from '../../../../services/checkRoutePermissions.ts';

const WillDetails = () => {
  const [dispatchModal, setDispatchModal] = useState(false);
  const [deleteDispatchId, setDeleteDispatchId] = useState<number | null>(null);
  const [dispatchEditData, setDispatchEditData] = useState<WillDispatch | null>(null);

  const {
    navigation: {
      location: {pathname},
    },
    contextMain: {
      organization_unit: {id: organization_unit_id, permissions},
    },
    alert,
  } = useAppContext();
  const deletePermittedRoutes = checkActionRoutePermissions(permissions, 'delete');
  const deletePermission = deletePermittedRoutes.includes('/finance/deposit/fixed/financial');
  const updatePermittedRoutes = checkActionRoutePermissions(permissions, 'update');
  const updatePermission = updatePermittedRoutes.includes('/finance/deposit/fixed/financial');

  const id = pathname.split('/').pop();

  const {
    data: currentWill,
    refetch,
    loading,
  } = useGetWills({
    id: id ? parseInt(id) : null,
    organization_unit_id,
  });

  const {deleteWillDispatch} = useDeleteWillDispatch();

  const handleDeleteDispatch = async () => {
    if (!deleteDispatchId) return;

    await deleteWillDispatch(
      deleteDispatchId,
      () => {
        refetch();
        alert.success('Uspješno obrisan povrat testamenta.');
      },
      () => alert.error('Greška. Brisanje povrata nije uspjelo.'),
    );

    setDeleteDispatchId(null);
  };

  const disabled = !updatePermission || currentWill[0]?.status === 'Zakljucen';

  return (
    <ScreenWrapper showBreadcrumbs={true}>
      <SectionBox>
        <MainTitle content={`STALNI FINANSKIJSKI DEPOZIT - ${currentWill[0]?.case_number_si}`} />
        <Divider color={Theme?.palette?.gray200} height="1px" style={{marginBottom: 20}} />
        <WillForm data={currentWill[0]} />
      </SectionBox>

      <SectionBox>
        <TableTitle>
          <Typography variant="bodyLarge" content="Kretanje testamenta" style={{fontWeight: 'bold'}} />
          <PlusButtonWrapper>
            <PlusButton onClick={() => setDispatchModal(true)} disabled={disabled} />
          </PlusButtonWrapper>
        </TableTitle>
        <Table
          tableHeads={willDispatchTableHeads}
          data={currentWill[0]?.dispatches || []}
          isLoading={loading}
          tableActions={
            disabled
              ? undefined
              : [
                  {
                    name: 'edit',
                    onClick: row => {
                      setDispatchEditData(row);
                      setDispatchModal(true);
                    },
                    icon: <EditIcon stroke={Theme?.palette?.gray800} />,
                    shouldRender: () => updatePermission,
                  },
                  {
                    name: 'delete',
                    onClick: row => setDeleteDispatchId(row.id),
                    icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
                    shouldRender: () => deletePermission,
                  },
                ]
          }
          style={{marginBottom: 22}}
        />
        {dispatchModal && (
          <WillDispatchModal
            data={dispatchEditData}
            open={true}
            onClose={() => setDispatchModal(false)}
            refetch={refetch}
            willStatus={currentWill[0]?.status}
          />
        )}
        {deleteDispatchId && (
          <ConfirmationModal
            open={true}
            onClose={() => setDeleteDispatchId(null)}
            onConfirm={handleDeleteDispatch}
            subTitle="Da li ste sigurni da želite da izbrišete ovaj povrat testamenta?"
          />
        )}
      </SectionBox>
    </ScreenWrapper>
  );
};

export default WillDetails;
