import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error", // Or "warn" to turn it into a warning
        { "varsIgnorePattern": "^_", "argsIgnorePattern": "^_" }, // Allow unused variables starting with `_`
      ],
      "@typescript-eslint/no-explicit-any": "off", // Disable the rule for `any`
      "react/react-in-jsx-scope": "off", // Disable for Next.js (React is globally available)
    },
  },
];

export default eslintConfig;
