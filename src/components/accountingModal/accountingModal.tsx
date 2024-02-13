import {Modal, Table, TableHead} from 'client-library';
import {AccountingModalProps} from './types';

const tableHeads: TableHead[] = [
  {
    title: 'Konto',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Subjekt',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Duguje',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Potražuje',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Vrsta obaveze',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Broj predmeta',
    accessor: '',
    type: 'text',
  },
];

export const AccountingModal = ({open, onClose}: AccountingModalProps) => {
  // TO DO implement the logic when the BE is done

  return (
    <>
      <Modal
        open={open}
        onClose={() => onClose()}
        leftButtonText="Otkaži"
        rightButtonText="Sačuvaj"
        content={<Table tableHeads={tableHeads} data={[]} style={{marginBottom: 22}} />}
        title="Pregled knjiženja"
      />
    </>
  );
};
