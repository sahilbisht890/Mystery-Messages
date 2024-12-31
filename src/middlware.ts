import { NextResponse} from 'next/server'
import type { NextRequest } from 'next/server'
export { default } from "next-auth/middleware"
import { getToken } from 'next-auth/jwt'
 
export async function middleware(request: NextRequest) {
    const token = await getToken({req : request})
    const url = request.nextUrl ;
    console.log('url' , url);

    if(token && (url.pathname.startsWith('/sign-in') || url.pathname.startsWith('/sign-up') )) {
          return NextResponse.redirect(new URL('/dashboard',request.url));
    }

  return NextResponse.redirect(new URL('/home', request.url))
}
 
export const config = {
  matcher: ['/sign-in'],
}