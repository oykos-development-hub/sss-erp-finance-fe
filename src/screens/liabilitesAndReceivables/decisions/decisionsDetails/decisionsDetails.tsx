import useAppContext from '../../../../context/useAppContext.ts';
import useGetInvoice from '../../../../services/graphQL/invoice/useGetInvoice.ts';
import ScreenWrapper from '../../../../shared/screenWrapper/screenWrapper.tsx';
import {CustomDivider, MainTitle, SectionBox} from '../../../accounting/styles.tsx';
import DecisionsEntry from '../decisionsEntry/decisionsEntry.tsx';

const DecisionsDetails = () => {
  const {
    navigation: {
      location: {pathname},
    },
    contextMain,
  } = useAppContext();
  const id = pathname && pathname.split('/')[pathname.split('/').length - 1];
  const {invoice} = useGetInvoice({
    page: 1,
    size: 1,
    type: 'decisions',
    organization_unit_id: contextMain?.organization_unit?.id,
    id: id,
  });

  const decisionsItem = invoice.length ? invoice[0] : undefined;
  return (
    <ScreenWrapper>
      <SectionBox>
        <MainTitle variant="bodyMedium" content={'PREGLED RJEŠENJA'} style={{marginBottom: 0}} />
        <CustomDivider style={{marginTop: 0}} />
        <DecisionsEntry decision={decisionsItem} />
      </SectionBox>
    </ScreenWrapper>
  );
};

export default DecisionsDetails;
