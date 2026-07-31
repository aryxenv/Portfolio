export interface Social {
  name: string;
  url: string;
  /** Boxicons class pair. */
  icon: string;
  bgClass: string;
}

export const socials: Social[] = [
  {
    name: "Github",
    url: "https://github.com/aryxenv/",
    icon: "bx bxl-github",
    bgClass: "github-background",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/aryxenv/",
    icon: "bx bxl-linkedin",
    bgClass: "linkedin-background",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/aryxenv/",
    icon: "bx bxl-instagram",
    bgClass: "instagram-background",
  },
  {
    name: "E-mail",
    url: "mailto:aryanshah0514@gmail.com",
    icon: "bx bx-envelope",
    bgClass: "email-background",
  },
];
