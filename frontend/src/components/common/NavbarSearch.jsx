import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, X } from "lucide-react";
import publicApi from "../../api/publicApi";

export default function NavbarSearch({ onNavigate }) {
    const [query, setQuery] = useState("");
    const [coffees, setCoffees] = useState([]);
    const [machines, setMachines] = useState([]);
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Fetch all data once on mount
    useEffect(() => {
        publicApi.getCoffees().then(setCoffees).catch(() => { });
        publicApi.getMachines().then(setMachines).catch(() => { });
    }, []);

    // Close on click-outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close on Escape
    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key === "Escape") {
                setQuery("");
                setOpen(false);
            }
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    const trimmed = query.trim().toLowerCase();

    const matchedCoffees = useMemo(() => {
        if (trimmed.length < 2) return [];
        return coffees
            .filter((c) =>
                [c.name, c.origin, c.title].some((f) =>
                    (f ?? "").toLowerCase().includes(trimmed)
                )
            )
            .slice(0, 5);
    }, [coffees, trimmed]);

    const matchedMachines = useMemo(() => {
        if (trimmed.length < 2) return [];
        return machines
            .filter((m) =>
                [m.name, m.brand, m.title].some((f) =>
                    (f ?? "").toLowerCase().includes(trimmed)
                )
            )
            .slice(0, 5);
    }, [machines, trimmed]);

    const hasResults = matchedCoffees.length > 0 || matchedMachines.length > 0;
    const showDropdown = open && trimmed.length >= 2;

    function handleResultClick() {
        setQuery("");
        setOpen(false);
        onNavigate?.();
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!trimmed) return;
        // Stay on the current page if it's /machines, otherwise go to /coffees
        const dest = location.pathname.startsWith("/machine") ? "/machines" : "/coffees";
        navigate(`${dest}?q=${encodeURIComponent(trimmed)}`);
        setQuery("");
        setOpen(false);
        onNavigate?.();
    }

    return (
        <div ref={containerRef} style={{ position: "relative" }}>
            <form onSubmit={handleSubmit} style={{ position: "relative" }}>
                <Search
                    size={15}
                    style={{
                        position: "absolute",
                        left: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#9D8E83",
                        pointerEvents: "none",
                    }}
                />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    placeholder="Search coffees & machines…"
                    autoComplete="off"
                    className="font-instrument-sans text-sm text-brown placeholder:text-[#A89B92] bg-[#FAF5F0] border border-[#E6DDD7] rounded-full outline-none transition-all focus:border-[#C4A882] focus:shadow-[0_0_0_3px_rgba(196,168,130,0.15)]"
                    style={{
                        height: 36,
                        width: 220,
                        paddingLeft: 34,
                        paddingRight: query ? 30 : 14,
                    }}
                />
                {query && (
                    <button
                        type="button"
                        onClick={() => { setQuery(""); setOpen(false); inputRef.current?.focus(); }}
                        style={{
                            position: "absolute",
                            right: 10,
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                            display: "flex",
                            alignItems: "center",
                            color: "#9D8E83",
                        }}
                    >
                        <X size={14} />
                    </button>
                )}
            </form>

            {/* Dropdown */}
            {showDropdown && (
                <div
                    style={{
                        position: "absolute",
                        top: "calc(100% + 8px)",
                        left: 0,
                        width: 320,
                        background: "#fff",
                        borderRadius: 14,
                        boxShadow: "0 8px 32px rgba(59,23,13,0.13)",
                        border: "1px solid #F0E6DF",
                        zIndex: 9999,
                        overflow: "hidden",
                    }}
                >
                    {!hasResults ? (
                        <div
                            className="font-instrument-sans text-sm text-[#A89B92]"
                            style={{ padding: "16px 18px" }}
                        >
                            No results for &ldquo;{query}&rdquo;
                        </div>
                    ) : (
                        <>
                            {matchedCoffees.length > 0 && (
                                <section>
                                    <div
                                        className="font-instrument-sans font-semibold text-xs uppercase tracking-widest text-[#A89B92]"
                                        style={{ padding: "10px 18px 6px" }}
                                    >
                                        Coffees
                                    </div>
                                    {matchedCoffees.map((coffee) => (
                                        <Link
                                            key={coffee._id}
                                            to={`/coffees/${coffee._id}`}
                                            onClick={handleResultClick}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 12,
                                                padding: "8px 18px",
                                                textDecoration: "none",
                                                transition: "background 0.15s",
                                            }}
                                            className="hover:bg-[#FAF5F0]"
                                        >
                                            <img
                                                src={coffee.images?.[0] || "/assets/coffee-beans.jpg"}
                                                alt={coffee.name}
                                                style={{
                                                    width: 38,
                                                    height: 38,
                                                    borderRadius: 8,
                                                    objectFit: "cover",
                                                    flexShrink: 0,
                                                    background: "#F0E6DF",
                                                }}
                                            />
                                            <div style={{ minWidth: 0 }}>
                                                <p
                                                    className="font-instrument-sans font-semibold text-sm text-brown"
                                                    style={{
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {coffee.name}
                                                </p>
                                                <p className="font-instrument-sans text-xs text-[#A89B92]">
                                                    {coffee.origin && `${coffee.origin} · `}$
                                                    {coffee.price?.toFixed(2)}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </section>
                            )}

                            {matchedMachines.length > 0 && (
                                <section
                                    style={
                                        matchedCoffees.length > 0
                                            ? { borderTop: "1px solid #F0E6DF" }
                                            : {}
                                    }
                                >
                                    <div
                                        className="font-instrument-sans font-semibold text-xs uppercase tracking-widest text-[#A89B92]"
                                        style={{ padding: "10px 18px 6px" }}
                                    >
                                        Machines
                                    </div>
                                    {matchedMachines.map((machine) => (
                                        <Link
                                            key={machine._id}
                                            to={`/machine/${machine._id}`}
                                            onClick={handleResultClick}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 12,
                                                padding: "8px 18px",
                                                textDecoration: "none",
                                                transition: "background 0.15s",
                                            }}
                                            className="hover:bg-[#FAF5F0]"
                                        >
                                            <img
                                                src={
                                                    machine.images?.[0] ||
                                                    "/assets/columbianbrewcoffee.jpg"
                                                }
                                                alt={machine.name}
                                                style={{
                                                    width: 38,
                                                    height: 38,
                                                    borderRadius: 8,
                                                    objectFit: "cover",
                                                    flexShrink: 0,
                                                    background: "#F0E6DF",
                                                }}
                                            />
                                            <div style={{ minWidth: 0 }}>
                                                <p
                                                    className="font-instrument-sans font-semibold text-sm text-brown"
                                                    style={{
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {machine.name}
                                                </p>
                                                <p className="font-instrument-sans text-xs text-[#A89B92]">
                                                    {machine.brand && `${machine.brand} · `}$
                                                    {machine.price?.toFixed(2)}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </section>
                            )}

                            {/* View all link */}
                            <div
                                style={{
                                    borderTop: "1px solid #F0E6DF",
                                    padding: "10px 18px",
                                    display: "flex",
                                    gap: 12,
                                }}
                            >
                                <Link
                                    to={`/coffees`}
                                    onClick={handleResultClick}
                                    className="font-instrument-sans text-xs text-brown hover:underline"
                                >
                                    All coffees →
                                </Link>
                                <Link
                                    to={`/machines`}
                                    onClick={handleResultClick}
                                    className="font-instrument-sans text-xs text-brown hover:underline"
                                >
                                    All machines →
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
