// Logos for the tech named in work stacks (content/work/*.md). Every file in public/logos is the brand's own
// artwork, downloaded from the source listed. Edits are limited to cropping a mark out of a lockup, noted inline.
// `dark` is the brand's variant for dark backgrounds; `invert` is for single-colour black marks with no white file.
// A stack name missing here still renders, as text only.
type Tech = { logo: string; dark?: string; invert?: boolean; source: string };

export const tech: Record<string, Tech> = {
  "Next.js": {
    logo: "/logos/nextjs.svg",
    dark: "/logos/nextjs-dark.svg",
    source: "https://vercel.com/geist/brands",
  },
  TypeScript: { logo: "/logos/typescript.svg", source: "https://www.typescriptlang.org/branding/" },
  Drizzle: {
    // mark cropped from the logo lockup in the drizzle-orm README
    logo: "/logos/drizzle.svg",
    dark: "/logos/drizzle-dark.svg",
    source: "https://github.com/drizzle-team/drizzle-orm/tree/main/misc/readme",
  },
  "Neon Postgres": { logo: "/logos/neon.svg", dark: "/logos/neon-dark.svg", source: "https://neon.com/brand" },
  "Cloudflare R2": {
    logo: "/logos/cloudflare.svg",
    source: "https://github.com/cloudflare/cloudflare-docs/blob/production/src/assets/images/workers-ai/cloudflare.svg",
  },
  "WhatsApp Cloud API": { logo: "/logos/whatsapp.svg", source: "https://whatsappbrand.com/" },
  React: {
    logo: "/logos/react.svg",
    dark: "/logos/react-dark.svg",
    source: "https://github.com/reactjs/react.dev/tree/main/public/images/brand",
  },
  "React Native": {
    logo: "/logos/react.svg",
    dark: "/logos/react-dark.svg",
    source: "https://github.com/reactjs/react.dev/tree/main/public/images/brand",
  },
  Expo: { logo: "/logos/expo.svg", invert: true, source: "https://github.com/expo/logos" },
  Python: { logo: "/logos/python.svg", source: "https://github.com/python/cpython/blob/main/PC/icons/logo.svg" },
  PySpark: {
    // the star only, cut from the Spark logo on spark.apache.org
    logo: "/logos/spark.svg",
    source: "https://github.com/apache/spark-website/blob/asf-site/images/spark-logo-rev.svg",
  },
  "AWS Glue": { logo: "/logos/aws-glue.svg", source: "https://aws.amazon.com/architecture/icons/" },
  "Step Functions": { logo: "/logos/aws-step-functions.svg", source: "https://aws.amazon.com/architecture/icons/" },
  // QuickSight now ships inside Amazon Quick, so AWS's icon set only has the Quick icon.
  QuickSight: { logo: "/logos/amazon-quick.svg", source: "https://aws.amazon.com/architecture/icons/" },
  Prisma: {
    // press-kit mark, minus the white square it ships on
    logo: "/logos/prisma.svg",
    source: "https://github.com/prisma/presskit",
  },
  "Tailwind CSS": { logo: "/logos/tailwindcss.svg", source: "https://tailwindcss.com/brand" },
  Go: { logo: "/logos/go.svg", source: "https://go.dev/blog/go-brand" },
  "Spring Boot": { logo: "/logos/spring-boot.svg", source: "https://spring.io/projects/spring-boot" },
  PostgreSQL: { logo: "/logos/postgresql.svg", source: "https://wiki.postgresql.org/wiki/Logo" },
  Flutter: { logo: "/logos/flutter.svg", source: "https://docs.flutter.dev/brand" },
  Dart: { logo: "/logos/dart.svg", source: "https://docs.flutter.dev/brand" },
  TensorFlow: {
    // mark cropped from the lockup in tensorflow.org's header
    logo: "/logos/tensorflow.svg",
    source: "https://www.tensorflow.org/",
  },
};
