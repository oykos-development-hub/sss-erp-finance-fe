import {Pagination, PrinterIcon, SearchIcon, Table, Theme, TrashIcon} from 'client-library';
import {ChangeEvent, useEffect, useState} from 'react';
import {PAGE_SIZE} from '../../constants.ts';
import useAppContext from '../../context/useAppContext.ts';
import useAccountingEntryOverview from '../../services/graphQL/accounting/useAccountingEntryOverview.ts';
import useDeleteAccountingEntry from '../../services/graphQL/accounting/useDeleteAccountingEntry.ts';
import {ConfirmationModal} from '../../shared/confirmationModal/confirmationModal.tsx';
import {DropdownData} from '../../types/dropdownData.ts';
import {AccountingOrderItem} from '../../types/graphQL/accountingTypes.ts';
import {useDebounce} from '../../utils/useDebounce.ts';
import {FilterDropdown, Filters} from '../budget/planning/budgetList/styles.ts';
import {TypesForReceivables} from '../liabilitesAndReceivables/receivables/constants.tsx';
import {tableHeadsAccountingOverview} from './constants.tsx';
import {FilterInput, Header} from './styles.tsx';

export interface AccountingFilters {
  type?: DropdownData<string> | null;
  search?: string;
}

const initialAccountingFilterValues = {
  type: null,
  search: '',
};

const AccountingOverview = () => {
  const {contextMain, alert} = useAppContext();
  const [showDeleteModalAccountingId, setShowDeleteModalAccountingId] = useState<number | undefined>(undefined);
  const [filterValues, setFilterValues] = useState<AccountingFilters>(initialAccountingFilterValues);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 500);

  const {data, total, fetch} = useAccountingEntryOverview(
    contextMain?.organization_unit?.id,
    filterValues.type ? filterValues.type.id : null,
    debouncedSearch,
    page,
    PAGE_SIZE,
  );

  const {deleteAccountingEntry} = useDeleteAccountingEntry();

  const onPageChange = (page: number) => {
    setPage(page + 1);
  };

  const onDelete = (item: AccountingOrderItem) => {
    setShowDeleteModalAccountingId(item?.id);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModalAccountingId(undefined);
  };

  const onFilter = (value: DropdownData<string> | ChangeEvent<HTMLInputElement>, name: string) => {
    setFilterValues({...filterValues, [name]: value});
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleDelete = async () => {
    if (!showDeleteModalAccountingId) return;

    await deleteAccountingEntry(
      showDeleteModalAccountingId,
      () => {
        alert.success('Uspješno obrisano.');
        fetch();
      },
      () => {
        alert.error('Došlo je do greške prilikom brisanja.');
      },
    );
    setShowDeleteModalAccountingId(undefined);
  };

  useEffect(() => {
    if (page === 1) return;
    setPage(1);
  }, [debouncedSearch, filterValues]);

  return (
    <>
      <Header>
        <Filters>
          <FilterDropdown
            label="VRSTA OBAVEZE:"
            options={[{id: '', title: 'Sve'}, ...TypesForReceivables]}
            name="type"
            value={filterValues.type}
            onChange={value => onFilter(value as DropdownData<string>, 'type')}
          />
          <FilterInput
            name="search"
            label="PRETRAGA:"
            onChange={onSearch}
            value={search}
            rightContent={<SearchIcon style={{marginLeft: 10, marginRight: 10}} stroke={Theme.palette.gray500} />}
          />
        </Filters>
      </Header>
      <Table
        tableHeads={tableHeadsAccountingOverview}
        data={data}
        style={{marginBottom: 22}}
        tableActions={[
          {
            name: 'send',
            onClick: () => {
              console.log('budget sent');
            },
            icon: <PrinterIcon stroke={Theme?.palette?.gray800} />,
          },
          {
            name: 'Izbriši',
            onClick: onDelete,
            icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
          },
        ]}
      />

      <ConfirmationModal
        open={!!showDeleteModalAccountingId}
        subTitle="Ovaj račun će biti trajno izbrisan iz sistema."
        onClose={() => handleCloseDeleteModal()}
        onConfirm={() => handleDelete()}
      />

      <Pagination
        pageCount={total ? Math.ceil(total / PAGE_SIZE) : 1}
        onChange={onPageChange}
        variant="filled"
        itemsPerPage={PAGE_SIZE}
        pageRangeDisplayed={3}
        style={{marginTop: '20px'}}
      />
    </>
  );
};

export default AccountingOverview;
