import { StateWithAsyncSlices } from "zustand-async-slices";
import { googleProfile } from "./asyncMethods/googleProfile";
import { googleSignIn } from "./asyncMethods/googleSignIn";
import { googleSignOut } from "./asyncMethods/googleSignOut";
import { googleTokenClient } from "./asyncMethods/googleTokenClient";
import { monoClientInfo, Account } from "./asyncMethods/monoClientInfo";
import { monoStatements } from "./asyncMethods/monoStatements";
import { writeMonoStatementsToGoogleSheet } from "./asyncMethods/writeMonoStatementsToGoogleSheet";

export const asyncMethods = {
  monoStatements,
  monoClientInfo,
  googleTokenClient,
  googleSignIn,
  googleSignOut,
  googleProfile,
  writeMonoStatementsToGoogleSheet,
};

export type Store = StateWithAsyncSlices<
  {
    monthIndex?: number;
    setMonthIndex(monthIndex: number): void;
    year?: number;
    setYear(year: number): void;
    sheet?: {
      id: string;
      name: string;
    };
    setSheet(sheet: Store["sheet"]): void;
    monoAccountId?: string;
    setAccountMonoAccountId(accountId: string): void;
    getMonoAccount(): Account;
    monoAuthToken?: string;
    getMonoAuthToken(): string;
    setMonoAuthToken(monoAuthToken: string): void;
    googleTokens: GoogleApiOAuth2TokenObject | null;
    setGoogleTokens(googleTokens: GoogleApiOAuth2TokenObject | null): void;
  },
  typeof asyncMethods
>;
