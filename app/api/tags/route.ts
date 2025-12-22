import { NextResponse } from 'next/server';
import { postStore } from '../data';

// 获取所有标签
export async function GET() {
  try {
    const tags = await postStore.getAllTags();
    return NextResponse.json(tags);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}
