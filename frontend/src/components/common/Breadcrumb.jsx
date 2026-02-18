import { useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import { BreadcrumbContext } from "../../contexts/BreadcrumbContext";

export default function Breadcrumb() {
  const location = useLocation();
  const { breadcrumbData } = useContext(BreadcrumbContext);
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Format breadcrumb text
  const formatName = (name) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Map URL segments to their actual navigation routes
  const getRouteLink = (segment, index, fullPathnames) => {
    // For detail pages, return the category page
    if (index === fullPathnames.length - 1) {
      // This is the last segment (the ID)
      if (fullPathnames[0] === "coffees") return "/coffees";
      if (fullPathnames[0] === "machine") return "/machines";
    }
    
    // For category pages
    if (segment === "coffees") return "/coffees";
    if (segment === "machine") return "/machines";
    
    // Default: join the path normally
    return `/${fullPathnames.slice(0, index + 1).join("/")}`;
  };

  // Get breadcrumb display name for segments
  const getBreadcrumbLabel = (segment) => {
    const mapping = {
      coffees: "Coffees",
      machine: "Machines",
      machines: "Machines",
    };
    return mapping[segment] || formatName(segment);
  };

  // Don't show breadcrumb on home page
  if (pathnames.length === 0) {
    return null;
  }

  return (
    <nav className="bg-peach-light/30 py-3 px-4 md:px-8 mt-16 md:mt-24">
      <div className="max-w-7xl mx-auto">
        <ol className="flex items-center gap-2 text-sm md:text-base">
          {/* Home Link */}
          <li>
            <Link
              to="/"
              className="text-brown hover:text-charcoal transition font-instrument-sans"
            >
              Home
            </Link>
          </li>

          {/* Path Segments */}
          {pathnames.map((value, index) => {
            const to = getRouteLink(value, index, pathnames);
            const isLast = index === pathnames.length - 1;

            // Check if this is a detail page (has an ID) and get the custom name from context
            const customName = breadcrumbData[value];
            const displayName = customName || getBreadcrumbLabel(value);

            return (
              <li key={to} className="flex items-center gap-2">
                <span className="text-brown">/</span>
                {isLast ? (
                  <span className="text-charcoal font-semibold font-instrument-sans">
                    {displayName}
                  </span>
                ) : (
                  <Link
                    to={to}
                    className="text-brown hover:text-charcoal transition font-instrument-sans"
                  >
                    {displayName}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
