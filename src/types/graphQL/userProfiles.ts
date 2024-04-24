import {DropdownData} from '../dropdownData.ts';

export interface UserProfileParams {
  page: number;
  size: number;
  id?: number;
  is_active?: boolean;
  organization_unit_id?: number;
  job_position_id?: number;
  name?: string;
}

export interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  email: string;
  phone: string;
  active: boolean;
  is_judge: boolean;
  is_judge_president: boolean;
  role: DropdownData<number>;
  organization_unit: DropdownData<number>;
  job_position: DropdownData<number>;
  department: DropdownData<number>;
  created_at: string;
  updated_at: string;
}

export type UserProfileResponse = {
  userProfiles_Overview: {
    items: UserProfile[];
    message: string;
    status: string;
    total: number;
  };
};

interface PaginationProps {
  page: number;
  size: number;
}
export interface UserProfileOverviewParams extends PaginationProps {
  id?: number;
  name?: string;
  is_active?: DropdownData<boolean> | null;
  organization_unit_id?: DropdownData<number> | null;
  job_position_id?: DropdownData<number> | null;
  type?: DropdownData<number> | null;
}
