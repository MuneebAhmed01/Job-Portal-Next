import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('resume') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { success: false, error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Create FormData for backend API
    const backendFormData = new FormData();
    backendFormData.append('resume', file);

    // Forward request to backend API
    const response = await fetch(`${API_BASE_URL}/resume/upload`, {
      method: 'POST',
      body: backendFormData,
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Resume processing failed' 
        },
        { status: response.status }
      );
    }

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Resume upload API error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error during resume upload' 
      },
      { status: 500 }
    );
  }
}
