import React, { useState } from "react";
import chroma from "chroma-js";
import "./App.css";

type ThemeColors = { [key: string]: string };

const generateTheme = (primaryColor: string): ThemeColors => {
  const primary = chroma(primaryColor).hex();
  const primaryDark = chroma(primaryColor).darken(1.5).hex();
  const primaryContainer = chroma(primaryColor).brighten(2).hex();
  const primaryContainerDark = chroma(primaryColor).darken(2).hex();

  const secondary = chroma(primaryColor).set("hsl.h", "+30").hex();
  const secondaryDark = chroma(secondary).darken(1.5).hex();
  const secondaryContainer = chroma(secondary).brighten(2).hex();
  const secondaryContainerDark = chroma(secondary).darken(2).hex();

  const tertiary = chroma(primaryColor).set("hsl.h", "-30").hex();
  const tertiaryDark = chroma(tertiary).darken(1.5).hex();
  const tertiaryContainer = chroma(tertiary).brighten(2).hex();
  const tertiaryContainerDark = chroma(tertiary).darken(2).hex();

  const onPrimary = chroma.contrast(primary, "#000") > 4.5 ? "#000" : "#FFF";
  const onPrimaryDark =
    chroma.contrast(primaryDark, "#000") > 4.5 ? "#000" : "#FFF";

  const onSecondary =
    chroma.contrast(secondary, "#000") > 4.5 ? "#000" : "#FFF";
  const onSecondaryDark =
    chroma.contrast(secondaryDark, "#000") > 4.5 ? "#000" : "#FFF";

  const onTertiary = chroma.contrast(tertiary, "#000") > 4.5 ? "#000" : "#FFF";
  const onTertiaryDark =
    chroma.contrast(tertiaryDark, "#000") > 4.5 ? "#000" : "#FFF";

  const background = "#FFFFFF";
  const backgroundDark = "#121212";
  const surface = chroma(background).darken(0.2).hex();
  const surfaceDark = chroma(backgroundDark).brighten(0.2).hex();

  return {
    primary,
    primaryDark,
    primaryContainer,
    primaryContainerDark,
    secondary,
    secondaryDark,
    secondaryContainer,
    secondaryContainerDark,
    tertiary,
    tertiaryDark,
    tertiaryContainer,
    tertiaryContainerDark,
    onPrimary,
    onPrimaryDark,
    onSecondary,
    onSecondaryDark,
    onTertiary,
    onTertiaryDark,
    background,
    backgroundDark,
    surface,
    surfaceDark,
  };
};

const exportThemeXML = (theme: ThemeColors): string => {
  return Object.entries(theme)
    .map(([key, value]) => `<Color x:Key="${key}">${value}</Color>`)
    .join("\n");
};

const exportThemeJS = (theme: ThemeColors): string => {
  const themeObject = JSON.stringify(theme, null, 2);
  return `export const theme = ${themeObject};`;
};

const App: React.FC = () => {
  const [primaryColor, setPrimaryColor] = useState("#003882");
  const [theme, setTheme] = useState<ThemeColors | null>(null);

  const handleGenerateTheme = () => {
    const generatedTheme = generateTheme(primaryColor);
    setTheme(generatedTheme);
  };

  const handleExport = (format: "xml" | "js") => {
    if (theme) {
      let content = "";
      let fileName = "";

      if (format === "xml") {
        content = exportThemeXML(theme);
        fileName = "theme.xml";
      } else if (format === "js") {
        content = exportThemeJS(theme);
        fileName = "theme.js";
      }

      const blob = new Blob([content], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    }
  };

  return (
    <div className="app-container">
      <h1>Theme Builder</h1>
      <div className="color-input-container">
        <label htmlFor="primaryColor">Primary Color:</label>
        <input
          id="primaryColor"
          type="color"
          value={primaryColor}
          onChange={(e) => setPrimaryColor(e.target.value)}
        />
      </div>
      <div className="button-exports">
        <button onClick={handleGenerateTheme}>Generate Theme</button>
        <button onClick={() => handleExport("xml")} disabled={!theme}>
          Export as XML
        </button>
        <button onClick={() => handleExport("js")} disabled={!theme}>
          Export as JS
        </button>
      </div>

      {theme && (
        <div className="theme-container">
          <h2>Generated Theme:</h2>
          <div className="theme-cards">
            {Object.entries(theme).map(([key, value]) => (
              <div
                key={key}
                className="theme-card"
                style={{
                  backgroundColor: value,
                  color: chroma.contrast(value, "#000") > 4.5 ? "#000" : "#FFF",
                }}
              >
                <strong>{key}</strong>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
