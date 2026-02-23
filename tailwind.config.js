/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Radix Slate Scale
        slate: {
          1: "var(--slate-1)",
          2: "var(--slate-2)",
          3: "var(--slate-3)",
          4: "var(--slate-4)",
          5: "var(--slate-5)",
          6: "var(--slate-6)",
          7: "var(--slate-7)",
          8: "var(--slate-8)",
          9: "var(--slate-9)",
          10: "var(--slate-10)",
          11: "var(--slate-11)",
          12: "var(--slate-12)",
        },
        // Radix Indigo Scale
        indigo: {
          1: "var(--indigo-1)",
          2: "var(--indigo-2)",
          3: "var(--indigo-3)",
          4: "var(--indigo-4)",
          5: "var(--indigo-5)",
          6: "var(--indigo-6)",
          7: "var(--indigo-7)",
          8: "var(--indigo-8)",
          9: "var(--indigo-9)",
          10: "var(--indigo-10)",
          11: "var(--indigo-11)",
          12: "var(--indigo-12)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: [
          "Noto Sans SC",
          "PingFang SC",
          "Microsoft YaHei",
          "system-ui",
          "sans-serif",
        ],
        serif: [
          "Noto Serif SC",
          "PingFang SC",
          "Microsoft YaHei",
          "Georgia",
          "serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      spacing: {
        1: "var(--space-1)",
        2: "var(--space-2)",
        3: "var(--space-3)",
        4: "var(--space-4)",
        5: "var(--space-5)",
        6: "var(--space-6)",
        7: "var(--space-7)",
        8: "var(--space-8)",
        9: "var(--space-9)",
      },
      fontSize: {
        xs: ["var(--font-size-1)", { lineHeight: "1.4" }],
        sm: ["var(--font-size-2)", { lineHeight: "1.5" }],
        base: ["var(--font-size-3)", { lineHeight: "1.6" }],
        lg: ["var(--font-size-4)", { lineHeight: "1.5" }],
        xl: ["var(--font-size-5)", { lineHeight: "1.4" }],
        "2xl": ["var(--font-size-6)", { lineHeight: "1.3" }],
        "3xl": ["var(--font-size-7)", { lineHeight: "1.2" }],
        "4xl": ["var(--font-size-8)", { lineHeight: "1.1" }],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
