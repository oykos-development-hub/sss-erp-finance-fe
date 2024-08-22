import {Dropdown, EditIconTwo, Input, Pagination, SearchIcon, Table, Theme, TrashIcon} from 'client-library';
import {ChangeEvent, useEffect, useMemo, useState} from 'react';
import {PAGE_SIZE} from '../../../../constants.ts';
import useAppContext from '../../../../context/useAppContext.ts';
import useDeleteInvoice from '../../../../services/graphQL/invoice/useDeleteInvoice.ts';
import useGetInvoice from '../../../../services/graphQL/invoice/useGetInvoice.ts';
import useGetSuppliers from '../../../../services/graphQL/suppliers/useGetSuppliers.ts';
import {ConfirmationModal} from '../../../../shared/confirmationModal/confirmationModal.tsx';
import {DropdownData} from '../../../../types/dropdownData.ts';
import {InvoiceItem} from '../../../../types/graphQL/invoice.ts';
import {Supplier} from '../../../../types/graphQL/suppliers.ts';
import {getYearOptions} from '../../../../utils/getYearOptions.ts';
import {useDebounce} from '../../../../utils/useDebounce.ts';
import {StatusOptionsInvoice, invoicesOverviewTableHeads} from '../constants.tsx';
import {Row} from './styles.ts';
import useGetOrganizationUnits from '../../../../services/graphQL/organizationUnits/useGetOrganizationUnits.ts';

export interface InvoiceOverviewFilters {
  year?: DropdownData<string> | null;
  supplier_id?: DropdownData<number> | null;
  organization_unit_id?: DropdownData<number> | null;
  status?: DropdownData<string> | null;
  search?: string;
}

const initialInvoiceFilterValues = {
  year: null,
  supplier_id: null,
  status: null,
  search: '',
  organization_unit_id: null,
};

const InvoicesOverview = () => {
  const {
    alert,
    navigation: {navigate},
    contextMain,
  } = useAppContext();
  const [showDeleteModalInvoiceId, setShowDeleteModalInvoiceId] = useState<number>(0);
  const [page, setPage] = useState(1);
  const [filterValues, setFilterValues] = useState<InvoiceOverviewFilters>(initialInvoiceFilterValues);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const {organizationUnits} = useGetOrganizationUnits({disable_filters: true});
  // TODO replace with logic from permissions
  const isUserSSS = contextMain?.organization_unit?.title === 'Sekretarijat Sudskog savjeta';
  const organizationUnitsFilter = (): number | undefined => {
    if (isUserSSS) {
      return filterValues.organization_unit_id ? filterValues.organization_unit_id.id : undefined;
    }
    return contextMain?.organization_unit?.id;
  };

  const {invoice, total, fetch} = useGetInvoice({
    page: page,
    size: PAGE_SIZE,
    type: 'invoices',
    status: filterValues.status ? filterValues.status.id : '',
    supplier_id: filterValues.supplier_id ? filterValues.supplier_id.id : null,
    year: filterValues.year ? filterValues.year.id : null,
    search: debouncedSearch,
    organization_unit_id: organizationUnitsFilter(),
  });

  const {deleteInvoice} = useDeleteInvoice();
  const {suppliers} = useGetSuppliers({});

  const onDelete = (invoice: InvoiceItem) => {
    setShowDeleteModalInvoiceId(invoice.id);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModalInvoiceId(0);
  };

  const handleDelete = async () => {
    if (!showDeleteModalInvoiceId) return;

    await deleteInvoice(
      showDeleteModalInvoiceId,
      () => {
        alert.success('Uspješno ste obrisali račun.');
        fetch();
      },
      () => {
        alert.error('Došlo je do greške prilikom brisanja računa.');
      },
    );
    setShowDeleteModalInvoiceId(0);
  };

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

  useEffect(() => {
    if (page === 1) return;
    setPage(1);
  }, [debouncedSearch, filterValues]);

  const suppliersOptions = useMemo(() => {
    const options = suppliers.map((supplier: Supplier) => ({
      id: supplier.id,
      title: supplier.title,
    }));
    options.unshift({id: 0, title: 'Svi dobavljači'});
    return options;
  }, [suppliers]);

  const foundItem = invoice?.find(item => item?.id === showDeleteModalInvoiceId);
  const isInvoice = foundItem ? foundItem.is_invoice : null;

  return (
    <>
      <Row>
        {isUserSSS && (
          <Dropdown
            name="organization_unit_id"
            label="ORGANIZACIONA JEDINICA:"
            placeholder="Odaberi organizacionu jedinicu"
            options={[{id: null, title: 'Sve organizacione jedinice'}, ...organizationUnits]}
            value={filterValues?.organization_unit_id}
            onChange={value => onFilter(value as DropdownData<string>, 'organization_unit_id')}
          />
        )}
        <Dropdown
          name="supplier_id"
          label="DOBAVLJAČ:"
          placeholder="Odaberi dobavljača"
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
          options={StatusOptionsInvoice}
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
        tableHeads={invoicesOverviewTableHeads}
        data={invoice}
        style={{marginBottom: 22}}
        emptyMessage="Još nema računa"
        onRowClick={row =>
          (row.status === 'Djelimično na nalogu' || (row.status === 'Na nalogu' && row?.is_invoice)) &&
          navigate(`/finance/liabilities-receivables/liabilities/invoices/${row.id}`)
        }
        tableActions={[
          {
            name: 'Izmijeni',
            onClick: (row: InvoiceItem) => navigate(`/finance/liabilities-receivables/liabilities/invoices/${row.id}`),
            icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
            shouldRender: row =>
              !row.receipt_date &&
              (row.status === 'Nepotpun' ||
                (row.status === 'Kreiran' && !row.registred) ||
                (row.status === 'Na nalogu' && !row?.is_invoice)),
          },
          {
            name: 'Izbriši',
            onClick: row => onDelete(row),
            icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
            shouldRender: row => !row.receipt_date && row.status === 'Kreiran' && !row.registred,
          },
        ]}
      />

      <ConfirmationModal
        open={!!showDeleteModalInvoiceId}
        subTitle={
          isInvoice
            ? 'Ovaj račun će biti trajno izbrisan iz sistema.'
            : 'Ovaj predračun će biti trajno izbrisan iz sistema.'
        }
        onClose={() => handleCloseDeleteModal()}
        onConfirm={() => handleDelete()}
      />

      <Pagination
        pageCount={total ? Math.ceil(total / PAGE_SIZE) : 0}
        onChange={onPageChange}
        variant="filled"
        itemsPerPage={PAGE_SIZE}
        pageRangeDisplayed={3}
        style={{marginTop: '20px'}}
      />
    </>
  );
};

export default InvoicesOverview;
