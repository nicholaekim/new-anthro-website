import { beforeEach, describe, expect, it } from "vitest";
import { clearStored, STORAGE_PREFIX } from "./storage";

describe("clearStored", () => {
  beforeEach(() => sessionStorage.clear());

  it("removes every opmb: key and leaves the others", () => {
    expect(STORAGE_PREFIX).toBe("opmb:");
    sessionStorage.setItem("opmb:motion", "off");
    sessionStorage.setItem("opmb:era", "present");
    sessionStorage.setItem("other", "keep");
    sessionStorage.setItem("xopmb:", "keep");
    clearStored();
    expect(sessionStorage.getItem("opmb:motion")).toBeNull();
    expect(sessionStorage.getItem("opmb:era")).toBeNull();
    expect(sessionStorage.getItem("other")).toBe("keep");
    expect(sessionStorage.getItem("xopmb:")).toBe("keep");
    expect(sessionStorage.length).toBe(2);
  });
});
