import {DropdownData} from '../dropdownData.ts';
import {FileItem} from '../fileUploadType.ts';
import {ReallocationStatusEnum} from '../../constants.ts';

export interface ExternalReallocationsOverviewParams {
  id?: number;
  page?: number;
  size?: number;
  organization_unit_id?: number;
  source_organization_unit_id?: number;
  destination_organization_unit_id?: number;
  status?: string;
  requested_by?: number;
  budget_id?: number;
}

export interface ReallocationItemDetail {
  id: number;
  source_account: DropdownData<number>;
  destination_account: DropdownData<number>;
  amount: string;
}

export interface ReallocationItem {
  id: number;
  title: string;
  status: ReallocationStatusEnum;
  source_organization_unit: DropdownData<number>;
  destination_organization_unit: DropdownData<number>;
  date_of_request: string;
  date_of_action_dest_org_unit: string;
  date_of_action_sss: string;
  requested_by: DropdownData<number>;
  accepted_by: DropdownData<number>;
  budget: DropdownData<number>;
  file: FileItem;
  destination_org_unit_file: FileItem;
  sss_file: FileItem;
  items: ReallocationItemDetail[];
}

export interface ReallocationItemForm {
  destination_account_id: number;
  amount: string;
}

export interface InsertExternalReallocationsFormData {
  source_organization_unit_id: number;
  destination_organization_unit_id: number;
  budget_id: number;
  items: ReallocationItemForm[];
}

export interface AcceptExternalReallocationsFormData {
  id: number;
  items: ReallocationItemForm[];
}
