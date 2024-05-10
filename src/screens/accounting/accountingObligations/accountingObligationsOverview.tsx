import {Pagination, PrinterIcon, SearchIcon, Table, Theme, TrashIcon} from 'client-library';
import {useEffect, useState} from 'react';
import {PAGE_SIZE} from '../../../constants.ts';
import useAppContext from '../../../context/useAppContext.ts';
import useAccountingEntryOverview from '../../../services/graphQL/accounting/useAccountingEntryOverview.ts';
import useDeleteAccountingEntry from '../../../services/graphQL/accounting/useDeleteAccountingEntry.ts';
import {ConfirmationModal} from '../../../shared/confirmationModal/confirmationModal.tsx';
import {AccountingOrderItem} from '../../../types/graphQL/accountingTypes.ts';
import {useDebounce} from '../../../utils/useDebounce.ts';
import {Filters} from '../../budget/planning/budgetList/styles.ts';
import {tableHeadsAccountingOverview} from '../constants.tsx';
import {FilterInput, Header} from '../styles.tsx';

const AccountingObligationsOverview = () => {
  const {
    contextMain,
    alert,
    reportService: {generatePdf},
  } = useAppContext();
  const [showDeleteModalAccountingId, setShowDeleteModalAccountingId] = useState<number | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 500);

  const {data, total, fetch} = useAccountingEntryOverview(
    contextMain?.organization_unit?.id,
    'obligations',
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

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const printAccount = (id: number) => {
    if (data.length) {
      const selectedData = data.find(item => id === item?.id);
      selectedData && generatePdf('ACCOUNTING', selectedData.items);
    }
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
  }, [debouncedSearch]);

  return (
    <>
      <Header>
        <Filters>
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
            name: 'Štampaj',
            onClick: row => {
              printAccount(row.id);
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

export default AccountingObligationsOverview;
