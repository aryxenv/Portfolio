import azure from "../assets/logos/azure.svg";
import azureai from "../assets/logos/azureai.svg";
import mlstudio from "../assets/logos/mlstudio.svg";
import numpy from "../assets/logos/numpy.png";

/**
 * The tech-stack registry.
 *
 * One entry per technology, referenced by key from both the About categories
 * and the two Home marquees. This replaces three separate files that described
 * the same technologies with drifting names, colours and icons.
 *
 * `hex` is the hover glow behind the logo tile. `src` is the logo — most are
 * hot-linked from icons8; the Microsoft marks are local because icons8 has no
 * equivalent.
 */
export interface Tech {
  name: string;
  hex: string;
  src: string;
  alt: string;
}

export const TECH = {
  typescript: {
    name: "TypeScript",
    hex: "#007acc",
    src: "https://img.icons8.com/ios/50/typescript.png",
    alt: "typescript",
  },
  javascript: {
    name: "JavaScript",
    hex: "#F0DB4F",
    src: "https://img.icons8.com/ios/50/javascript--v1.png",
    alt: "javascript",
  },
  python: {
    name: "Python",
    hex: "#4B8BBE",
    src: "https://img.icons8.com/ios/50/python--v1.png",
    alt: "python",
  },
  csharp: {
    name: "C#",
    hex: "#68217A",
    src: "https://img.icons8.com/ios/50/c-sharp-logo.png",
    alt: "c-sharp",
  },
  sql: {
    name: "SQL",
    hex: "#00758F",
    src: "https://img.icons8.com/ios/50/sql.png",
    alt: "sql",
  },

  azure: {
    name: "Azure",
    hex: "#0078D4",
    src: azure.src,
    alt: "azure",
  },
  aifoundry: {
    name: "AI Foundry",
    hex: "#5100ff",
    src: azureai.src,
    alt: "ai-foundry",
  },
  azureaisearch: {
    name: "Azure AI Search",
    hex: "#0078D4",
    src: azureai.src,
    alt: "azure-ai-search",
  },
  mlstudio: {
    name: "ML Studio",
    hex: "#0078D4",
    src: mlstudio.src,
    alt: "ml-studio",
  },
  aws: {
    name: "AWS",
    hex: "#FF9900",
    src: "https://img.icons8.com/material-outlined/48/amazon-web-services.png",
    alt: "aws",
  },
  gcp: {
    name: "GCP",
    hex: "#4285F4",
    src: "https://img.icons8.com/ios-filled/50/google-cloud-platform.png",
    alt: "gcp",
  },
  cloudflare: {
    name: "Cloudflare",
    hex: "#F38020",
    src: "https://img.icons8.com/ios-filled/50/cloudflare.png",
    alt: "cloudflare",
  },
  vercel: {
    name: "Vercel",
    hex: "#000000",
    src: "https://img.icons8.com/ios-filled/50/vercel.png",
    alt: "vercel",
  },
  render: {
    name: "Render",
    hex: "#323232",
    src: "https://img.icons8.com/ios-filled/50/cloud-refresh--v1.png",
    alt: "render",
  },
  supabase: {
    name: "Supabase",
    hex: "#3ECF8E",
    src: "https://img.icons8.com/fluency-systems-filled/48/supabase.png",
    alt: "supabase",
  },
  combell: {
    name: "Combell",
    hex: "#0080ff",
    src: "https://img.icons8.com/ios-filled/50/virtual-machine2.png",
    alt: "combell",
  },

  react: {
    name: "React",
    hex: "#61DBFB",
    src: "https://img.icons8.com/ios/50/react-native--v1.png",
    alt: "react",
  },
  html: {
    name: "HTML",
    hex: "#F06529",
    src: "https://img.icons8.com/ios/50/html-5--v2.png",
    alt: "html",
  },
  css: {
    name: "CSS",
    hex: "#3C99DC",
    src: "https://img.icons8.com/ios/50/css3.png",
    alt: "css",
  },
  figma: {
    name: "Figma",
    hex: "#FD3D39",
    src: "https://img.icons8.com/ios/50/figma.png",
    alt: "figma",
  },
  xaml: {
    name: "XAML",
    hex: "#0C54C2",
    src: "https://img.icons8.com/ios/50/close-window--v1.png",
    alt: "xaml",
  },

  nodejs: {
    name: "NodeJS",
    hex: "#3c873a",
    src: "https://img.icons8.com/windows/50/node-js.png",
    alt: "nodejs",
  },
  expressjs: {
    name: "Express.js",
    hex: "#000",
    src: "https://img.icons8.com/ios/50/express-js.png",
    alt: "expressjs",
  },
  fastapi: {
    name: "FastAPI",
    hex: "#009e99",
    src: "https://img.icons8.com/ios/50/dryclean-with-petroleum-solvent-only.png",
    alt: "fastapi",
  },
  netwpf: {
    name: "WPF (.NET)",
    hex: "#68217A",
    src: "https://img.icons8.com/ios/50/cs.png",
    alt: "wpfnet",
  },
  groq: {
    name: "Groq API",
    hex: "#F55036",
    src: "https://img.icons8.com/ios/50/circled-g.png",
    alt: "groq-api",
  },

  numpy: {
    name: "NumPy",
    hex: "#00ACC1",
    src: numpy.src,
    alt: "numpy",
  },
  scikit: {
    name: "SciKit-Learn",
    hex: "#F7931E",
    src: "https://img.icons8.com/ios/50/machine-learning.png",
    alt: "scikit-learn",
  },
  matplotlib: {
    name: "Matplotlib",
    hex: "#11557C",
    src: "https://img.icons8.com/ios/50/graph--v1.png",
    alt: "matplotlib",
  },
  chromadb: {
    name: "ChromaDB",
    hex: "#327EFF",
    src: "https://img.icons8.com/ios/50/vector.png",
    alt: "chromadb",
  },
  postgresql: {
    name: "PostgreSQL",
    hex: "#0064a5",
    src: "https://img.icons8.com/ios/50/postgreesql.png",
    alt: "postgresql",
  },
  mysql: {
    name: "MySQL",
    hex: "#00758F",
    src: "https://img.icons8.com/ios/50/mysql-logo.png",
    alt: "mysql",
  },
  agentframework: {
    name: "Agent Framework",
    hex: "#5100ff",
    src: azureai.src,
    alt: "agent-framework",
  },
  mcp: {
    name: "MCP",
    hex: "#6f42c1",
    src: "https://img.icons8.com/ios/50/api-settings.png",
    alt: "mcp",
  },
  powerbi: {
    name: "PowerBI",
    hex: "#f2c80f",
    src: "https://img.icons8.com/ios/50/power-bi.png",
    alt: "power-bi",
  },

  docker: {
    name: "Docker",
    hex: "#1D63ED",
    src: "https://img.icons8.com/ios/50/docker.png",
    alt: "docker",
  },
  gitgithub: {
    name: "Git / GitHub",
    hex: "#F05133",
    src: "https://img.icons8.com/ios/50/git.png",
    alt: "git-github",
  },
  githubcopilot: {
    name: "GitHub Copilot / CLI",
    hex: "#595959",
    src: "https://img.icons8.com/ios/50/github.png",
    alt: "github-copilot-cli",
  },
  bicep: {
    name: "Bicep / IaC",
    hex: "#0078D4",
    src: azure.src,
    alt: "bicep-iac",
  },
  kubernetes: {
    name: "Kubernetes / AKS",
    hex: "#326CE5",
    src: "https://img.icons8.com/ios/50/kubernetes.png",
    alt: "kubernetes-aks",
  },
  visualstudio: {
    name: "Visual Studio",
    hex: "#A075D4",
    src: "https://img.icons8.com/ios/50/visual-studio.png",
    alt: "visual-studio",
  },
  vscode: {
    name: "Visual Studio Code",
    hex: "#0074C8",
    src: "https://img.icons8.com/ios/50/visual-studio.png",
    alt: "visual-studio-code",
  },
  ldap: {
    name: "LLDAP",
    hex: "#e375ff",
    src: "https://img.icons8.com/ios/50/active-directory.png",
    alt: "lldap",
  },
} as const satisfies Record<string, Tech>;

