import {GetResponse, InsertResponse, SimpleResponse} from './response';

export interface GeneralSettings {
  id: number;
  title: string;
  abbreviation?: string;
  color?: string;
  icon?: string;
  entity: string;
  value?: string;
  parent_id?: number | null;
}
export type GeneraSettingsForm = Omit<GeneralSettings, 'id'> & {id: number | null};

export interface GeneralSettingsResponse {
  get: {
    settingsDropdown_Overview: GetResponse<GeneralSettings>;
  };
  insert: {
    settingsDropdown_Insert: InsertResponse<GeneralSettings>;
  };
  delete: {
    settingsDropdown_Delete: SimpleResponse;
  };
}
