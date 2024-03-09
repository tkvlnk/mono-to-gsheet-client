import { LocalStorageCache } from "../../utils/LocalStorageCache";

export const authCache = new LocalStorageCache<GoogleApiOAuth2TokenObject>(
  "google-auth"
);
