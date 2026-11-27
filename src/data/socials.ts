export const OFFICIAL_SOCIALS = {
  karmariseLinkedIn: "https://www.linkedin.com/company/karmarise-d-global/",
  karmariseInstagram: "https://www.instagram.com/karmarisedglobal/",
  almariseInstagram: "https://www.instagram.com/almarisedbrand/",
  almaLinkedIn: "https://www.linkedin.com/in/almudenahernandezmdi/",
  shirishLinkedIn:
    "https://www.linkedin.com/in/adv-shirish-santoshi-shivaji-molawade-4847a13b7/",
} as const;

export const ALLOWED_SOCIAL_URLS: readonly string[] =
  Object.values(OFFICIAL_SOCIALS);
