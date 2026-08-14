// TF-IDF based cosine similarity for semantic resume/JD matching
// No external API calls — fully deterministic and instant

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'any', 'can', 'had',
  'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how',
  'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'use', 'man',
  'with', 'have', 'this', 'will', 'your', 'from', 'they', 'know', 'want', 'been',
  'good', 'much', 'some', 'time', 'very', 'when', 'come', 'here', 'just', 'like',
  'long', 'make', 'many', 'more', 'only', 'over', 'such', 'take', 'than', 'them',
  'then', 'there', 'well', 'were', 'what', 'able', 'also', 'that', 'into', 'able',
  'experience', 'work', 'using', 'strong', 'excellent', 'knowledge',
]);

function filterStopWords(tokens: string[]): string[] {
  return tokens.filter((t) => !STOP_WORDS.has(t));
}

function buildTermFrequency(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1);
  }
  return tf;
}

function cosineSimilarity(vecA: Map<string, number>, vecB: Map<string, number>): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (const [term, countA] of vecA) {
    normA += countA * countA;
    const countB = vecB.get(term) || 0;
    dotProduct += countA * countB;
  }

  for (const [, countB] of vecB) {
    normB += countB * countB;
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function semanticSimilarityScore(textA: string, textB: string): number {
  if (!textA || !textB) return 50; // Neutral if no JD

  const tokensA = filterStopWords(tokenize(textA));
  const tokensB = filterStopWords(tokenize(textB));

  const tfA = buildTermFrequency(tokensA);
  const tfB = buildTermFrequency(tokensB);

  const similarity = cosineSimilarity(tfA, tfB);
  // Scale cosine similarity (0–1) to a 0–100 score
  // Typical resume vs JD similarity is 0.05–0.4, so we amplify
  return Math.min(100, Math.round(similarity * 300));
}

export function extractJDKeywords(jdText: string): {
  required: string[];
  preferred: string[];
  jobTitle?: string;
} {
  const tokens = filterStopWords(tokenize(jdText));
  const freq = buildTermFrequency(tokens);

  // Prefer words that appear 2+ times (more important)
  const required: string[] = [];
  const preferred: string[] = [];

  for (const [term, count] of freq) {
    if (term.length < 3) continue;
    if (count >= 2) required.push(term);
    else preferred.push(term);
  }

  // Job title heuristic: first line or after "position:" / "role:"
  const jobTitleMatch = jdText.match(/(?:^|\n)([A-Z][A-Za-z\s]+(?:Engineer|Developer|Manager|Analyst|Designer|Scientist|Architect|Lead|Senior|Junior))/);
  const jobTitle = jobTitleMatch ? jobTitleMatch[1].trim() : undefined;

  return {
    required: required.slice(0, 30),
    preferred: preferred.slice(0, 20),
    jobTitle,
  };
}
