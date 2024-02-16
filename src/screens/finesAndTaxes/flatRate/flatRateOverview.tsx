import {Pagination, PrinterIcon, SearchIcon, Table, Theme, TrashIcon} from 'client-library';
import {FilterDropdown, Filters, FilterInput} from '../../../components/budgetList/styles.ts';
import {PAGE_SIZE} from '../../../constants.ts';
import {tableHeadsFinesOverview} from './constants.ts';
import {Header} from './styles.ts';

const FlatRateOverview = () => {
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
        tableHeads={tableHeadsFinesOverview}
        data={[]}
        style={{marginBottom: 22}}
        emptyMessage={'Još uvjek nema paušala'}
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

export default FlatRateOverview;
