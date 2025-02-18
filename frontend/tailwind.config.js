/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: "Inter, monospace",
    },
    extend: {
      filter: {
        "custom-ribbon":
          "brightness(0) saturate(100%) invert(48%) sepia(81%) saturate(427%) hue-rotate(338deg) brightness(93%) contrast(91%)",
      },
      screens: {
        "4xl": "1920px",
        "3xl": "1600px",
        "2md": "950px",
        ls: "500px",
      },
      fontSize: {
        "2xs": ["0.55rem", "0.4rem"],
      },
      boxShadow: {
        haze: "0px 24px 61px -14px rgba(15, 151, 181, 0.14)",
        question: "0px 4px 8px 0px rgba(10, 58, 100, 0.15)", // Equivalent to #0A3A6426
      },
      colors: {
        main: "#12CCF4",
        "main-10": "#12CCF41A",
        "acc-02": "#CF7D4E0D",
        acc: "#CF7D4E",
        "blue-2": "#0F97B5",
        "blue-20": "#24BEE033",
        "blue-input-bg": "#026aa21a",
        blk: "#062126",
        "lgt-1": "#F7FCFD",
        "lgt-2": "#12CCF41A",
        "wht-30": "#FFFFFF33",
        "blk-60": "#06212699",
        "blk-40": "#06212666",
        "blk-70": "#062126B2",
        "blk-80": "#062126CC",
        "black-10": "#0000001A",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      fontFamily: {
        aoboshi: "Aoboshi One, monospace",
        cracovia: "Architects Daughter, monospace",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  variants: {
    filter: ["responsive", "hover", "focus"], // Allow variants like hover or focus
  },
  // eslint-disable-next-line
  plugins: [require("tailwindcss-animate")],
};
