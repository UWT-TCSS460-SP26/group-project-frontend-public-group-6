/** Runs before paint to avoid light flash when dark mode is saved or preferred. */
export default function ThemeScript() {
  const script = `
(function () {
  try {
    var key = "mediabrowse-theme";
    var stored = localStorage.getItem(key);
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var isDark = stored === "dark" || (stored !== "light" && prefersDark);
    document.documentElement.classList.toggle("dark", isDark);
  } catch (e) {}
})();
`;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: script }}
      suppressHydrationWarning
    />
  );
}
