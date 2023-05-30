import type { APIError } from "app/base/types";

export type StatusState = {
  authenticated: boolean;
  authenticating: boolean;
  authenticationError: APIError;
  connected: boolean;
  connecting: boolean;
  error: APIError;
  externalAuthURL: string | null;
  externalLoginURL: string | null;
  oidcAuthURL: string | null;
  noUsers: boolean;
};
