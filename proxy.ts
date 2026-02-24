// const PRIVATE_ROUTES = ["/dashboard"];

export function proxy() {
  // const response = NextResponse.next();
  // const session = getSession();
  // if (!session && PRIVATE_ROUTES.some((route) => request.url.includes(route)))
  //   redirect(ROUTES.LOGIN);
  // return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
