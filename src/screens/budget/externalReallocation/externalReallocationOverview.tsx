import {Button, Divider, Dropdown, Table, TableHead, Pagination, Typography, TrashIcon, Theme} from 'client-library';
import {useEffect, useState} from 'react';
import {ExternalReallocationModal} from '../../../components/externalReallocationModal/externalReallocationModal';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper';
import {ButtonWrapper, DropdownWrapper, HeaderWrapper, MainTitle, SectionBox, Wrapper} from './styles';
import {defaultDropdownOption} from '../../finesAndTaxes/fines/constants.tsx';
import {DropdownData} from '../../../types/dropdownData.ts';
import {PAGE_SIZE, ReallocationStatusEnum} from '../../../constants.ts';
import useGetExternalReallocations from '../../../services/graphQL/externalReallocations/useGetExternalReallocations.ts';
import {parseDate} from '../../../utils/dateUtils.ts';
import {useCreateBudgetYearFilter} from '../../../utils/useCreateBudgetYearFilter.ts';
import usePrependedDropdownOptions from '../../../utils/usePrependedDropdownOptions.ts';
import useDeleteExternalReallocations from '../../../services/graphQL/externalReallocations/useDeleteExternalReallocations.ts';
import useAppContext from '../../../context/useAppContext.ts';
import {ConfirmationModal} from '../../../shared/confirmationModal/confirmationModal.tsx';
import {ReallocationItem} from '../../../types/graphQL/externalReallocations.ts';
import {ModalControlButtons} from '../../../shared/confirmationModal/styles.ts';
import useRejectOUExternalReallocations from '../../../services/graphQL/externalReallocations/useRejectOUExternalReallocations.ts';

