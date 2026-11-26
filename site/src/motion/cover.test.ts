import { describe, expect, it } from "vitest";
import { COVER_FAILSAFE_MS, coverReducer, shouldCover, type CoverEvent, type CoverState } from "./cover";

const states: CoverState[] = ["idle", "closing", "covered", "opening"];
const events: CoverEvent[] = ["navigate", "closed", "arrived", "opened", "failsafe"];

describe("coverReducer", () => {
  it("closes, covers, opens and returns to idle", () => {
    expect(coverReducer("idle", "navigate")).toBe("closing");
    expect(coverReducer("closing", "closed")).toBe("covered");
    expect(coverReducer("covered", "arrived")).toBe("opening");
    expect(coverReducer("opening", "opened")).toBe("idle");
  });

  it("opens on the failsafe while closing or covered", () => {
    expect(coverReducer("closing", "failsafe")).toBe("opening");
    expect(coverReducer("covered", "failsafe")).toBe("opening");
    expect(COVER_FAILSAFE_MS).toBe(4000);
  });

  it("ignores navigate while not idle, and every event that does not apply", () => {
    const applies: Partial<Record<CoverEvent, CoverState[]>> = {
      navigate: ["idle"],
      closed: ["closing"],
      arrived: ["covered"],
      opened: ["opening"],
      failsafe: ["closing", "covered"],
    };
    for (const state of states) {
      for (const event of events) {
        if (applies[event]?.includes(state)) continue;
        expect(coverReducer(state, event), `${state} + ${event}`).toBe(state);
      }
    }
  });
});

describe("shouldCover", () => {
  it("covers only in full motion, for a link to another page", () => {
    expect(shouldCover("still", "/", "/ending")).toBe(false);
    expect(shouldCover("full", "/ending", "/ending")).toBe(false);
    expect(shouldCover("full", "/chapters/louisiana", "/chapters/louisiana#beat-6")).toBe(false);
    expect(shouldCover("full", "/chapters/louisiana", "#beat-6")).toBe(false);
    expect(shouldCover("full", "/", "/chapters/louisiana")).toBe(true);
  });
});
