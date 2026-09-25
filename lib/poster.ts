/**
 * A stable gradient for a meeting, derived from its id.
 *
 * Recordings have no still frames in this product, so every surface that
 * wants a thumbnail needs a fallback. Looking the meeting up to read a stored
 * colour meant playlist cards depended on having the whole meeting in hand --
 * and broke for anything not in the seed. Hashing the id gives the same two
 * colours for the same meeting everywhere, with no lookup and no round trip.
 */
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function posterFor(id: string): [string, string] {
  const hue = hash(id) % 360;
  return [`hsl(${hue} 58% 32%)`, `hsl(${(hue + 38) % 360} 62% 12%)`];
}
