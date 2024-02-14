import {Button, Table} from 'client-library';
import useAppContext from '../../../../context/useAppContext';
import Footer from '../../../../shared/footer';
import PlusButton from '../../../../shared/plusButton';
import {newMaterialEntrytableHeads} from './constants';
import {CustomDatepicker, CustomDropdown, CustomInput, PlusButtonWrapper, Row} from './styles';

const NewEntryMaterial = () => {
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

      <PlusButtonWrapper>
        <PlusButton onClick={() => console.log('click')} />
      </PlusButtonWrapper>

      <Table tableHeads={newMaterialEntrytableHeads} data={[]} style={{marginBottom: 22}} />

      <Footer>
        <Button content="Odustani" variant="secondary" onClick={() => navigate('/finance/deposit/fixed/material')} />
        <Button content="Sačuvaj" variant="primary" onClick={() => console.log('click')} />
      </Footer>
    </>
  );
};

export default NewEntryMaterial;
