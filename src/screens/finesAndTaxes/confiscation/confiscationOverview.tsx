import {Pagination, PrinterIcon, SearchIcon, Table, Theme, TrashIcon} from 'client-library';
import {PAGE_SIZE} from '../../../constants.ts';
import {tableHeadsConfiscationOverview} from './constants.ts';
import {Header} from './styles.ts';
import {FilterInput} from '../../accounting/styles.tsx';
import {Filters, FilterDropdown} from '../../budget/planning/budgetList/styles.ts';

const ConfiscationOverview = () => {
  // TO DO implement the logic when the BE is done
  return (
    <>
      <Header>
        <Filters>
          <FilterDropdown label="SUBJEKAT:" options={[]} name="subject" />
          <FilterDropdown label="VRSTA TAKSE:" options={[]} name="type" />
          <FilterInput label="PRETRAGA:" rightContent={<SearchIcon />} />
        </Filters>
      </Header>
      <Table
        tableHeads={tableHeadsConfiscationOverview}
        data={[]}
        style={{marginBottom: 22}}
        emptyMessage={'Još uvjek nema podataka o oduzimanju imovine'}
        tableActions={[
          {
            name: 'send',
            onClick: () => undefined,
            icon: <PrinterIcon stroke={Theme?.palette?.gray800} />,
          },
          {
            name: 'delete',
            onClick: () => undefined,
            icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
          },
        ]}
      />
      <Pagination
        pageCount={1}
        onChange={() => undefined}
        variant="filled"
        itemsPerPage={PAGE_SIZE}
        pageRangeDisplayed={3}
        style={{marginTop: '20px'}}
      />
    </>
  );
};

export default ConfiscationOverview;
