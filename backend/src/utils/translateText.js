export async function translateToEnglish(text, language) {
  if (!text || !language || language === "English") return text || "";
  const code = language === "Telugu" ? "te" : language === "Hindi" ? "hi" : null;
  if (!code) return text;
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${code}|en`;
    const response = await fetch(url);
    if (!response.ok) return text;
    const data = await response.json();
    return data?.responseData?.translatedText || text;
  } catch {
    return text;
  }
}
