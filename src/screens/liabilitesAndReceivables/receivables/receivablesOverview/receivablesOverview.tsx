import {
  Button,
  Divider,
  Dropdown,
  EditIconTwo,
  Input,
  Pagination,
  SearchIcon,
  Table,
  Theme,
  TrashIcon,
} from 'client-library';
import {ChangeEvent, useMemo, useState} from 'react';
import {PAGE_SIZE} from '../../../../constants.ts';
import useAppContext from '../../../../context/useAppContext.ts';
import useGetOrganizationUnits from '../../../../services/graphQL/organizationUnits/useGetOrganizationUnits.ts';
import useDeletePaymentOrder from '../../../../services/graphQL/receivables/useDeletePaymentOrder.ts';
import useGetPaymentOrder from '../../../../services/graphQL/receivables/useGetPaymentOrder.ts';
import {ConfirmationModal} from '../../../../shared/confirmationModal/confirmationModal.tsx';
import {MainTitle} from '../../../../shared/pageElements.ts';
import ScreenWrapper from '../../../../shared/screenWrapper/screenWrapper.tsx';
import SectionBox from '../../../../shared/sectionBox.ts';
import {DropdownData} from '../../../../types/dropdownData.ts';
import {PaymentOrderItem} from '../../../../types/graphQL/receivablesTypes.ts';
import {getYearOptions} from '../../../../utils/getYearOptions.ts';
import {useDebounce} from '../../../../utils/useDebounce.ts';
import {Row} from '../../decisions/decisionsOverview/styles.ts';
import {receivablesStatusOptions, tableHeads} from '../constants.tsx';
import {ButtonOverviewWrapper, FilterWrapper, RowWrapper} from '../styles.ts';
import {Supplier} from '../../../../types/graphQL/suppliers.ts';
import useGetSuppliers from '../../../../services/graphQL/suppliers/useGetSuppliers.ts';

export interface DecisionsOverviewFilters {
  year?: DropdownData<string> | null;
  organization_unit_id?: DropdownData<number> | null;
  status?: DropdownData<string> | null;
  search?: string;
  supplier_id?: DropdownData<number> | null;
}

const initialDecisionsFilterValues = {
  year: null,
  organization_unit_id: null,
  status: null,
  search: '',
  supplier_id: null,
};

const ReceivablesOverview = () => {
  const {
    alert,
    navigation: {navigate},
  } = useAppContext();
  const [page, setPage] = useState(1);
  const [filterValues, setFilterValues] = useState<DecisionsOverviewFilters>(initialDecisionsFilterValues);
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
  const {organizationUnits} = useGetOrganizationUnits(undefined, {allOption: true});
  const {suppliers} = useGetSuppliers({});

  const {paymentOrder, total, fetch} = useGetPaymentOrder({
    page: page,
    size: PAGE_SIZE,
    status: filterValues.status ? filterValues.status.id : '',
    year: filterValues.year ? filterValues.year.id : null,
    search: debouncedSearch,
    organization_unit_id: filterValues.organization_unit_id ? filterValues.organization_unit_id.id : null,
    supplier_id: filterValues.supplier_id ? filterValues.supplier_id.id : null,
  });

  const {deletePaymentOrder} = useDeletePaymentOrder();

  const onPageChange = (page: number) => {
    setPage(page + 1);
  };

  const onDelete = (invoice: any) => {
    setShowDeleteModalId(invoice.id);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModalId(undefined);
  };

  const handleDelete = async () => {
    if (!showDeleteModalId) return;

    await deletePaymentOrder(
      showDeleteModalId,
      () => {
        alert.success('Uspješno ste obrisali nalog.');
        fetch();
      },
      () => {
        alert.error('Došlo je do greške prilikom brisanja naloga.');
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
    <ScreenWrapper>
      <SectionBox>
        <MainTitle variant="bodyMedium" content="NALOZI ZA PLAĆANJE" />
        <Divider color="#615959" height="1px" />
        <RowWrapper>
          <Row>
            <FilterWrapper>
              <Dropdown
                label="SUBJEKT:"
                placeholder="Odaberi subjekt"
                options={suppliersOptions}
                value={filterValues.supplier_id}
                onChange={value => onFilter(value as DropdownData<string>, 'supplier_id')}
              />
            </FilterWrapper>
            <FilterWrapper>
              <Dropdown
                label="ORGANIZACIONA JEDINICA:"
                placeholder={'Odaberite organizacionu jedinicu'}
                options={organizationUnits}
                value={filterValues.organization_unit_id}
                onChange={value => onFilter(value as DropdownData<string>, 'organization_unit_id')}
              />
            </FilterWrapper>
            <FilterWrapper>
              <Dropdown
                label="GODINA:"
                options={getYearOptions(10, true, 1)}
                value={filterValues.year}
                name="year"
                onChange={value => onFilter(value as DropdownData<string>, 'year')}
                placeholder="Odaberite godinu"
              />
            </FilterWrapper>
            <FilterWrapper>
              <Dropdown
                name="status"
                label="STATUS:"
                placeholder="Odaberi status"
                options={receivablesStatusOptions}
                value={filterValues.status}
                onChange={value => onFilter(value as DropdownData<string>, 'status')}
              />
            </FilterWrapper>
            <FilterWrapper>
              <Input
                name="search"
                label="PRETRAGA:"
                placeholder="Unesi pojam"
                onChange={onSearch}
                value={search}
                rightContent={<SearchIcon style={{marginLeft: 10, marginRight: 10}} stroke={Theme.palette.gray500} />}
              />
            </FilterWrapper>
          </Row>
        </RowWrapper>
        <ButtonOverviewWrapper>
          <Button
            content="Kreirajte nalog za plaćanje"
            size="md"
            onClick={() => navigate('/finance/liabilities-receivables/receivables/add-receivable')}
          />
        </ButtonOverviewWrapper>

        <Table
          tableHeads={tableHeads}
          data={paymentOrder || []}
          onRowClick={(row: PaymentOrderItem) =>
            row.status === 'Plaćen' && navigate(`/finance/liabilities-receivables/receivables/${row.id}`)
          }
          emptyMessage={'Još nema naloga za plaćanje'}
          tableActions={[
            {
              name: 'Izmijeni',
              onClick: (row: PaymentOrderItem) => navigate(`/finance/liabilities-receivables/receivables/${row.id}`),
              icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
              shouldRender: row => row.status !== 'Plaćen',
            },
            {
              name: 'Izbriši',
              onClick: onDelete,
              icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
              shouldRender: row => row.status !== 'Plaćen',
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
          subTitle="Ovaj nalog će biti trajno izbrisan iz sistema."
          onClose={() => handleCloseDeleteModal()}
          onConfirm={() => handleDelete()}
        />
      </SectionBox>
    </ScreenWrapper>
  );
};

export default ReceivablesOverview;
