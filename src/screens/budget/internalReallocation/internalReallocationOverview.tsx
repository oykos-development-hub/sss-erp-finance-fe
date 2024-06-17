import {Button, Divider, Dropdown, Table, TableHead, Pagination, TrashIcon, Theme} from 'client-library';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper';
import {getYearOptions} from '../../../utils/getYearOptions';
import {ButtonWrapper, DropdownWrapper, HeaderWrapper, MainTitle, SectionBox, Wrapper} from './styles';
import useAppContext from '../../../context/useAppContext';
import useInternalReallocationsOverview from '../../../services/graphQL/internalReallocations/useInternalReallocationsOverview.ts';
import {PAGE_SIZE} from '../../../constants.ts';
import {useEffect, useState} from 'react';
import {defaultDropdownOption} from '../../finesAndTaxes/fines/constants.tsx';
import {DropdownData} from '../../../types/dropdownData.ts';
import {Typography} from 'client-library';
import {parseDate} from '../../../utils/dateUtils.ts';
import useInternalReallocationsDelete from '../../../services/graphQL/internalReallocations/useInternalReallocationsDelete.ts';
import {ConfirmationModal} from '../../../shared/confirmationModal/confirmationModal.tsx';

const tableHeads: TableHead[] = [
  {
    title: 'ID',
    accessor: 'budget',
    type: 'custom',
    renderContents: (value: DropdownData<number>) => <Typography variant="bodyMedium" content={value.id} />,
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
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

const initialValues = {
  year: undefined,
};

const InternalReallocationOverview = () => {
  const {
    navigation: {navigate},
    alert,
  } = useAppContext();

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(initialValues);
  const [isModalOpen, setIsModalOpen] = useState<number>(0);
  const toggleModal = (id?: number) => setIsModalOpen(id ? id : 0);

  const {internalReallocationsOverview, total, refetch} = useInternalReallocationsOverview({
    page: page,
    ...filters,
  });
  const yearOptions = getYearOptions(10, true, 5);
  const {deleteInternalReallocations} = useInternalReallocationsDelete();

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
    deleteInternalReallocations(
      id,
      () => {
        alert.success('Brisanje preusmjerenja sredstava uspješno.');
        refetch();
      },
      () => {
        alert.error('Došlo je do greške prilikom brisanja preusmjerenja sredstava!');
      },
    );
    toggleModal();
  };

  return (
    <ScreenWrapper>
      <SectionBox>
        <MainTitle variant="bodyMedium" content="INTERNO PREUSMJERENJE" />
        <Divider color="#615959" height="1px" />
        <Wrapper>
          <HeaderWrapper>
            <DropdownWrapper>
              <Dropdown
                name={'year'}
                value={filters.year ? yearOptions.find(year => year.id === filters.year) : defaultDropdownOption}
                onChange={onFilterChange}
                options={yearOptions}
                label="GODINA:"
              />
            </DropdownWrapper>
          </HeaderWrapper>
          <ButtonWrapper>
            <Button
              content="Kreiraj interno preusmjerenje"
              style={{width: '200px'}}
              variant="secondary"
              onClick={() => navigate('/finance/budget/current/internal-reallocation/create')}
            />
          </ButtonWrapper>
        </Wrapper>
        <Table
          data={internalReallocationsOverview}
          tableHeads={tableHeads}
          onRowClick={row => navigate(`/finance/budget/current/internal-reallocation/${row?.id}`)}
          tableActions={[
            {
              name: 'Izbriši',
              onClick: row => toggleModal(row.id),
              icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
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
      </SectionBox>
      <ConfirmationModal
        open={!!isModalOpen}
        onClose={() => toggleModal()}
        onConfirm={() => onDelete(isModalOpen)}
        subTitle={'Ovo preusmjerenje sredstava će biti trajno izbrisano iz sistema.'}
      />
    </ScreenWrapper>
  );
};

export default InternalReallocationOverview;
