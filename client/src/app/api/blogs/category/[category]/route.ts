import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Blog from '@/app/models/blog';

// GET blogs by category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = parseInt(searchParams.get('skip') || '0');

    const resolvedParams = await params;
    const categories = resolvedParams.category.split(',');
    const filter: { category: { $in: string[] }; published?: boolean } = { category: { $in: categories } };

    if (published !== null) filter.published = published === 'true';

    const blogs = await Blog.find(filter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Blog.countDocuments(filter);

    return NextResponse.json({
      blogs,
      total,
      hasMore: total > skip + blogs.length
    });
  } catch (error) {
    console.error('Error fetching blogs by category:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}