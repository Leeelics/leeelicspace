import { HttpResponse, http } from "msw";
import { mockPost, mockPosts } from "../fixtures/posts";

export const handlers = [
  // GET /api/posts
  http.get("/api/posts", () => {
    return HttpResponse.json({
      success: true,
      data: {
        posts: mockPosts,
        total: mockPosts.length,
        page: 1,
        per_page: 10,
      },
    });
  }),

  // GET /api/posts/:id
  http.get("/api/posts/:id", ({ params }) => {
    const { id } = params;
    const post = mockPosts.find((p) => p.id === id);

    if (!post) {
      return HttpResponse.json(
        {
          success: false,
          error: "Post not found",
        },
        { status: 404 },
      );
    }

    return HttpResponse.json({
      success: true,
      data: post,
    });
  }),

  // POST /api/posts
  http.post("/api/posts", async ({ request }) => {
    const body = (await request.json()) as {
      title: string;
      content: string;
      tags?: string[];
    };

    const newPost = {
      ...mockPost,
      id: Math.random().toString(36).substring(2, 8),
      title: body.title,
      content: body.content,
      tags: body.tags || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return HttpResponse.json(
      {
        success: true,
        data: newPost,
      },
      { status: 201 },
    );
  }),

  // GET /api/tags
  http.get("/api/tags", () => {
    const tags = [...new Set(mockPosts.flatMap((post) => post.tags))];
    return HttpResponse.json({
      success: true,
      data: tags,
    });
  }),

  // GET /api/health
  http.get("/api/health", () => {
    return HttpResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
    });
  }),
];
