import {Button, Checkbox} from 'client-library';
import Footer from '../../../../shared/footer';
import {CustomDatepicker, CustomDropdown, CustomInput, Price, PriceWrapper, Row, SubTitle} from './styles';
import useAppContext from '../../../../context/useAppContext';

const InitialStateNewEntry = () => {
  const {
    navigation: {navigate},
  } = useAppContext();

  // TO DO add logic when the backend is ready

  return (
    <>
      <Row>
        <CustomDropdown options={[]} label="UPLATILAC:" />
        <CustomInput label="BROJ PREDMETA:" />
      </Row>
      <CustomInput label="STRANKA U POSTUPKU:" />
      <Row>
        <CustomInput label="BROJ IZVODA:" />
        <CustomDatepicker options={[]} label="DATUM IZVODA:" onChange={() => console.log('changed')} />
      </Row>
      <Row>
        <CustomDropdown options={[]} label="KONTO" />
        <CustomInput label="OPIS KONTA:" />
      </Row>

      <Row>
        <Checkbox
          name={'Prelazni račun'}
          onChange={() => console.log('changed')}
          checked={false}
          style={{marginRight: '10px'}}
        />
        <SubTitle variant="bodySmall" content="Prelazni račun" />
      </Row>

      <PriceWrapper>
        <SubTitle variant="bodySmall" content="SALDO/IZNOS:" />
        <Price variant="bodySmall" content="100,00 Є" />
      </PriceWrapper>
      <Footer>
        <Button
          content="Odustani"
          variant="secondary"
          onClick={() => navigate('/finance/deposit/demand/initial-state')}
        />
        <Button content="Sačuvaj" variant="primary" onClick={() => console.log('click')} />
      </Footer>
    </>
  );
};

export default InitialStateNewEntry;
