import React, { useState } from "react";
import chroma from "chroma-js";

// Tipagem para o tema
type ThemeColors = {
  [key: string]: string;
};

// Função que gera o tema com base na cor primária
const generateTheme = (primaryColor: string): ThemeColors => {
  const primary = chroma(primaryColor).hex();
  const primaryDark = chroma(primaryColor).darken(1.5).hex();
  const primaryContainer = chroma(primaryColor).brighten(2).hex();
  const primaryContainerDark = chroma(primaryColor).darken(2).hex();

  const secondary = chroma(primaryColor).set("hsl.h", "+30").hex();
  const secondaryDark = chroma(secondary).darken(1.5).hex();
  const secondaryContainer = chroma(secondary).brighten(2).hex();
  const secondaryContainerDark = chroma(secondary).darken(2).hex();

  const onPrimary = chroma.contrast(primary, "#000") > 4.5 ? "#000" : "#FFF";
  const onPrimaryDark =
    chroma.contrast(primaryDark, "#000") > 4.5 ? "#000" : "#FFF";

  const onSecondary =
    chroma.contrast(secondary, "#000") > 4.5 ? "#000" : "#FFF";
  const onSecondaryDark =
    chroma.contrast(secondaryDark, "#000") > 4.5 ? "#000" : "#FFF";

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
    onPrimary,
    onPrimaryDark,
    onSecondary,
    onSecondaryDark,
    background,
    backgroundDark,
    surface,
    surfaceDark,
  };
};

// Função que exporta o tema em formato XML
const exportTheme = (theme: ThemeColors): string => {
  return Object.entries(theme)
    .map(([key, value]) => `<Color x:Key="${key}">${value}</Color>`)
    .join("\n");
};

// Componente principal
const App: React.FC = () => {
  const [primaryColor, setPrimaryColor] = useState("#003882");
  const [theme, setTheme] = useState<ThemeColors | null>(null);

  const handleGenerateTheme = () => {
    const generatedTheme = generateTheme(primaryColor);
    setTheme(generatedTheme);
  };

  const handleExportTheme = () => {
    if (theme) {
      const themeXML = exportTheme(theme);
      const blob = new Blob([themeXML], { type: "text/xml" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "theme.xml";
      link.click();
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1>Theme Builder</h1>
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="primaryColor">Primary Color:</label>
        <input
          id="primaryColor"
          type="color"
          value={primaryColor}
          onChange={(e) => setPrimaryColor(e.target.value)}
          style={{ marginLeft: "10px" }}
        />
      </div>
      <button onClick={handleGenerateTheme} style={{ marginRight: "10px" }}>
        Generate Theme
      </button>
      <button onClick={handleExportTheme} disabled={!theme}>
        Export Theme
      </button>

      {theme && (
        <div style={{ marginTop: "20px" }}>
          <h2>Generated Theme:</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {Object.entries(theme).map(([key, value]) => (
              <div
                key={key}
                style={{
                  width: "150px",
                  height: "150px",
                  backgroundColor: value,
                  color: chroma.contrast(value, "#000") > 4.5 ? "#000" : "#FFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  borderRadius: "8px",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                }}
              >
                <strong style={{ fontSize: "14px", textAlign: "center" }}>
                  {key}
                </strong>
                <span style={{ fontSize: "12px" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
