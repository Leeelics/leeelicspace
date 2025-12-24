import { NextResponse } from 'next/server';
import { postStore } from '../data';

// 获取所有标签
export async function GET() {
  try {
    console.log('GET /api/tags - Fetching tags');
    const tags = await postStore.getAllTags();
    console.log(`GET /api/tags - Found ${tags.length} tags`);
    return NextResponse.json(tags);
  } catch (error) {
    console.error('GET /api/tags - Error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch tags',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
