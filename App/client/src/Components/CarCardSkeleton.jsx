// src/app/components/CarCardSkeleton.jsx
// Skeleton loader: Doherty Threshold (<400ms perceived response)
// Uses CSS-only shimmer — no JS, no layout thrashing

export default function CarCardSkeleton() {
    return (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
            {/* Image placeholder — aspect-ratio reserves space, prevents CLS */}
            <div className="skeleton" style={{ aspectRatio: "4/3", width: "100%" }} />

            <div className="p-4 flex flex-col gap-3">
                {/* Title */}
                <div className="skeleton h-5 rounded-md w-3/4" />
                {/* Price */}
                <div className="skeleton h-6 rounded-md w-1/2" />
                {/* Tags */}
                <div className="flex gap-2">
                    <div className="skeleton h-6 rounded-md w-16" />
                    <div className="skeleton h-6 rounded-md w-20" />
                    <div className="skeleton h-6 rounded-md w-14" />
                </div>
                {/* Location */}
                <div className="skeleton h-4 rounded-md w-1/3 mt-2" />
            </div>
        </div>
    );
}