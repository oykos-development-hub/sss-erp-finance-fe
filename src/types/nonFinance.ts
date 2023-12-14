export interface NonFinanceForm {
  id: number;
  // name_of_organization_unit: string;
  // organization_code: string;
  // mission_statement: string;
  person_responsible_name_surname: string;
  person_responsible_working_place: string;
  person_responsible_telephone_number: string;
  person_responsible_email: string;
  contact_person_name_surname: string;
  contact_person_working_place: string;
  contact_person_telephone_number: string;
  contact_person_email: string;
  request_id?: number;
  // program: {
  //   id: number;
  //   description: string;
  //   title: string;
  //   code: string;
  //   goals: {
  //     id: number;
  //     description: string;
  //     title: string;
  //   }[];
  // };
  // subprogram: {
  //   id: number;
  //   description: string;
  //   title: string;
  //   code: string;
  //   goals: {
  //     id: number;
  //     description: string;
  //     title: string;
  //   }[];
  // };
  // activity: {
  //   id: number;
  //   description: string;
  //   title: string;
  //   code: string;
  //   goals: {
  //     id: number;
  //     description: string;
  //     title: string;
  //   }[];
  // };
}

export interface ProgramGoal {
  id: number;
  budget_program_id: number;
  title: string;
  description: string;
}
