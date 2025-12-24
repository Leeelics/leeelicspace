import { NextRequest, NextResponse } from "next/server";
import { postStore } from "../../data";
import { isAuthenticated, getAuthDebugInfo } from "@/lib/auth";

// 获取单篇文章
export async function GET(request: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
  let postId: string | undefined;
  
  try {
    const paramsData = await params;
    postId = paramsData.postId;
    console.log(`GET /api/posts/${postId} - Fetching post`);
    const post = await postStore.getPostById(postId);
    if (post) {
      console.log(`GET /api/posts/${postId} - Post found: "${post.title}"`);
      return NextResponse.json(post);
    }
    console.log(`GET /api/posts/${postId} - Post not found`);
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  } catch (error) {
    console.error(`GET /api/posts/${postId || 'unknown'} - Error:`, error);
    return NextResponse.json({ 
      error: 'Failed to fetch post',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// 更新文章
export async function PUT(request: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
  let postId: string | undefined;
  
  try {
    // 获取请求体
    const data = await request.json();
    const paramsData = await params;
    postId = paramsData.postId;
    
    console.log(`PUT /api/posts/${postId} - Auth debug:`, getAuthDebugInfo(request));
    
    // 权限验证
    if (!isAuthenticated(request)) {
      console.log(`PUT /api/posts/${postId} - Authentication failed`);
      return NextResponse.json({ 
        error: 'Unauthorized',
        message: 'Missing or invalid authentication credentials'
      }, { status: 401 });
    }
    
    // 更新文章
    const updatedPost = await postStore.updatePost(postId, {
      title: data.title,
      content: data.content,
      tags: data.tags
    });
    
    if (updatedPost) {
      return NextResponse.json(updatedPost);
    }
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  } catch (error) {
    console.error(`PUT /api/posts/${postId || 'unknown'} - Error:`, error);
    return NextResponse.json({ 
      error: 'Failed to update post',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// 删除文章
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
  let postId: string | undefined;
  
  try {
    const paramsData = await params;
    postId = paramsData.postId;
    
    console.log(`DELETE /api/posts/${postId} - Auth debug:`, getAuthDebugInfo(request));
    
    // 权限验证
    if (!isAuthenticated(request)) {
      console.log(`DELETE /api/posts/${postId} - Authentication failed`);
      return NextResponse.json({ 
        error: 'Unauthorized',
        message: 'Missing or invalid authentication credentials'
      }, { status: 401 });
    }
    
    // 删除文章
    const success = await postStore.deletePost(postId);
    
    if (success) {
      return NextResponse.json({ message: 'Post deleted' });
    }
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  } catch (error) {
    console.error(`DELETE /api/posts/${postId || 'unknown'} - Error:`, error);
    return NextResponse.json({ 
      error: 'Failed to delete post',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
