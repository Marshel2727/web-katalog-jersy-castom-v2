import { ApiError } from "@/lib/api/http";
export function ErrorMessage({ error }: { error: Error | null }) {
  if (!error) return null;
  const errors = error instanceof ApiError ? error.errors : {};
  return <div className="admin-alert admin-alert-error" role="alert"><p>{error.message}</p>
    {Object.keys(errors).length > 0 && <ul>{Object.entries(errors).map(([field, messages]) => <li key={field}>{messages.join(" ")}</li>)}</ul>}
  </div>;
}
