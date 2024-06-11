import {GetResponse, InsertResponse} from './response';

export type GetFundReleaseParams = {
  year: number;
  month?: number;
  budget_id?: number;
  unit_id?: number;
};

export type GetFundReleaseDetailsParams = {
  month?: number;
  year?: number;
};

export type FundReleaseItem = {
  month: number;
  year: number;
  value: number;
};

export type GetFundReleaseResponse = {spendingRelease_Overview: GetResponse<FundReleaseItem>};

export type GetFundReleaseDetailsResponse = {spendingRelease_Get: GetResponse<FundReleaseDetailsItem>};

export type InsertFundReleaseData = {
  budget_id: number | null;
  unit_id: number | null;
  account_id: number;
  value: number;
  month: number;
};

export type InsertFundReleaseResponse = {spendingRelease_Insert: InsertResponse<FundReleaseItem>};

export type FundReleaseDetailsItem = {
  budget_id: number;
  unit_id: number;
  account_id: number;
  account_serial_number: string;
  account_title: string;
  current_budget_id: number;
  value: number;
  month: number;
  planned: number;
  children: FundReleaseDetailsItem[] | null;
};
