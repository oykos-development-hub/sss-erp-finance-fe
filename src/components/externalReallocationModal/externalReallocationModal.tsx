import {Dropdown, Input, Modal} from 'client-library';
import {Controller, useForm} from 'react-hook-form';
import useGetCountOverview from '../../services/graphQL/counts/useGetCountOverview';
import useGetOrganizationUnits from '../../services/graphQL/organizationUnits/useGetOrganizationUnits';
import {DropdownData} from '../../types/dropdownData';
import {useMemo} from 'react';
import {generateDropdownOptions} from '../../constants';

interface ExternalReallocationProps {
  onClose: () => void;
  open: boolean;
}

interface ExternalReallocationModalForm {
  organization_unit: DropdownData<string>;
  counts: DropdownData<string>;
}

const initialValues = {
  organization_unit: {
    id: '',
    title: '',
  },
  counts: {
    id: '',
    title: '',
  },
};

export const ExternalReallocationModal = ({open, onClose}: ExternalReallocationProps) => {
  const {
    formState: {errors},
    control,
  } = useForm<ExternalReallocationModalForm>({defaultValues: initialValues});

  const {organizationUnits} = useGetOrganizationUnits();
  const {counts} = useGetCountOverview({level: 3});

  const dropdowncountsOptions = useMemo(() => {
    return generateDropdownOptions(counts);
  }, [counts]);

  // TO DO add  BE
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="KREIRAJ EKSTERNO PREUSMJERENJE"
      leftButtonOnClick={onClose}
      rightButtonText="Kreiraj preusmjerenje"
      leftButtonText="Otkaži"
      content={
        <div>
          <Controller
            name="organization_unit"
            rules={{required: 'Ovo polje je obavezno'}}
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={value}
                onChange={onChange}
                options={organizationUnits}
                label="ORGANIZACIONA JEDINICA:"
                error={errors.organization_unit?.message as string}
              />
            )}
          />
          <div style={{marginBlock: '10px'}}>
            <Controller
              name="counts"
              rules={{required: 'Ovo polje je obavezno'}}
              control={control}
              render={({field: {name, value, onChange}}) => (
                <Dropdown
                  name={name}
                  value={value}
                  onChange={onChange}
                  options={dropdowncountsOptions}
                  label="KONTO:"
                  error={errors.counts?.message as string}
                />
              )}
            />
          </div>
          <div>
            {/*TO DO add reqister and logic  */}
            <Input label="NEDOSTAJUĆI IZNOS:" />
          </div>
        </div>
      }
    />
  );
};
