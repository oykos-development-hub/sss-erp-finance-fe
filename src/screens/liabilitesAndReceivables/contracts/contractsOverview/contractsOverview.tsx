import {Dropdown, EditIconTwo, Input, Pagination, SearchIcon, Table, Theme, TrashIcon} from 'client-library';
import {ChangeEvent, useMemo, useState} from 'react';
import {PAGE_SIZE, StatusOptions} from '../../../../constants.ts';
import useAppContext from '../../../../context/useAppContext.ts';
import useDeleteInvoice from '../../../../services/graphQL/invoice/useDeleteInvoice.ts';
import useGetInvoice from '../../../../services/graphQL/invoice/useGetInvoice.ts';
import useGetSuppliers from '../../../../services/graphQL/suppliers/useGetSuppliers.ts';
import {ConfirmationModal} from '../../../../shared/confirmationModal/confirmationModal.tsx';
import {DropdownData} from '../../../../types/dropdownData.ts';
import {ContractItem, InvoiceItem} from '../../../../types/graphQL/invoice.ts';
import {Supplier} from '../../../../types/graphQL/suppliers.ts';
import {getYearOptions} from '../../../../utils/getYearOptions.ts';
import {useDebounce} from '../../../../utils/useDebounce.ts';
import {contractsOverviewTableHeads} from '../constants.tsx';
import {Row} from './styles.ts';

export interface ContractsOverviewFilters {
  year?: DropdownData<string> | null;
  supplier_id?: DropdownData<number> | null;
  status?: DropdownData<string> | null;
  search?: string;
}

const initialContractsFilterValues = {
  year: null,
  supplier_id: null,
  status: null,
  search: '',
};

const ContractsOverview = () => {
  const {
    alert,
    contextMain,
    navigation: {navigate},
  } = useAppContext();
  const [page, setPage] = useState(1);
  const [filterValues, setFilterValues] = useState<ContractsOverviewFilters>(initialContractsFilterValues);
  const [showDeleteModalId, setShowDeleteModalId] = useState<number | undefined>(undefined);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const onFilter = (value: DropdownData<string> | ChangeEvent<HTMLInputElement>, name: string) => {
    if ('target' in value) {
      setFilterValues({...filterValues, [name]: value.target.value});
    } else {
      setFilterValues({...filterValues, [name]: value});
    }
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const onPageChange = (page: number) => {
    setPage(page + 1);
  };

  const {invoice, total, fetch} = useGetInvoice({
    page: page,
    size: PAGE_SIZE,
    type: 'contracts',
    status: filterValues.status ? filterValues.status.id : '',
    year: filterValues.year ? filterValues.year.id : null,
    search: debouncedSearch,
    supplier_id: filterValues.supplier_id ? filterValues.supplier_id.id : null,
    organization_unit_id: contextMain?.organization_unit?.id,
  });

  const {suppliers} = useGetSuppliers({});

  const {deleteInvoice} = useDeleteInvoice();

  const onDelete = (invoice: InvoiceItem) => {
    setShowDeleteModalId(invoice.id);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModalId(undefined);
  };

  const handleDelete = async () => {
    if (!showDeleteModalId) return;

    await deleteInvoice(
      showDeleteModalId,
      () => {
        alert.success('Uspješno ste obrisali ugovor.');
        fetch();
      },
      () => {
        alert.error('Došlo je do greške prilikom brisanja ugovora.');
      },
    );
    setShowDeleteModalId(undefined);
  };

  const suppliersOptions = useMemo(() => {
    const options = suppliers.map((supplier: Supplier) => ({
      id: supplier.id,
      title: supplier.title,
    }));
    options.unshift({id: 0, title: 'Svi dobavljači'});
    return options;
  }, [suppliers]);

  return (
    <>
      <Row>
        <Dropdown
          label="SUBJEKT:"
          placeholder="Odaberi subjekt"
          options={suppliersOptions}
          value={filterValues.supplier_id}
          onChange={value => onFilter(value as DropdownData<string>, 'supplier_id')}
        />
        <Dropdown
          label="GODINA:"
          options={getYearOptions(10, true, 1)}
          value={filterValues.year}
          name="year"
          onChange={value => onFilter(value as DropdownData<string>, 'year')}
          placeholder="Odaberite godinu"
        />
        <Dropdown
          name="status"
          label="STATUS:"
          placeholder="Odaberi status"
          options={StatusOptions}
          value={filterValues.status}
          onChange={value => onFilter(value as DropdownData<string>, 'status')}
        />
        <Input
          name="search"
          label="PRETRAGA:"
          placeholder="Unesi pojam"
          onChange={onSearch}
          value={search}
          rightContent={<SearchIcon style={{marginLeft: 10, marginRight: 10}} stroke={Theme.palette.gray500} />}
        />
      </Row>
      <Table
        tableHeads={contractsOverviewTableHeads}
        data={invoice}
        emptyMessage="Još nema ugovora"
        tableActions={[
          {
            name: 'Izmijeni',
            onClick: (row: ContractItem) =>
              navigate(`/finance/liabilities-receivables/liabilities/contracts/${row.id}`),
            icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
            shouldRender: row => row.status === 'Kreiran' && !row.registred,
          },
          {
            name: 'Izbriši',
            onClick: onDelete,
            icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
            shouldRender: row => row.status === 'Kreiran' && !row.registred,
          },
        ]}
      />
      <Pagination
        pageCount={total ? Math.ceil(total / PAGE_SIZE) : 0}
        onChange={onPageChange}
        variant="filled"
        itemsPerPage={PAGE_SIZE}
        pageRangeDisplayed={3}
        style={{marginTop: '20px'}}
      />
      <ConfirmationModal
        open={!!showDeleteModalId}
        subTitle="Ovaj ugovor će biti trajno izbrisan iz sistema."
        onClose={() => handleCloseDeleteModal()}
        onConfirm={() => handleDelete()}
      />
    </>
  );
};

export default ContractsOverview;
