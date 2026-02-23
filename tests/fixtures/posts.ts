import type { Post, PublishStatus } from "@/types";
import { defaultChannelConfig, defaultPublishStatus } from "@/types";

export const mockPublishStatus: PublishStatus = {
  ...defaultPublishStatus,
};

export const mockPost: Post = {
  id: "abc123",
  title: "Test Post Title",
  content: "This is a test post content with **markdown** support.",
  tags: ["test", "example"],
  created_at: "2024-01-15T10:00:00Z",
  updated_at: "2024-01-15T10:00:00Z",
  publishStatus: mockPublishStatus,
  channelConfig: { ...defaultChannelConfig },
};

export const mockPosts: Post[] = [
  mockPost,
  {
    id: "def456",
    title: "Second Test Post",
    content: "Another test post for list endpoints.",
    tags: ["test", "another"],
    created_at: "2024-01-14T10:00:00Z",
    updated_at: "2024-01-14T10:00:00Z",
    publishStatus: mockPublishStatus,
    channelConfig: { ...defaultChannelConfig },
  },
];

// Factory function to create mock posts
export function createMockPost(overrides?: Partial<Post>): Post {
  return {
    ...mockPost,
    id: Math.random().toString(36).substring(2, 8),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  };
}
