"use client";
import { useEffect, useRef, useState } from "react";
import { ApiError } from "./http";
import type { Page, Query } from "./types";
export function usePage<T>(load: (query: Query, signal: AbortSignal) => Promise<Page<T>>, query: Query, initial?: Page<T>) {
  const [result, setResult] = useState<Page<T> | undefined>(initial);
  const [loading, setLoading] = useState(!initial);
  const [error, setError] = useState<ApiError | null>(null);
  const [revision, setRevision] = useState(0);
  const first = useRef(true);
  const key = JSON.stringify(query);
  useEffect(() => {
    if (first.current && initial && revision === 0) { first.current = false; return; }
    first.current = false;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true); setError(null);
      try { const response = await load(JSON.parse(key), controller.signal); if (!controller.signal.aborted) setResult(response); }
      catch (error) { if (!controller.signal.aborted) setError(error instanceof ApiError ? error : new ApiError("Data belum dapat dimuat.", 0)); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    }, 250);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [key, load, revision, initial]);
  return { result, loading, error, reload: () => setRevision((value) => value + 1) };
}
