// File: src/app/api/blogs/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Blog, { IBlog } from '@/app/models/blog';

const VALID_CATEGORIES = [
  'politics',
  'trending',
  'hotSpot',
  'editors',
  'featured',
  'other',
];

// ------------------ GET Single Blog ------------------
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ------------------ UPDATE Blog ------------------
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;
    const body = await request.json();
    const {
      title,
      content,
      excerpt,
      author,
      category,
      tags,
      imageUrl,
      published,
    } = body;

    // Basic validation
    if (title && title.length > 200) {
      return NextResponse.json(
        { message: 'Title must be less than 200 characters' },
        { status: 400 }
      );
    }

    if (category && !VALID_CATEGORIES.includes(category)) {
      return NextResponse.json({ message: 'Invalid category' }, { status: 400 });
    }

    const blogData: Partial<IBlog> = {};

    if (title !== undefined) blogData.title = title.trim();
    if (content !== undefined) blogData.content = content;
    if (excerpt !== undefined) blogData.excerpt = excerpt;
    if (author !== undefined) blogData.author = author.trim();
    if (category !== undefined) blogData.category = category;
    if (tags !== undefined)
      blogData.tags = Array.isArray(tags)
        ? tags.map((tag) => tag.trim())
        : [];
    if (imageUrl !== undefined) blogData.imageUrl = imageUrl;
    if (published !== undefined) {
      blogData.published = Boolean(published);
      blogData.publishedAt = published ? new Date() : null;
    }

    const blog = await Blog.findByIdAndUpdate(id, blogData, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ------------------ DELETE Blog ------------------
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
