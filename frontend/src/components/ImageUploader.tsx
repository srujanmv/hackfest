"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export function ImageUploader({
  busy,
  imageUrl,
  hint,
  onUpload
}: {
  busy: boolean;
  imageUrl?: string;
  hint?: string;
  onUpload: (file: File) => Promise<void> | void;
}) {
  const ref = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string>("");

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={ref}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            setFileName(f.name);
            await onUpload(f);
          }}
        />
        <button
          onClick={() => ref.current?.click()}
          disabled={busy}
          className="rounded-xl bg-secondary/20 px-4 py-2 text-sm font-semibold text-white shadow-glowStrong transition hover:bg-secondary/25 disabled:opacity-50"
        >
          {busy ? "Processing..." : "Upload image"}
        </button>
        <div className="text-xs text-white/60">
          {fileName ? `Selected: ${fileName}` : hint ?? ""}
        </div>
      </div>

      {imageUrl ? (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
          <Image
            src={imageUrl}
            alt="Uploaded verification"
            width={900}
            height={520}
            className="h-52 w-full object-cover"
          />
        </div>
      ) : (
        <div className="grid h-52 place-items-center rounded-2xl border border-dashed border-white/15 bg-black/20 text-sm text-white/55">
          Upload an image to verify the issue.
        </div>
      )}
    </div>
  );
}