const tableHeads: TableHead[] = [
  {
    title: 'ID',
    accessor: 'id',
    type: 'text',
  },
  {
    title: 'Datum zahtjeva',
    accessor: 'date_of_request',
    type: 'custom',
    renderContents: (date: string) => <Typography content={parseDate(date)} variant="bodySmall" />,
  },
  {
    title: 'Podnosilac zahtjeva',
    accessor: 'requested_by',
    type: 'custom',
    renderContents: (value: DropdownData<number>) => <Typography variant="bodyMedium" content={value.title} />,
  },
  {
    title: 'Izvor',
    accessor: 'source_organization_unit',
    type: 'custom',
    renderContents: (value: DropdownData<number>) => <Typography variant="bodyMedium" content={value.title} />,
  },
  {
    title: 'Primalac',
    accessor: 'destination_organization_unit',
    type: 'custom',
    renderContents: (value: DropdownData<number>) => <Typography variant="bodyMedium" content={value.title} />,
  },
  {
    title: 'Status',
    accessor: 'status',
    type: 'text',
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

const initialValues = {
  budget_id: undefined,
  status: undefined,
};

const ExternalReallocationOverview = () => {
  const {
    alert,
    contextMain: {
      organization_unit: {id: organization_unit_id},
    },
    navigation: {navigate},
  } = useAppContext();

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(initialValues);
  const [isModalOpen, setIsModalOpen] = useState<number | undefined>(undefined);
  const toggleModal = (id?: number) => {
    setIsModalOpen(id ?? undefined);
  };
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<number>(0);
  const toggleDeleteModal = (id?: number) => setIsDeleteModalOpen(id ? id : 0);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState<ReallocationItem | undefined>(undefined);
  const toggleRequestModal = (reallocation?: ReallocationItem) =>
    setIsRequestModalOpen(reallocation ? reallocation : undefined);
  const [rejectModal, setRejectModal] = useState<number>(0);
  const toggleRejectModal = (id?: number) => setRejectModal(id ? id : 0);

  const {externalReallocations, total, refetch} = useGetExternalReallocations({
    page: page,
    organization_unit_id: organization_unit_id,
    ...filters,
  });
  const {deleteExternalReallocations} = useDeleteExternalReallocations();
  const {rejectOUExternalReallocations} = useRejectOUExternalReallocations();

  const yearOptions = useCreateBudgetYearFilter();
  const statusOptions: DropdownData<string>[] = [];

  const activeReallocation = externalReallocations.find(reallocation => reallocation.id === isModalOpen);

  const onFilterChange = (value: any, name: string) => {
    setFilters({...filters, [name]: value?.id});
  };

  const onPageChange = (page: number) => {
    setPage(page + 1);
  };

  useEffect(() => {
    if (page === 1) return;
    setPage(1);
  }, [filters]);

  const onDelete = (id: number) => {
    deleteExternalReallocations(
      id,
      () => {
        alert.success('Brisanje eksternog preusmjerenja sredstava uspješno.');
        refetch();
        toggleDeleteModal();
      },
      () => {
        alert.error('Došlo je do greške prilikom brisanja eksternog preusmjerenja sredstava!');
      },
    );
    toggleModal();
  };

  const handleReject = () => {
    if (!rejectModal) return;

    rejectOUExternalReallocations(
      rejectModal,
      () => {
        refetch();
        toggleRejectModal(0);
        alert.success('Zahtjev uspješno odbijen.');
      },
      () => {
        alert.error('Došlo je do greške prilikom odbijanja zahtjeva!');
      },
    );
  };

  return (
    <ScreenWrapper>
      <SectionBox>
        <MainTitle variant="bodyMedium" content="EKSTERNO PREUSMJERENJE" />
        <Divider color="#615959" height="1px" />
        <Wrapper>
          <HeaderWrapper>
            <DropdownWrapper>
              <Dropdown
                name={'budget_id'}
                value={
                  filters.budget_id ? yearOptions.find(year => year.id === filters.budget_id) : defaultDropdownOption
                }
                onChange={onFilterChange}
                options={usePrependedDropdownOptions(yearOptions)}
                label="GODINA:"
              />
            </DropdownWrapper>
            <DropdownWrapper>
              <Dropdown
                name={'status'}
                value={
                  filters.status ? statusOptions.find(status => status.id === filters.status) : defaultDropdownOption
                }
                onChange={onFilterChange}
                options={statusOptions}
                label="STATUS:"
              />
            </DropdownWrapper>
          </HeaderWrapper>
          <ButtonWrapper>
            <Button
              content="Kreiraj eksterno preusmjerenje"
              style={{width: '200px'}}
              variant="secondary"
              onClick={() => toggleModal(0)}
            />
          </ButtonWrapper>
        </Wrapper>
        <Table
          data={externalReallocations}
          tableHeads={tableHeads}
          onRowClick={(row: ReallocationItem) =>
            row?.source_organization_unit?.id === organization_unit_id ? toggleModal(row.id) : toggleRequestModal(row)
          }
          tableActions={[
            {
              name: 'Izbriši',
              onClick: row => toggleDeleteModal(row.id),
              icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
              shouldRender: row =>
                row?.status === ReallocationStatusEnum.created &&
                row?.source_organization_unit?.id === organization_unit_id,
            },
          ]}
        />
        <Pagination
          pageCount={total ? Math.ceil(total / PAGE_SIZE) : 1}
          onChange={onPageChange}
          variant="filled"
          itemsPerPage={PAGE_SIZE}
          pageRangeDisplayed={3}
          style={{marginTop: '20px'}}
        />

        <ExternalReallocationModal
          onClose={() => toggleModal()}
          open={isModalOpen !== undefined}
          activeReallocation={activeReallocation}
          refetch={refetch}
        />
        <ConfirmationModal
          open={!!isDeleteModalOpen}
          onClose={() => toggleDeleteModal()}
          onConfirm={() => onDelete(isDeleteModalOpen)}
          subTitle={'Ovo preusmjerenje sredstava će biti trajno izbrisano iz sistema.'}
        />
        <ConfirmationModal
          open={!!isRequestModalOpen}
          onClose={() => toggleRequestModal()}
          onConfirm={() => undefined}
          customContent={
            <>
              <Typography
                content={`Organizaciona jedinica ${isRequestModalOpen?.source_organization_unit?.title} je uputila zahtjev za eskterno preusmjerenje.`}
                variant="bodyMedium"
                style={{fontWeight: 600, textAlign: 'center'}}
              />
              <Typography
                content={'Da li želite pregledati zahtjev?.'}
                variant="bodySmall"
                style={{textAlign: 'center'}}
              />
            </>
          }
          customButtonsControls={
            <ModalControlButtons>
              <Button
                content={'Pregledaj'}
                onClick={() => navigate(`/finance/budget/current/external-reallocation/${isRequestModalOpen?.id}`)}
                variant="primary"
              />
              <Button
                content={'Odbij'}
                onClick={() => {
                  toggleRejectModal(isRequestModalOpen?.id ?? 0);
                  toggleRequestModal();
                }}
                variant="secondary"
              />
            </ModalControlButtons>
          }
        />
        <ConfirmationModal
          open={!!rejectModal}
          onClose={() => setRejectModal(0)}
          onConfirm={handleReject}
          customContent={
            <>
              <Typography
                content={'Da li ste sigurni da želite da odbijete zahtjev? '}
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
      </SectionBox>
    </ScreenWrapper>
  );
};

export default ExternalReallocationOverview;
