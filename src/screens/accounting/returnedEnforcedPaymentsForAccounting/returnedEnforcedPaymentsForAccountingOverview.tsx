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
import {AccountingPaymentOrdersModal} from '../../../components/accountingPaymentOrdersModal/accountingPaymentOrdersModal.tsx';

const ReturnedEnforcedPaymentsForAccountingOverview = () => {
  const {
    contextMain,
    alert,
    reportService: {generatePdf},
  } = useAppContext();
  const [showDeleteModalAccountingId, setShowDeleteModalAccountingId] = useState<number | undefined>(undefined);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [dataForModal, setDataForModal] = useState();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 500);

  const {data, total, fetch} = useAccountingEntryOverview(
    contextMain?.organization_unit?.id,
    'return_enforced_payment',
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
      selectedData && generatePdf('ACCOUNTING', selectedData);
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

  const handleShowModal = (row?: any) => {
    setShowModal(prev => !prev);
    setDataForModal(row);
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
        onRowClick={row => handleShowModal(row)}
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
            onClick: row => onDelete(row),
            icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
            shouldRender: row => row?.items[0]?.id === data[0].items[0]?.id,
          },
        ]}
      />

      <ConfirmationModal
        open={!!showDeleteModalAccountingId}
        subTitle="Ovaj nalog će biti trajno izbrisan iz sistema."
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

      <AccountingPaymentOrdersModal open={showModal} onClose={handleShowModal} data={dataForModal} />
    </>
  );
};

export default ReturnedEnforcedPaymentsForAccountingOverview;
