import { NextResponse } from 'next/server';
import { getGreeting } from '@/lib/edge-config';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const errorType = searchParams.get('error');
    
    const greeting = await getGreeting();
    
    if (errorType === 'not_found') {
      return NextResponse.json({ 
        error: 'Greeting not found in Edge Config',
        timestamp: new Date().toISOString(),
        debug: {
          hasEdgeConfig: !!process.env.EDGE_CONFIG,
          errorType
        }
      }, { status: 404 });
    }
    
    if (errorType === 'server_error') {
      return NextResponse.json({ 
        error: 'Server error accessing Edge Config',
        timestamp: new Date().toISOString(),
        debug: {
          hasEdgeConfig: !!process.env.EDGE_CONFIG,
          errorType
        }
      }, { status: 500 });
    }
    
    if (greeting) {
      return NextResponse.json({ 
        success: true,
        greeting,
        timestamp: new Date().toISOString(),
        source: 'edge-config',
        debug: {
          hasEdgeConfig: !!process.env.EDGE_CONFIG,
          connectionStringLength: process.env.EDGE_CONFIG?.length || 0
        }
      });
    } else {
      return NextResponse.json({ 
        error: 'Greeting not found in Edge Config',
        timestamp: new Date().toISOString(),
        debug: {
          hasEdgeConfig: !!process.env.EDGE_CONFIG,
          connectionStringLength: process.env.EDGE_CONFIG?.length || 0
        }
      }, { status: 404 });
    }
  } catch (error) {
    console.error('API Welcome error:', error);
    return NextResponse.json({ 
      error: 'Failed to retrieve greeting from Edge Config',
      timestamp: new Date().toISOString(),
      debug: {
        hasEdgeConfig: !!process.env.EDGE_CONFIG,
        error: error instanceof Error ? error.message : String(error)
      }
    }, { status: 500 });
  }
}