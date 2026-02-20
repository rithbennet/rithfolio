/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly SITE_URL: string;
  readonly EMAIL_USER: string;
  readonly EMAIL_PASS: string;
  readonly EMAIL_RECIPIENT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
