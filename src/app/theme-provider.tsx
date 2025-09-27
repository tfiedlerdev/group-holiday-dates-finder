"use client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    // Beautiful indigo primary color - sophisticated and modern
    primary: {
      main: "#6366f1", // Indigo 500 - more vibrant than blue
      dark: "#4f46e5", // Indigo 600
      light: "#818cf8", // Indigo 400
      contrastText: "#ffffff",
    },
    // Elegant purple secondary - complements indigo beautifully
    secondary: {
      main: "#8b5cf6", // Violet 500
      dark: "#7c3aed", // Violet 600
      light: "#a78bfa", // Violet 400
      contrastText: "#ffffff",
    },
    // Rich dark backgrounds with subtle warmth
    background: {
      default: "#0f172a", // Slate 900 - deeper, more sophisticated
      paper: "#1e293b", // Slate 800 - warmer than gray
    },
    // Refined text colors with better contrast
    text: {
      primary: "#f8fafc", // Slate 50 - pure white with subtle warmth
      secondary: "#cbd5e1", // Slate 300 - softer secondary text
    },
    // Beautiful Material UI colors for status
    error: {
      main: "#ef4444", // Red 500 - vibrant error color
      light: "#fca5a5", // Red 300
      dark: "#dc2626", // Red 600
      contrastText: "#ffffff",
    },
    warning: {
      main: "#f59e0b", // Amber 500 - warm warning color
      light: "#fcd34d", // Amber 300
      dark: "#d97706", // Amber 600
      contrastText: "#ffffff",
    },
    success: {
      main: "#10b981", // Emerald 500 - fresh success color
      light: "#6ee7b7", // Emerald 300
      dark: "#059669", // Emerald 600
      contrastText: "#ffffff",
    },
    // Additional Material UI colors for enhanced palette
    info: {
      main: "#06b6d4", // Cyan 500 - beautiful info color
      light: "#67e8f9", // Cyan 300
      dark: "#0891b2", // Cyan 600
      contrastText: "#ffffff",
    },
  },
  typography: {
    fontFamily: [
      "var(--font-geist-sans)",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 8,
  },
  components: {
    // Global styles to replace globals.css functionality
    MuiCssBaseline: {
      styleOverrides: {
        // Replace the body styles from globals.css
        body: {
          backgroundColor: "#0f172a", // Slate 900 - deeper, more sophisticated
          color: "#f8fafc", // Slate 50 - pure white with subtle warmth
          fontFamily: [
            "var(--font-geist-sans)",
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
          ].join(","),
          margin: 0,
          padding: 0,
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
        // Global box-sizing
        "*": {
          boxSizing: "border-box",
        },
        // Ensure proper font rendering
        html: {
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
        // Support for CSS custom properties from globals.css
        ":root": {
          "--background": "#0f172a",
          "--foreground": "#f8fafc",
          "--color-background": "#0f172a",
          "--color-foreground": "#f8fafc",
        },
        // Dark mode support (since we're using dark theme by default)
        "@media (prefers-color-scheme: dark)": {
          ":root": {
            "--background": "#0f172a",
            "--foreground": "#f8fafc",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            color: "#f8fafc", // Slate 50
            "& fieldset": {
              borderColor: "#475569", // Slate 600 - softer borders
            },
            "&:hover fieldset": {
              borderColor: "#64748b", // Slate 500 - subtle hover
            },
            "&.Mui-focused fieldset": {
              borderColor: "#6366f1", // Indigo 500 - beautiful focus
            },
          },
          "& .MuiInputLabel-root": {
            color: "#94a3b8", // Slate 400 - softer labels
            "&.Mui-focused": {
              color: "#6366f1", // Indigo 500
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          borderRadius: 8,
        },
        // Override ALL contained buttons (including default primary)
        contained: {
          backgroundColor: "#6366f1", // Indigo 500
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#4f46e5", // Indigo 600
          },
          "&:focus": {
            backgroundColor: "#4f46e5",
          },
          "&:active": {
            backgroundColor: "#4338ca", // Indigo 700
          },
        },
        // Override primary contained buttons specifically
        containedPrimary: {
          backgroundColor: "#6366f1 !important", // Indigo 500 - force override
          color: "#ffffff !important",
          "&:hover": {
            backgroundColor: "#4f46e5 !important", // Indigo 600
          },
          "&:focus": {
            backgroundColor: "#4f46e5 !important",
          },
          "&:active": {
            backgroundColor: "#4338ca !important", // Indigo 700
          },
          "&:disabled": {
            backgroundColor: "rgba(100, 116, 139, 0.3) !important", // Slate 500 with opacity
            color: "rgba(148, 163, 184, 0.5) !important", // Slate 400 with opacity
            cursor: "not-allowed",
          },
        },
        // Override secondary contained buttons
        containedSecondary: {
          backgroundColor: "#8b5cf6 !important", // Violet 500
          color: "#ffffff !important",
          "&:hover": {
            backgroundColor: "#7c3aed !important", // Violet 600
          },
          "&:focus": {
            backgroundColor: "#7c3aed !important",
          },
          "&:active": {
            backgroundColor: "#6d28d9 !important", // Violet 700
          },
        },
        // Override outlined buttons
        outlined: {
          backgroundColor: "transparent",
          borderColor: "#6366f1", // Indigo 500
          color: "#6366f1",
          "&:hover": {
            backgroundColor: "rgba(99, 102, 241, 0.08)", // Subtle indigo overlay
            borderColor: "#4f46e5", // Indigo 600
          },
        },
        // Override outlined primary buttons
        outlinedPrimary: {
          backgroundColor: "transparent",
          borderColor: "#6366f1 !important", // Indigo 500
          color: "#6366f1 !important",
          "&:hover": {
            backgroundColor: "rgba(99, 102, 241, 0.08) !important", // Subtle indigo overlay
            borderColor: "#4f46e5 !important", // Indigo 600
          },
        },
        // Override outlined secondary buttons
        outlinedSecondary: {
          backgroundColor: "transparent",
          borderColor: "#8b5cf6 !important", // Violet 500
          color: "#8b5cf6 !important",
          "&:hover": {
            backgroundColor: "rgba(139, 92, 246, 0.08) !important", // Subtle violet overlay
            borderColor: "#7c3aed !important", // Violet 600
          },
        },
      },
    },
    // Ensure Typography components use theme colors
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "inherit", // Let parent components control color
        },
      },
    },
    // Style links consistently with beautiful indigo
    MuiLink: {
      styleOverrides: {
        root: {
          color: "#6366f1", // Indigo 500
          textDecoration: "none",
          "&:hover": {
            color: "#4f46e5", // Indigo 600
            textDecoration: "underline",
          },
        },
      },
    },
    // Ensure containers are transparent by default
    MuiContainer: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
        },
      },
    },
    // Style Paper components with sophisticated slate colors
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e293b", // Slate 800 - warmer than gray
          color: "#f8fafc", // Slate 50
        },
      },
    },
  },
});

export function CustomThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
