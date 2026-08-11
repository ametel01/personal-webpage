/**
 * Pure insert-mode validation shared by the live server and its event validator.
 */

/**
 * Whether Create is allowed for an insert session.
 * Requires a non-empty prompt OR at least one annotation.
 */
export function canCreateInsert({ prompt, comments, strokes }) {
  const hasPrompt = typeof prompt === "string" && prompt.trim().length > 0;
  const hasComments = Array.isArray(comments) && comments.length > 0;
  const hasStrokes =
    Array.isArray(strokes) && strokes.some((s) => Array.isArray(s?.points) && s.points.length >= 2);
  return hasPrompt || hasComments || hasStrokes;
}