export type TechKey = keyof typeof TECH;

/** The About section's category switcher, in display order. */
export const TECH_CATEGORIES: readonly {
  title: string;
  items: readonly TechKey[];
}[] = [
  {
    title: "Languages",
    items: ["typescript", "javascript", "python", "csharp", "sql"],
  },
  {
    title: "Cloud",
    items: [
      "azure",
      "aifoundry",
      "azureaisearch",
      "mlstudio",
      "aws",
      "gcp",
      "cloudflare",
      "vercel",
      "render",
      "supabase",
      "combell",
    ],
  },
  {
    title: "Frontend",
    items: ["react", "html", "css", "figma", "xaml"],
  },
  {
    title: "Backend & APIs",
    items: ["nodejs", "expressjs", "fastapi", "netwpf", "groq"],
  },
  {
    title: "Data & AI/ML",
    items: [
      "numpy",
      "scikit",
      "matplotlib",
      "chromadb",
      "postgresql",
      "mysql",
      "groq",
      "agentframework",
      "mcp",
      "powerbi",
    ],
  },
  {
    title: "DevOps & Tools",
    items: [
      "docker",
      "gitgithub",
      "githubcopilot",
      "bicep",
      "kubernetes",
      "visualstudio",
      "vscode",
      "ldap",
    ],
  },
];

/** The two Home marquees. Top scrolls left, bottom scrolls right. */
export const MARQUEE_TOP: readonly TechKey[] = [
  "csharp",
  "typescript",
  "javascript",
  "python",
  "react",
  "html",
  "css",
  "expressjs",
  "fastapi",
  "figma",
  "netwpf",
  "azure",
  "aifoundry",
  "azureaisearch",
  "mlstudio",
  "aws",
  "gcp",
  "githubcopilot",
];

export const MARQUEE_BOTTOM: readonly TechKey[] = [
  "numpy",
  "scikit",
  "matplotlib",
  "postgresql",
  "mysql",
  "chromadb",
  "docker",
  "gitgithub",
  "bicep",
  "kubernetes",
  "mcp",
  "powerbi",
  "visualstudio",
  "vscode",
  "ldap",
  "cloudflare",
  "vercel",
  "render",
  "supabase",
  "combell",
];
