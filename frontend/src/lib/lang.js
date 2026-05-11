function getLanguageName({ languageid }) {
    const LANGUAGE_NAMES = {
        PYTHON: 71,
        JAVASCRIPT: 63,
        JAVA: 62
    };
    return LANGUAGE_NAMES[languageid] || "Unknown"
}
export { getLanguageName }

export function getLanguageId(language) {
    const languageMap = {
        PYTHON: 71,
        JAVASCRIPT: 63,
        JS: 63,
        JAVA: 62,
    }
    const key = String(language || "").toUpperCase()
    return languageMap[key] ?? 63
}