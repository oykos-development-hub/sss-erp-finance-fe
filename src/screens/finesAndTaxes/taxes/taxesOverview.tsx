import {Pagination, SearchIcon, Table, Theme, TrashIcon} from 'client-library';
import {feeSubcategoryOptions, feeTypeOptions, PAGE_SIZE} from '../../../constants.ts';
import useGetFees from '../../../services/graphQL/fees/useGetFees.ts';
import {FilterInput} from '../../accounting/styles.tsx';
import {FilterDropdown, Filters} from '../../budget/planning/budgetList/styles.ts';
import {tableHeadsTaxesOverview} from './constants.tsx';
import {Header} from './styles.ts';
import {FinesOverviewItem} from '../../../types/graphQL/finesOverview.ts';
import {ConfirmationModal} from '../../../shared/confirmationModal/confirmationModal.tsx';
import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import useDeleteFee from '../../../services/graphQL/fees/useDeleteFee.ts';
import {useDebounce} from '../../../utils/useDebounce.ts';
import {defaultDropdownOption} from '../fines/constants.tsx';

const initialValues = {
  fee_type_id: undefined,
  fee_subcategory_id: undefined,
};
const TaxesOverview = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(initialValues);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const {fees, refetch, total, loading} = useGetFees({
    page: page,
    size: PAGE_SIZE,
    ...filters,
    search: debouncedSearch,
  });
  const [showDeleteFeeModal, setShowDeleteFeeModal] = useState<number | null>(null);

  const {
    navigation: {navigate},
    alert,
  } = useAppContext();
  // TO DO implement the logic when the BE is done
  const {deleteFee} = useDeleteFee();

  const handleDeleteFee = async () => {
    if (!showDeleteFeeModal) return;

    await deleteFee(
      showDeleteFeeModal,
      () => {
        refetch();
        alert.success('Uspješno obrisano.');
      },
      () => {
        alert.error('Greška. Brisanje nije uspjelo.');
      },
    );
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const onFilterChange = (value: any, name: string) => {
    setFilters({...filters, [name]: value?.id});
  };

  const onPageChange = (page: number) => {
    setPage(page + 1);
  };

  const filterDropdownOptionsType = [defaultDropdownOption, ...feeTypeOptions] || [];
  const filterDropdownOptionsSubcategory = [defaultDropdownOption, ...feeSubcategoryOptions] || [];

  return (
    <>
      <Header>
        <Filters>
          <FilterDropdown
            name="fee_type_id"
            value={filterDropdownOptionsType.find(option => option.id === filters?.fee_type_id)}
            onChange={(value: any) => onFilterChange(value, 'fee_type_id')}
            label="VRSTA TAKSE:"
            options={filterDropdownOptionsType}
          />
          <FilterDropdown
            name="fee_subcategory_id"
            value={filterDropdownOptionsSubcategory.find(option => option.id === filters?.fee_subcategory_id)}
            onChange={(value: any) => onFilterChange(value, 'fee_subcategory_id')}
            label="POTKATEGORIJA TAKSE:"
            options={filterDropdownOptionsSubcategory}
          />

          <FilterInput
            label="PRETRAGA:"
            rightContent={<SearchIcon />}
            name="search"
            onChange={onSearch}
            value={search}
          />
        </Filters>
      </Header>
      <Table
        tableHeads={tableHeadsTaxesOverview}
        data={fees}
        isLoading={loading}
        style={{marginBottom: 22}}
        emptyMessage={'Još uvjek nema taksi'}
        onRowClick={(row: FinesOverviewItem) => navigate(`/finance/fines-taxes/taxes/${row.id}`)}
        tableActions={[
          {
            name: 'delete',
            onClick: row => setShowDeleteFeeModal(row.id),
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
      <ConfirmationModal
        open={!!showDeleteFeeModal}
        subTitle={'Ova taksa će biti trajno izbrisana iz sistema.'}
        onClose={() => setShowDeleteFeeModal(null)}
        onConfirm={() => handleDeleteFee()}
      />
    </>
  );
};

export default TaxesOverview;
