import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import { getData, setData, clearData, getUserIds } from "./storage.js";

// Mock localStorage for Node.js
global.localStorage = {
  store: new Map(),
  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null;
  },
  setItem(key, value) {
    this.store.set(key, value);
  },
  removeItem(key) {
    this.store.delete(key);
  },
  clear() {
    this.store.clear();
  }
};

describe("Bookmark Storage", () => {
  beforeEach(() => {
    getUserIds().forEach((id) => clearData(id));
    clearData("newUser");
  });

  it("should return null for new user with no bookmarks", () => {
    const result = getData("newUser");
    assert.strictEqual(result, null);
  });

  it("should store and retrieve a single bookmark for a user", () => {
    const userId = "1";
    const bookmark = {
      url: "https://example.com",
      title: "Example",
      description: "An example site",
      createdAt: new Date().toISOString(),
    };

    setData(userId, [bookmark]);
    const result = getData(userId);
    assert.deepStrictEqual(result, [bookmark]);
  });

  it("should overwrite existing data when setData is called again", () => {
    const userId = "2";
    const firstBookmark = [{ url: "https://first.com", title: "First", description: "desc", createdAt: new Date().toISOString() }];
    const secondBookmark = [{ url: "https://second.com", title: "Second", description: "desc", createdAt: new Date().toISOString() }];

    setData(userId, firstBookmark);
    setData(userId, secondBookmark);
    const result = getData(userId);
    assert.deepStrictEqual(result, secondBookmark);
  });

  it("should clear data properly for a user", () => {
    const userId = "1";
    const bookmark = {
      url: "https://clearme.com",
      title: "To be cleared",
      description: "Temporary",
      createdAt: new Date().toISOString(),
    };

    setData(userId, [bookmark]);
    clearData(userId);
    const result = getData(userId);
    assert.strictEqual(result, null);
  });

  it("should return correct user IDs", () => {
    const result = getUserIds();
    assert.deepStrictEqual(result, ["1", "2", "3", "4", "5"]);
  });
});
