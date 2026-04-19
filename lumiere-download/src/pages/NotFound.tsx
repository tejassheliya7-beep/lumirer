import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">Lumière</p>
      <h1 className="text-8xl font-light text-foreground mb-2">404</h1>
      <p className="text-xl text-muted-foreground mb-2">Page Not Found</p>
      <p className="text-sm text-muted-foreground mb-8 max-w-md">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild className="bg-foreground text-background hover:bg-foreground/90">
          <Link to="/">Return to Home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/collection/all">Browse Collections</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
