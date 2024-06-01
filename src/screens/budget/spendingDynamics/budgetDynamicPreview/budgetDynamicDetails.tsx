import useAppContext from '../../../../context/useAppContext';
import ScreenWrapper from '../../../../shared/screenWrapper/screenWrapper';
import {CustomDivider, MainTitle, SectionBox, TitleTabsWrapper} from '../styles';
import BudgetDynamicPreview from './budgetDynamicPreview';

const BudgetDynamicDetails = () => {
  const {
    navigation: {
      location: {pathname},
    },
  } = useAppContext();

  const version = isNaN(parseInt(pathname?.split('/')[5])) ? null : parseInt(pathname?.split('/')[5]);
  const isNew = pathname?.split('/')[5] === 'add-new';

  const title = isNew ? 'DODAJ NOVU DINAMIKU' : `DINAMIKA - VERZIJA ${version}`;

  return (
    <ScreenWrapper>
      <SectionBox>
        <TitleTabsWrapper>
          <MainTitle variant="bodyMedium" content={title} style={{marginBottom: 0}} />
        </TitleTabsWrapper>
        <CustomDivider style={{marginTop: 0}} />

        <BudgetDynamicPreview />
      </SectionBox>
    </ScreenWrapper>
  );
};

export default BudgetDynamicDetails;
