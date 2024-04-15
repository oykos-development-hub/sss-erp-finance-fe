export interface GetResponse<T> {
  status: string;
  message: string;
  total?: number;
  items: T[];
}

export interface OrganizationUnit {
  id: number;
  parent_id: number;
  number_of_judges: number;
  title: string;
  abbreviation: string;
  description?: string;
  address?: string;
  color: string;
  folder_id: number;
  icon: string;
  children?: any;
}

export type GetOrganizationUnitsParams = {
  id?: number;
  page?: number;
  size?: number;
  search?: string;
};

export type GetOrganizationUnitsOptions = {
  allOption?: boolean;
};

export type OrganizationUnitsResponse = {
  get: {
    organizationUnits: GetResponse<OrganizationUnit>;
  };
};
