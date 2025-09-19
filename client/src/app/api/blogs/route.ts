import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Blog from '@/app/models/blog';

// GET all blogs (with optional filtering)
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const published = searchParams.get('published');
    const author = searchParams.get('author');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = parseInt(searchParams.get('skip') || '0');

    const filter: { category?: string; published?: boolean; author?: string } = {};

    if (category) filter.category = category;
    if (published !== null) filter.published = published === 'true';
    if (author) filter.author = author;

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
   console.error('Error fetching blogs:', error);
   return NextResponse.json({ message: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 });
 }
}

// CREATE new blog
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { title, content, excerpt, author, category, tags, imageUrl, published } = body;

    // Basic validation
    if (!title || title.length > 200) {
      return NextResponse.json({ message: 'Title is required and must be less than 200 characters' }, { status: 400 });
    }
    if (!content) {
      return NextResponse.json({ message: 'Content is required' }, { status: 400 });
    }
    if (!author) {
      return NextResponse.json({ message: 'Author is required' }, { status: 400 });
    }
    if (!['politics', 'trending', 'hotSpot', 'editors', 'featured', 'other'].includes(category)) {
      return NextResponse.json({ message: 'Invalid category' }, { status: 400 });
    }

    const blogData = {
      title: title.trim(),
      content,
      excerpt,
      author: author.trim(),
      category,
      tags: Array.isArray(tags) ? tags : [],
      imageUrl,
      published: Boolean(published),
      publishedAt: published ? new Date() : null
    };

    const blog = new Blog(blogData);
    const savedBlog = await blog.save();

    return NextResponse.json(savedBlog, { status: 201 });
  } catch (error) {
   console.error('Error creating blog:', error);
   return NextResponse.json({ message: error instanceof Error ? error.message : 'Internal server error' }, { status: 400 });
 }
}