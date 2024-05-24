import useAppContext from '../../../../context/useAppContext.ts';
import useGetInvoice from '../../../../services/graphQL/invoice/useGetInvoice.ts';
import ScreenWrapper from '../../../../shared/screenWrapper/screenWrapper.tsx';
import {ContractItem} from '../../../../types/graphQL/invoice.ts';
import {CustomDivider, MainTitle, SectionBox} from '../../../accounting/styles.tsx';
import ContractsEntry from '../contractsEntry/contractsEntry.tsx';

const ContractsDetails = () => {
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
    type: 'contracts',
    organization_unit_id: contextMain?.organization_unit?.id,
    id: id,
  });

  const contractsItem = invoice.length ? invoice[0] : undefined;
  return (
    <ScreenWrapper>
      <SectionBox>
        <MainTitle variant="bodyMedium" content={'PREGLED UGOVORA'} style={{marginBottom: 0}} />
        <CustomDivider style={{marginTop: 0}} />
        <ContractsEntry contract={contractsItem as ContractItem} />
      </SectionBox>
    </ScreenWrapper>
  );
};

export default ContractsDetails;
