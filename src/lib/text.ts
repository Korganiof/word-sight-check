/**
 * Splits a token like "kuuma," into the tappable word and its trailing
 * punctuation, so the punctuation can stay outside the word's <button>.
 */
export function splitTrailingPunctuation(token: string): { word: string; trail: string } {
  const m = token.match(/^(.*?[\p{L}\p{N}])([^\p{L}\p{N}]*)$/u);
  if (!m) return { word: token, trail: "" };
  return { word: m[1], trail: m[2] };
}
