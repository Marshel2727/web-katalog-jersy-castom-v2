"use client";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import type { Field } from "./resource-config";

export function FormField({ field, value, onNameChange, onSlugInput, onAutoSlug }: { field: Field; value?: unknown; onNameChange?: (value: string) => void; onSlugInput?: () => void; onAutoSlug?: () => void }) {
  const initial = value ?? field.default ?? (field.type === "checkbox" ? false : "");
  const [color, setColor] = useState(() => String(initial || "#34d399"));
  if (field.type === "checkbox") {
    return (
      <label className="admin-toggle">
        <input type="checkbox" name={field.name} defaultChecked={Boolean(initial)} />
        <span className="admin-toggle-track" aria-hidden="true" />
        <span className="admin-toggle-label">{field.label}</span>
      </label>
    );
  }
  const props = { name: field.name, required: field.required, defaultValue: String(initial), "aria-label": field.label };
  const isSlug = field.name === "slug";
  const isName = field.name === "name";
  return (
    <label className={field.type === "textarea" ? "admin-field-full" : undefined}>
      <span className="admin-label-row">
        <span>{field.label}{field.required && <span className="admin-required"> *</span>}</span>
        {isSlug && onAutoSlug && (
          <button type="button" className="admin-link-btn" onClick={onAutoSlug}>
            <Sparkles size={12} aria-hidden="true" />
            <span>Buat otomatis</span>
          </button>
        )}
      </span>

      {field.type === "textarea" ? (
        <textarea {...props} rows={4} maxLength={5000} placeholder={"Tulis " + field.label.toLowerCase() + "..."} />
      ) : field.type === "select" ? (
        <select {...props}>
          <option value="">Pilih {field.label.toLowerCase()}</option>
          {field.options?.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
        </select>
      ) : field.type === "color" ? (
        <span className="admin-color-picker">
          <input {...props} type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          <code>{color.toUpperCase()}</code>
        </span>
      ) : (
        <input
          {...props}
          type={field.type || "text"}
          min={field.type === "number" ? 0 : undefined}
          max={field.type === "number" ? field.max : undefined}
          maxLength={field.type === "number" ? undefined : field.max}
          pattern={isSlug ? "[a-z0-9]+(-[a-z0-9]+)*" : undefined}
          placeholder={isSlug ? "contoh: jersey-futsal-garuda" : undefined}
          onChange={isName && onNameChange ? (e) => onNameChange(e.target.value) : isSlug && onSlugInput ? () => onSlugInput() : undefined}
        />
      )}
      {isSlug && <small>Gunakan huruf kecil, angka, dan tanda hubung (-).</small>}
    </label>
  );
}

