import {Button} from 'client-library';
import useAppContext from '../../../../context/useAppContext';
import Footer from '../../../../shared/footer';
import {CustomDatepicker, CustomDropdown, CustomInput, Row} from './styles';

const NewTestamentEntry = () => {
  const {
    navigation: {navigate},
  } = useAppContext();

  // TO DO add logic when the backend is ready

  return (
    <>
      <Row>
        <CustomInput label="BROJ PREDMETA (SI BROJ):" />
        <CustomInput label="BROJ PREDMETA (RS BROJ):" />
      </Row>
      <Row>
        <CustomDatepicker label="DATUM PRIJEMA (SI BROJ):" onChange={() => console.log('changed')} />
        <CustomDatepicker options={[]} label="DATUM PRIJEMA (RS BROJ):" onChange={() => console.log('changed')} />
      </Row>
      <Row>
        <CustomInput label="IME I PREZIME TESTATORA:" />
        <CustomInput label="IME OCA:" />
      </Row>
      <Row>
        <CustomDatepicker label="DATUM ROĐENJA:" onChange={() => console.log('changed')} />
        <CustomInput label="JMBG:" />
      </Row>
      <Row>
        <CustomDropdown options={[]} label="IME I PREZIME SUDIJE:" />
        <CustomInput label="BROJ PREDMETA IZDAVANJA:" />
      </Row>
      <Row>
        <CustomDatepicker label="DATUM IZDAVANJA:" onChange={() => console.log('changed')} />
        <CustomDatepicker options={[]} label="DATUM VRAĆANJA U DEPOZIT:" onChange={() => console.log('changed')} />
      </Row>
      <CustomInput label="OPIS:" placeholder="Unesite opis..." textarea />
      <Footer>
        <Button content="Odustani" variant="secondary" onClick={() => navigate('/finance/deposit/fixed/will')} />
        <Button content="Sačuvaj" variant="primary" onClick={() => console.log('click')} />
      </Footer>
    </>
  );
};

export default NewTestamentEntry;
