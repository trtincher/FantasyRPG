import { describe, it, expect } from 'vitest';
import { STORY_TRIGGERS } from '../story';
import { DIALOGUES } from '../dialogues';

describe('story trigger data', () => {
  it('has at least 3 trigger entries', () => {
    expect(STORY_TRIGGERS.length).toBeGreaterThanOrEqual(3);
  });

  STORY_TRIGGERS.forEach((trigger) => {
    describe(trigger.id, () => {
      it('has non-empty id', () => {
        expect(trigger.id.length).toBeGreaterThan(0);
      });

      it('has non-empty dialogueKey', () => {
        expect(trigger.dialogueKey.length).toBeGreaterThan(0);
      });

      it('has valid tile coordinates', () => {
        expect(trigger.tileX).toBeGreaterThan(0);
        expect(trigger.tileY).toBeGreaterThan(0);
      });

      it('dialogueKey exists in DIALOGUES', () => {
        expect(DIALOGUES).toHaveProperty(trigger.dialogueKey);
      });
    });
  });

  it('has unique trigger ids', () => {
    const ids = STORY_TRIGGERS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
