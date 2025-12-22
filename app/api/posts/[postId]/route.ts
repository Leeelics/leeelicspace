import { NextRequest, NextResponse } from 'next/server';
import { postStore } from '../../data';

// 获取单篇文章
export async function GET(request: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
  try {
    const { postId } = await params;
    const post = await postStore.getPostById(postId);
    if (post) {
      return NextResponse.json(post);
    }
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

// 更新文章
export async function PUT(request: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
  try {
    // 获取请求体
    const data = await request.json();
    const { postId } = await params;
    
    // 简单的权限验证（实际项目中应使用更安全的方式）
    if (data.secret !== 'admin-secret') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// 删除文章
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
  try {
    // 获取权限验证参数
    const searchParams = request.nextUrl.searchParams;
    const secret = searchParams.get('secret') || request.headers.get('X-Secret');
    const { postId } = await params;
    
    // 简单的权限验证（实际项目中应使用更安全的方式）
    if (secret !== 'admin-secret') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // 删除文章
    const success = await postStore.deletePost(postId);
    
    if (success) {
      return NextResponse.json({ message: 'Post deleted' });
    }
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
