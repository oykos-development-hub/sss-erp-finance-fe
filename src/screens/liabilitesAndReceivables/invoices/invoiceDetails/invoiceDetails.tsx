import useAppContext from '../../../../context/useAppContext.ts';
import useGetInvoice from '../../../../services/graphQL/invoice/useGetInvoice.ts';
import ScreenWrapper from '../../../../shared/screenWrapper/screenWrapper.tsx';
import {CustomDivider, MainTitle, SectionBox} from '../../../accounting/styles.tsx';
import InvoiceEntry from '../invoiceEntry/InvoiceEntry.tsx';

const InvoiceDetails = () => {
  const {
    navigation: {
      location: {pathname},
    },
    contextMain,
  } = useAppContext();
  const id = pathname && pathname.split('/')[pathname.split('/').length - 1];
  const {invoice} = useGetInvoice({
    page: 1,
    size: 1000,
    type: 'invoice',
    organization_unit_id: contextMain?.organization_unit?.id,
    id: id,
  });

  const invoiceItem = invoice.length ? invoice[0] : undefined;
  return (
    <ScreenWrapper>
      <SectionBox>
        <MainTitle
          variant="bodyMedium"
          content={
            invoiceItem?.is_invoice
              ? `RAČUN: ${invoiceItem?.invoice_number}`
              : `PREDRAČUN: ${invoiceItem?.invoice_number}`
          }
          style={{marginBottom: 0}}
        />
        <CustomDivider style={{marginTop: 0}} />
        <InvoiceEntry invoice={invoiceItem} />
      </SectionBox>
    </ScreenWrapper>
  );
};

export default InvoiceDetails;
