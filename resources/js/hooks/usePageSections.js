import { useEffect, useState } from "react";

/**
 * Fetch page sections and return them keyed by sectionKey.
 * Falls back to empty object on error so pages keep rendering.
 */
export function usePageSections(page) {
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/page-sections?page=${encodeURIComponent(page)}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || !Array.isArray(data)) return;
        const keyed = {};
        for (const s of data) {
          keyed[s.sectionKey] = s;
        }
        setSections(keyed);
      })
      .catch(() => {
        if (!cancelled) setSections({});
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page]);

  return { sections, loading };
}

export function sectionOr(fallback, section) {
  if (!section) return fallback;
  return {
    eyebrow: section.eyebrow ?? fallback.eyebrow ?? "",
    title: section.title ?? fallback.title ?? "",
    body: section.body ?? fallback.body ?? "",
    bodySecondary: section.bodySecondary ?? fallback.bodySecondary ?? "",
    imageUrl: section.imageUrl ?? fallback.imageUrl ?? "",
    ctaLabel: section.ctaLabel ?? fallback.ctaLabel ?? "",
    ctaHref: section.ctaHref ?? fallback.ctaHref ?? "",
    ctaSecondaryLabel:
      section.ctaSecondaryLabel ?? fallback.ctaSecondaryLabel ?? "",
    ctaSecondaryHref:
      section.ctaSecondaryHref ?? fallback.ctaSecondaryHref ?? "",
    meta: { ...(fallback.meta || {}), ...(section.meta || {}) },
  };
}
