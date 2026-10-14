export const project = {
  id: 3,
  slug: "data-quality",
  title: "CleanSheet \u2014 CSV Quality Auditor",
  subtitle: "Data quality and preparation",
  description:
    "Upload a CSV, find missing values, invalid emails, and duplicate IDs, then export a cleaned dataset with a row-level audit report. All processing stays in your browser.",
  category: "Data Analysis",
  tech: ["JavaScript", "CSV Parsing", "Validation", "Data Cleaning"],
  problem:
    "Messy records undermine reports and create avoidable operational rework.",
  approach:
    "A repeatable audit normalizes whitespace and email casing, checks required fields, and excludes invalid rows and subsequent duplicate IDs.",
  features: [
    "Load sample data or upload a CSV",
    "See row-specific issues and quality metrics",
    "Compare source records with accepted clean rows",
    "Download clean records and an audit report",
  ],
  limitations:
    "Validation follows the documented four-column schema and practical email checks. Invalid rows are excluded rather than guessed or imputed. Maximum 2,000 rows / 1 MB per upload.",
  image: "/projects/data-quality.svg",
  link: "/projects/data-quality",
  year: "Portfolio demo",
  github: null,
};
