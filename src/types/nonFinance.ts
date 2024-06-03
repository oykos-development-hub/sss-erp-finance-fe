// This file contains types for non-financial form that manager sends to SSS

export interface NonFinancialForm {
  id: number;
  request_id: number;
  impl_contact_fullname: string;
  impl_contact_working_place: string;
  impl_contact_phone: string;
  impl_contact_email: string;
  contact_fullname: string;
  contact_working_place: string;
  contact_phone: string;
  contact_email: string;
  statement: string;
  goals: Goal[];
}

export interface Goal {
  id?: number;
  title: string;
  description: string;
  indicators: Indicator[];
  original_id?: number;
}

export interface Indicator {
  id?: number;
  performance_indicator_code?: string;
  indicator_source?: string;
  base_year?: string;
  gender_equality?: string;
  base_value?: string;
  source_of_information?: string;
  unit_of_measure?: string;
  indicator_description?: string;
  planned_value_1?: string;
  revised_value_1?: string;
  achieved_value_1?: string;
  planned_value_2?: string;
  revised_value_2?: string;
  achieved_value_2?: string;
  planned_value_3?: string;
  revised_value_3?: string;
  achieved_value_3?: string;
  original_id?: number;
}
