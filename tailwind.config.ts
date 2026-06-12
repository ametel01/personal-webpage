const config = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--color-text)",
        muted: "var(--color-text-muted)",
        accent: "var(--color-accent)"
      },
      boxShadow: {
        card: "var(--shadow-card)"
      }
    }
  }
};

export default config;
