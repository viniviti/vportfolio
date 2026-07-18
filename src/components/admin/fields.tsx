"use client";

import { useRef, useState } from "react";

export function Field({
  label,
  value,
  onChange,
  placeholder,
  mono,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  mono?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-muted">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-sm text-fg outline-none transition-colors focus:border-violet ${
          mono ? "font-mono" : ""
        }`}
      />
    </label>
  );
}

export function Area({
  label,
  value,
  onChange,
  rows = 3,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-muted">
        {label}
        {hint ? <span className="ml-2 normal-case text-faint">{hint}</span> : null}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full resize-y rounded-lg border border-line bg-bg px-3 py-2.5 text-sm leading-relaxed text-fg outline-none transition-colors focus:border-violet"
      />
    </label>
  );
}

/** Edita array de strings (uma por linha). */
export function ListArea({
  label,
  values,
  onChange,
  rows = 4,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  rows?: number;
}) {
  return (
    <Area
      label={label}
      hint="(uma por linha)"
      rows={rows}
      value={values.join("\n")}
      onChange={(v) => onChange(v.split("\n").map((s) => s.trim()).filter(Boolean))}
    />
  );
}

export function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-muted">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-sm text-fg outline-none focus:border-violet"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const upload = async (file: File) => {
    setBusy(true);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) setErr(data.error || "Falha no upload.");
      else onChange(data.url);
    } catch {
      setErr("Erro de conexão.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-muted">
        {label}
      </span>
      <div className="flex items-start gap-3">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-line bg-bg">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center font-mono text-[10px] text-faint">
              sem img
            </div>
          )}
        </div>
        <div className="flex-1">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://… ou faça upload →"
            className="w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-sm text-fg outline-none focus:border-violet"
          />
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="rounded-md border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-violet hover:text-fg disabled:opacity-50"
            >
              {busy ? "Enviando…" : "Upload"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="text-xs text-faint hover:text-red-400"
              >
                remover
              </button>
            )}
            {err && <span className="text-xs text-red-400">{err}</span>}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
              e.target.value = "";
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function RepeaterItem({
  title,
  onRemove,
  onUp,
  onDown,
  children,
}: {
  title: string;
  onRemove: () => void;
  onUp?: () => void;
  onDown?: () => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-xl border border-line bg-bg/40">
      <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-2.5">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 text-sm font-medium text-fg"
        >
          <span className={`text-faint transition-transform ${open ? "rotate-90" : ""}`}>›</span>
          {title || "sem título"}
        </button>
        <div className="flex items-center gap-1 text-faint">
          {onUp && (
            <button type="button" onClick={onUp} className="px-1.5 hover:text-fg" aria-label="Subir">
              ↑
            </button>
          )}
          {onDown && (
            <button type="button" onClick={onDown} className="px-1.5 hover:text-fg" aria-label="Descer">
              ↓
            </button>
          )}
          <button
            type="button"
            onClick={onRemove}
            className="px-1.5 text-xs hover:text-red-400"
            aria-label="Remover"
          >
            ✕
          </button>
        </div>
      </div>
      {open && <div className="space-y-3 p-4">{children}</div>}
    </div>
  );
}
