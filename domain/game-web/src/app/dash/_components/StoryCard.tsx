import Link from "next/link";

type StoryCardProps = {
  id: string;
  title: string;
  excerpt: string;
  attribution: string;
  image: string;
  href: string;
  footer: {
    left: string;
    right?: string;
  };
};

/**
 * Reusable story card with image, title, excerpt quote, and attribution.
 * Used for both completed stories (Discover) and live stories (Guide).
 */
export function StoryCard(props: StoryCardProps) {
  return (
    <Link
      href={props.href}
      className="relative overflow-hidden rounded-xl transition-all cursor-pointer group h-[500px] block"
    >
      {/* Background image - visible throughout */}
      <img
        src={props.image}
        alt={props.title}
        className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-80 transition-opacity"
      />

      {/* Title at top with dark mask behind it */}
      <div className="absolute top-0 left-0 right-0">
        <div className="bg-gradient-to-b from-slate-950/90 to-transparent pb-8">
          <div className="p-8 pb-0">
            <h3 className="font-serif text-3xl font-semibold text-white group-hover:text-amber-400 transition">
              {props.title}
            </h3>
          </div>
        </div>
      </div>

      {/* Quote and footer at bottom with gradient mask */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 via-40% to-transparent pointer-events-none" />

      <div className="absolute bottom-0 left-0 right-0 p-8">
        {/* Excerpt as blockquote with attribution */}
        <blockquote className="mb-6">
          <p className="font-serif text-base text-slate-100 leading-relaxed line-clamp-5 mb-4">
            &ldquo;{props.excerpt}&rdquo;
          </p>
          <footer className="font-sans text-sm text-amber-400 tracking-wide">
            — {props.attribution}
          </footer>
        </blockquote>

        {/* Footer with meta info */}
        <div className="flex items-center justify-between font-sans text-sm pt-4 border-t border-slate-700/50">
          <span className="text-slate-400">{props.footer.left}</span>
          {props.footer.right && (
            <span className="text-slate-600 text-xs">{props.footer.right}</span>
          )}
        </div>
      </div>
    </Link>
  );
}