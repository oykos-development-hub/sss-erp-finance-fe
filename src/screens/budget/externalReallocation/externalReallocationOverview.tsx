import {Button, Divider, Dropdown, Table, TableHead} from 'client-library';
import {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {ExternalReallocationModal} from '../../../components/externalReallocationModal/externalReallocationModal';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper';
import {getYearOptions} from '../../../utils/getYearOptions';
import {ButtonWrapper, DropdownWrapper, HeaderWrapper, MainTitle, SectionBox, Wrapper} from './styles';

const tableHeads: TableHead[] = [
  {
    title: 'ID',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Datum zahtjeva',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Podnosilac zahtjeva',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Izvor',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Primalac',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Status',
    accessor: 'status',
    type: 'text',
  },
];

const ExternalReallocationOverview = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const {control} = useForm();

  const toogleModal = () => {
    setIsOpen(prev => !prev);
  };
  // TO DO add BE
  return (
    <ScreenWrapper>
      <SectionBox>
        <MainTitle variant="bodyMedium" content="EKSTERNO PREUSMJERENJE" />
        <Divider color="#615959" height="1px" />
        <Wrapper>
          <HeaderWrapper>
            <DropdownWrapper>
              <Controller
                name="year"
                control={control}
                render={({field: {name, value, onChange}}) => (
                  <Dropdown
                    name={name}
                    value={value}
                    onChange={onChange}
                    options={getYearOptions(10, true, 5)}
                    label="GODINA:"
                  />
                )}
              />
            </DropdownWrapper>
            <DropdownWrapper>
              <Controller
                name="status"
                control={control}
                render={({field: {name, value, onChange}}) => (
                  <Dropdown name={name} value={value} onChange={onChange} options={[]} label="STATUS:" />
                )}
              />
            </DropdownWrapper>
          </HeaderWrapper>
          <ButtonWrapper>
            <Button
              content="Kreiraj eksterno preusmjerenje"
              style={{width: '200px'}}
              variant="secondary"
              onClick={() => toogleModal()}
            />
          </ButtonWrapper>
        </Wrapper>
        <Table data={[]} tableHeads={tableHeads} />

        {isOpen && <ExternalReallocationModal onClose={toogleModal} open={isOpen} />}
      </SectionBox>
    </ScreenWrapper>
  );
};

export default ExternalReallocationOverview;
