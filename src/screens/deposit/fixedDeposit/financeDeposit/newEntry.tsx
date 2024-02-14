import {Button, Table} from 'client-library';
import Footer from '../../../../shared/footer';
import PlusButton from '../../../../shared/plusButton';
import {newEntrytableHeads} from './constants';
import {CustomDatepicker, CustomDropdown, CustomInput, PlusButtonWrapper, Price, Row, SubTitle} from './styles';
import useAppContext from '../../../../context/useAppContext';

const NewEntry = () => {
  const {
    navigation: {navigate},
  } = useAppContext();

  // TO DO add logic when the backend is ready

  return (
    <>
      <Row>
        <CustomInput label="BROJ PREDMETA:" />
        <CustomDropdown options={[]} label="IME I PREZIME SUDIJE" />
      </Row>
      <CustomInput label="IME I PREZIME STRANKE:" />
      <Row>
        <CustomDatepicker label="DATUM PRIJEMA AKTA:" onChange={() => console.log('changed')} />
        <CustomDatepicker options={[]} label="DATUM PREDMETA" onChange={() => console.log('changed')} />
      </Row>
      <Row>
        <CustomDropdown options={[]} label="KONTO" />
        <CustomInput label="OPIS KONTA:" />
      </Row>
      <PlusButtonWrapper>
        <PlusButton onClick={() => console.log('click')} />
      </PlusButtonWrapper>

      <Table tableHeads={newEntrytableHeads} data={[]} style={{marginBottom: 22}} />

      <Row>
        <SubTitle variant="bodySmall" content="SALDO/IZNOS:" />
        <Price variant="bodySmall" content="100,00 Є" />
      </Row>
      <Footer>
        <Button content="Odustani" variant="secondary" onClick={() => navigate('/finance/deposit/fixed/finance')} />
        <Button content="Sačuvaj" variant="primary" onClick={() => console.log('click')} />
      </Footer>
    </>
  );
};

export default NewEntry;
