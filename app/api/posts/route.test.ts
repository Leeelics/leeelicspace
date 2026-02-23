import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET, POST } from "./route";

// Mock the postStore
vi.mock("../data", () => ({
  postStore: {
    getSortedPosts: vi.fn(),
    createPost: vi.fn(),
  },
}));

// Mock auth
vi.mock("@/lib/auth", () => ({
  isAuthenticated: vi.fn(),
  getAuthDebugInfo: vi.fn(() => null),
}));

// Mock rate limit
vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn(() => Promise.resolve({ allowed: true })),
  getRateLimitHeaders: vi.fn(() => ({
    "X-RateLimit-Limit": "100",
    "X-RateLimit-Remaining": "99",
  })),
  RATE_LIMITS: {
    read: { points: 100, duration: 60 },
    write: { points: 10, duration: 60 },
  },
}));

// Mock logger
vi.mock("@/lib/logger", () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    apiError: vi.fn(),
    apiDebug: vi.fn(),
    apiInfo: vi.fn(),
  },
}));

import { NextRequest } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { postStore } from "../data";

// Helper to create NextRequest
function createNextRequest(url: string, options: any = {}) {
  return new NextRequest(url, options);
}

describe("/api/posts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET", () => {
    it("returns list of posts", async () => {
      const mockPosts = [
        {
          id: "1",
          title: "Test Post",
          content: "Content",
          tags: ["test"],
          created_at: "2024-01-01",
          updated_at: "2024-01-01",
        },
      ];
      (postStore.getSortedPosts as any).mockResolvedValue(mockPosts);

      const request = createNextRequest("http://localhost:3002/api/posts");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.posts).toHaveLength(1);
      expect(data.data.posts[0].title).toBe("Test Post");
    });

    it("filters posts by tag", async () => {
      const mockPosts = [
        {
          id: "1",
          title: "Post 1",
          content: "Content",
          tags: ["javascript"],
          created_at: "2024-01-01",
          updated_at: "2024-01-01",
        },
        {
          id: "2",
          title: "Post 2",
          content: "Content",
          tags: ["react"],
          created_at: "2024-01-01",
          updated_at: "2024-01-01",
        },
      ];
      (postStore.getSortedPosts as any).mockResolvedValue(mockPosts);

      const request = createNextRequest(
        "http://localhost:3002/api/posts?tag=javascript",
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.posts).toHaveLength(1);
      expect(data.data.posts[0].tags).toContain("javascript");
    });

    it("returns empty array when no posts match", async () => {
      (postStore.getSortedPosts as any).mockResolvedValue([]);

      const request = createNextRequest("http://localhost:3002/api/posts");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.posts).toEqual([]);
    });
  });

  describe("POST", () => {
    it("creates new post with valid data", async () => {
      (isAuthenticated as any).mockReturnValue(true);

      const newPost = {
        id: "abc123",
        title: "New Post",
        content: "Content here",
        tags: ["test"],
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      };
      (postStore.createPost as any).mockResolvedValue(newPost);

      const request = createNextRequest("http://localhost:3002/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Secret": "test-secret",
        },
        body: JSON.stringify({
          title: "New Post",
          content: "Content here",
          tags: ["test"],
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.data.title).toBe("New Post");
    });

    it("returns 401 when not authenticated", async () => {
      (isAuthenticated as any).mockReturnValue(false);

      const request = createNextRequest("http://localhost:3002/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "New Post",
          content: "Content",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toContain("Unauthorized");
    });

    it("returns 400 for invalid data", async () => {
      (isAuthenticated as any).mockReturnValue(true);

      const request = createNextRequest("http://localhost:3002/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Secret": "test-secret",
        },
        body: JSON.stringify({
          // Missing required fields
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
    });
  });
});
