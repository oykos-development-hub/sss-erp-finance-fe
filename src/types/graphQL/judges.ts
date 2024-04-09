import {DropdownData} from '../dropdownData';
import {GetResponse} from './response.ts';

export interface RelocationNorm {
  id: number;
  absent_type: DropdownData<number>;
  date_of_end: string;
  date_of_start: string;
  location: string;
}

export interface EvaluationNorm {
  id: number;
  date_of_evaluation: string;
  evaluation_type: DropdownData<number>;
  evaluator: string;
  is_relevant: boolean;
  score: string;
}

export interface JudgeNorm {
  id: number;
  title: string;
  user_profile_id: number;
  topic: string;
  number_of_norm_decrease: number;
  number_of_items: number;
  number_of_items_solved: number;
  evaluation?: EvaluationNorm;
  date_of_evaluation?: string;
  date_of_evaluation_validity?: string;
  relocation?: RelocationNorm;
  relocation_id: number;
  relocation_title?: string;
  full_name?: string;
  file_id?: number;
  evaluation_id?: number | null;
}
export interface Judge {
  id: number;
  organization_unit: DropdownData<string> | undefined;
  job_position: DropdownData<string> | undefined;
  is_judge_president: boolean;
  first_name: string;
  last_name: string;
  evaluation: string;
  created_at: string;
  updated_at: string;
  folder_id: number;
  full_name?: string;
  relocation?: string;
  norms: JudgeNorm[];
}

export interface JudgesOverviewQueryParams {
  organization_unit?: DropdownData<number> | null;
  user_profile?: DropdownData<number> | null;
  page?: number;
  size?: number;
  search?: string;
}

export interface JudgeResolutionsItem {
  id: number;
  organization_unit_id: number;
  number_of_judges: number;
  number_of_presidents: number;
}

export type JudgesResponse = {
  judges_Overview: GetResponse<Judge>;
};
