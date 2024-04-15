import {Divider, Table} from 'client-library';
import ScreenWrapper from '../../../../shared/screenWrapper/screenWrapper.tsx';
import SectionBox from '../../../../shared/sectionBox.ts';
import {tableHeads} from './constants.tsx';

const TaxContributionCalculationOverview = () => {
  // TO DO add logic when the backend is ready

  return (
    <ScreenWrapper>
      <SectionBox>
        {/* <MainTitle variant="bodyMedium" content="OBRAČUNI POREZA I DOPRINOSA - PREGLED" /> */}
        <Divider color="#615959" height="1px" />
        {/* <Header>
          <Filters>
            <FilterDropdown label="UPLATILAC:" options={[]} name="subject" />
            <FilterDropdown label="STATUS:" options={[]} name="status" />
            <FilterInput label="PRETRAGA:" rightContent={<SearchIcon />} />
          </Filters>
        </Header> */}
        <Table tableHeads={tableHeads} data={[]} style={{marginBottom: 22}} />
      </SectionBox>
    </ScreenWrapper>
  );
};

export default TaxContributionCalculationOverview;
