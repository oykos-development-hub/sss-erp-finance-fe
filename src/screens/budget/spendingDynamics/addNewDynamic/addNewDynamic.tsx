import ScreenWrapper from '../../../../shared/screenWrapper/screenWrapper';
import {CustomDivider, MainTitle, SectionBox, TitleTabsWrapper} from '../styles';
import BudgetDynamicTemplate from './budgetDynamicTemplate';

const AddNewBudgetDynamic = () => {
  return (
    <ScreenWrapper>
      <SectionBox>
        <TitleTabsWrapper>
          <MainTitle variant="bodyMedium" content="DODAJ NOVU DINAMIKU" style={{marginBottom: 0}} />
        </TitleTabsWrapper>
        <CustomDivider style={{marginTop: 0}} />

        <BudgetDynamicTemplate />
      </SectionBox>
    </ScreenWrapper>
  );
};

export default AddNewBudgetDynamic;
