import { GitHub, generateState } from "arctic";
import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

type OAuthEnv = {
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
  ALLOWED_DOMAINS?: string;
};

const PROVIDER = "github";
const COOKIE_NAME = "csrf-token";
const COOKIE_PATH = "/admin";
const CALLBACK_PATH = "/admin/callback";
const SCOPES = ["public_repo"];

const oauthEnv = env as OAuthEnv;

const getAllowedDomains = () =>
  (oauthEnv.ALLOWED_DOMAINS ?? "")
    .split(",")
    .map((domain) => domain.trim())
    .filter(Boolean);

const isAllowedDomain = (domain: string | null) =>
  !!domain && getAllowedDomains().includes(domain);

const redirectToCallbackError = (
  request: Request,
  {
    provider = "unknown",
    error,
    errorCode,
  }: {
    provider?: string;
    error: string;
    errorCode: string;
  },
) => {
  const callbackURL = new URL(CALLBACK_PATH, request.url);
  callbackURL.searchParams.set("provider", provider);
  callbackURL.searchParams.set("error", error);
  callbackURL.searchParams.set("error_code", errorCode);

  return new Response(null, {
    status: 302,
    headers: {
      Location: callbackURL.toString(),
    },
  });
};

const getGitHubClient = (request: Request) => {
  const { GITHUB_CLIENT_ID: clientId, GITHUB_CLIENT_SECRET: clientSecret } =
    oauthEnv;

  if (!clientId || !clientSecret) {
    return null;
  }

  return new GitHub(
    clientId,
    clientSecret,
    new URL(CALLBACK_PATH, request.url).toString(),
  );
};

export const GET: APIRoute = ({ request }) => {
  const url = new URL(request.url);
  const provider = url.searchParams.get("provider");
  const siteId = url.searchParams.get("site_id");

  if (provider !== PROVIDER) {
    return redirectToCallbackError(request, {
      error: "Your Git backend is not supported by the authenticator.",
      errorCode: "UNSUPPORTED_BACKEND",
    });
  }

  if (!isAllowedDomain(siteId)) {
    return redirectToCallbackError(request, {
      provider,
      error: "Your domain is not allowed to use the authenticator.",
      errorCode: "UNSUPPORTED_DOMAIN",
    });
  }

  const github = getGitHubClient(request);
  if (!github) {
    return redirectToCallbackError(request, {
      provider,
      error: "OAuth app client ID or secret is not configured.",
      errorCode: "MISCONFIGURED_CLIENT",
    });
  }

  const state = generateState();
  const authorizationURL = github.createAuthorizationURL(state, SCOPES);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorizationURL.toString(),
      "Set-Cookie":
        `${COOKIE_NAME}=${provider}_${state}; ` +
        `HttpOnly; Path=${COOKIE_PATH}; Max-Age=600; SameSite=Lax; Secure`,
    },
  });
};
