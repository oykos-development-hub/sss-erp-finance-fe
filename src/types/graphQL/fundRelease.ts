import {GetResponse, InsertResponse} from './response';

export type GetFundReleaseParams = {
  year: number;
  month?: number;
  budget_id?: number;
  unit_id?: number;
};
export type FundReleaseItem = {
  month: number;
  year: number;
  value: number;
};

export type GetFundReleaseResponse = {spendingRelease_Overview: GetResponse<FundReleaseItem>};

export type InsertFundReleaseData = {
  budget_id: number | null;
  unit_id: number | null;
  account_id: number;
  value: number;
  month: number;
};

export type InsertFundReleaseResponse = {spendingRelease_Insert: InsertResponse<FundReleaseItem>};
