export { default } from 'next-auth/middleware'

export const config = {
  matcher: ['/submit', '/settings/:path*', '/chat/:path*'],
}
