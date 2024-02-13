import {Pagination, PrinterIcon, SearchIcon, Table, Theme, TrashIcon} from 'client-library';
import {useState} from 'react';
import {FilterDropdown, Filters} from '../../components/budgetList/styles.ts';
import {PAGE_SIZE} from '../../constants.ts';
import useGetOrganizationUnits from '../../services/graphQL/organizationUnits/useGetOrganizationUnits.ts';
import {DeleteModal} from '../../shared/deleteModal/deleteModal.tsx';
import {BudgetOverviewItem} from '../../types/graphQL/budgetOverview.ts';
import {tableHeadsAccountingOverview} from './constants.tsx';
import {FilterInput, Header} from './styles.tsx';

const AccountingOverview = () => {
  // TO DO implement the logic when the BE is done

  const [showDeleteModalBudgetId, setShowDeleteModalBudgetId] = useState<number | undefined>(undefined);

  const onDelete = (budget: BudgetOverviewItem) => {
    setShowDeleteModalBudgetId(budget.id);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModalBudgetId(undefined);
  };

  const {organizationUnits} = useGetOrganizationUnits();
  return (
    <>
      <Header>
        <Filters>
          <FilterDropdown label="ORGANIZACIONA JEDINICA:" options={organizationUnits} name="organization_unit" />
          <FilterDropdown label="VRSTA OBAVEZE:" options={[]} name="type" />
          <FilterInput label="PRETRAGA:" rightContent={<SearchIcon />} />
        </Filters>
      </Header>
      <Table
        tableHeads={tableHeadsAccountingOverview}
        data={[]}
        style={{marginBottom: 22}}
        tableActions={[
          {
            name: 'send',
            onClick: () => {},
            icon: <PrinterIcon stroke={Theme?.palette?.gray800} />,
          },
          {
            name: 'delete',
            onClick: onDelete,
            icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
          },
        ]}
      />
      <DeleteModal
        open={!!showDeleteModalBudgetId}
        onClose={() => {
          handleCloseDeleteModal();
        }}
        handleDelete={() => {}}
      />
      <Pagination
        pageCount={1}
        onChange={() => {}}
        variant="filled"
        itemsPerPage={PAGE_SIZE}
        pageRangeDisplayed={3}
        style={{marginTop: '20px'}}
      />
    </>
  );
};

export default AccountingOverview;
