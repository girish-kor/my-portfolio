import type { Route } from "../+types/root";

export async function loader({ request }: Route.LoaderArgs) {
  // Return 404 for favicon and other static assets that shouldn't be routed
  if (request.url.includes("/favicon.ico") || request.url.includes(".ico")) {
    return new Response(null, { status: 404 });
  }
  
  // For other 404s, render the error page
  throw new Response("Not Found", { status: 404 });
}

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center text-center p-8">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-slate-600">The page you are looking for could not be found.</p>
    </main>
  );
}
