import { describe, it, expect } from 'vitest';
import { DIALOGUES } from '../dialogues';

describe('dialogue data', () => {
  const entries = Object.entries(DIALOGUES);

  it('has at least 6 dialogue entries', () => {
    expect(entries.length).toBeGreaterThanOrEqual(6);
  });

  entries.forEach(([key, lines]) => {
    describe(key, () => {
      it('has at least one line', () => {
        expect(lines.length).toBeGreaterThan(0);
      });

      lines.forEach((line, i) => {
        it(`line ${i} has non-empty text`, () => {
          expect(line.text.length).toBeGreaterThan(0);
        });
      });
    });
  });

  it('has NPC dialogue keys', () => {
    expect(DIALOGUES).toHaveProperty('old-man');
    expect(DIALOGUES).toHaveProperty('guard');
    expect(DIALOGUES).toHaveProperty('ghost');
  });

  it('has story trigger dialogue keys', () => {
    expect(DIALOGUES).toHaveProperty('entrance-trigger');
    expect(DIALOGUES).toHaveProperty('midpoint-trigger');
    expect(DIALOGUES).toHaveProperty('boss-door-trigger');
  });
});
