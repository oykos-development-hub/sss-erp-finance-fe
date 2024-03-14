import {Button, Pagination, SearchIcon, SendIcon, Table, Theme, TrashIcon} from 'client-library';
import {useState} from 'react';
import {AccountingModal} from '../../components/accountingModal/accountingModal.tsx';
import {PAGE_SIZE} from '../../constants.ts';
import useGetOrganizationUnits from '../../services/graphQL/organizationUnits/useGetOrganizationUnits.ts';
import {Controls, FilterDropdown, Filters} from '../budget/planning/budgetList/styles.ts';
import {tableHeads} from './constants.tsx';
import {FilterInput, Header} from './styles.tsx';

const Accounting = () => {
  // TO DO implement the logic when the BE is done

  const [accountingModal, setAccountingtModal] = useState(false);

  const {organizationUnits} = useGetOrganizationUnits();

  const toggleModal = () => setAccountingtModal(prev => !prev);

  return (
    <>
      <Header>
        <Filters>
          <FilterDropdown label="ORGANIZACIONA JEDINICA:" options={organizationUnits} name="organization_unit" />
          <FilterDropdown label="VRSTA OBAVEZE:" options={[]} name="type" />
          <FilterInput label="PRETRAGA:" rightContent={<SearchIcon />} />
        </Filters>
        <Controls>
          <Button content="Knjiži" variant="primary" style={{width: 130}} size="sm" onClick={toggleModal} />
        </Controls>
      </Header>
      <Table
        tableHeads={tableHeads}
        data={[]}
        style={{marginBottom: 22}}
        checkboxes
        tableActions={[
          {
            name: 'delete',
            onClick: () => {
              console.log('delete');
            },
            icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
          },
          {
            name: 'send',
            onClick: () => {
              console.log('send');
            },
            icon: <SendIcon stroke={Theme?.palette?.gray800} />,
          },
        ]}
      />

      <Pagination
        pageCount={1}
        onChange={() => {
          console.log('changed');
        }}
        variant="filled"
        itemsPerPage={PAGE_SIZE}
        pageRangeDisplayed={3}
        style={{marginTop: '20px'}}
      />

      <AccountingModal open={accountingModal} onClose={toggleModal} />
    </>
  );
};

export default Accounting;
