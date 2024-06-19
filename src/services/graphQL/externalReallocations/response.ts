import {GetResponse, InsertResponse, SimpleResponse} from '../../../types/graphQL/response.ts';
import {ReallocationItem} from '../../../types/graphQL/externalReallocations.ts';

export type ExternalReallocationResponse = {
  get: {
    externalReallocations_Overview: GetResponse<ReallocationItem>;
  };
  insert: {
    externalReallocations_Insert: InsertResponse<ReallocationItem>;
  };
  delete: {
    externalReallocations_Delete: SimpleResponse;
  };
  acceptOU: {
    externalReallocationsOU_Accept: InsertResponse<ReallocationItem>;
  };
  rejectOU: {
    externalReallocationsOU_Reject: SimpleResponse;
  };
  acceptSSS: {
    externalReallocationsSSS_Accept: SimpleResponse;
  };
  rejectSSS: {
    externalReallocationsSSS_Reject: SimpleResponse;
  };
};
