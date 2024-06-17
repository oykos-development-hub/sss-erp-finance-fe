import {GetResponse, InsertResponse, SimpleResponse} from '../../../types/graphQL/response.ts';

export type InternalReallocationResponse = {
  get: {
    internalReallocations_Overview: GetResponse<any>;
  };
  insert: {
    internalReallocations_Insert: InsertResponse<any>;
  };
  delete: {
    internalReallocations_Delete: SimpleResponse;
  };
};
