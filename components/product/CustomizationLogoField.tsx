"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { LogoFieldDef, LogoFieldValue } from "@/lib/customization";
import { uploadCustomizationLogo, validateLogoFile } from "@/lib/customization";

interface CustomizationLogoFieldProps {
  field: LogoFieldDef;
  value?: LogoFieldValue;
  onChange: (value: LogoFieldValue | undefined) => void;
  error?: string;
}

const UPLOAD_OPTION = "__upload__";

export function CustomizationLogoField({
  field,
  value,
  onChange,
  error,
}: CustomizationLogoFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [mode, setMode] = useState<"preset" | "upload">(
    value?.source === "upload" ? "upload" : "preset"
  );

  const presetOptions = field.options ?? [];
  const showPresets = presetOptions.length > 0;
  const showUpload = field.allow_upload !== false;

  const selectedPreset =
    value?.source === "preset" ? value.value : "";

  const handlePresetSelect = (optionValue: string) => {
    setUploadError(null);
    if (optionValue === UPLOAD_OPTION) {
      setMode("upload");
      onChange(undefined);
      inputRef.current?.click();
      return;
    }

    setMode("preset");
    const option = presetOptions.find((opt) => opt.value === optionValue);
    if (!option) return;

    onChange({
      source: "preset",
      value: option.value,
      display: option.label,
      image_url: option.image_url,
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const validationError = validateLogoFile(file, field);
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    setUploadError(null);
    setIsUploading(true);
    try {
      const uploaded = await uploadCustomizationLogo(file);
      setMode("upload");
      onChange({
        source: "upload",
        url: uploaded.url,
        filename: uploaded.filename,
        file_id: uploaded.id,
      });
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Failed to upload logo"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const previewUrl =
    value?.source === "upload"
      ? value.url
      : value?.source === "preset"
        ? value.image_url
        : undefined;

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-white uppercase tracking-wider block">
        {field.label}
        {field.required ? " *" : ""}
      </label>

      {showPresets && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {presetOptions.map((option) => {
            const isSelected =
              mode === "preset" && selectedPreset === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handlePresetSelect(option.value)}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  isSelected
                    ? "border-[var(--color-lime)] bg-[var(--color-lime)]/10"
                    : "border-[var(--color-hairline-violet)] bg-[var(--color-ink-deep)] hover:border-[var(--color-lime)]/40"
                }`}
              >
                {option.image_url ? (
                  <div className="relative h-12 w-full mb-2">
                    <Image
                      src={option.image_url}
                      alt={option.label}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                ) : null}
                <span className="text-sm text-white">{option.label}</span>
              </button>
            );
          })}

          {showUpload && (
            <button
              type="button"
              onClick={() => handlePresetSelect(UPLOAD_OPTION)}
              disabled={isUploading}
              className={`rounded-lg border p-3 text-left transition-colors ${
                mode === "upload"
                  ? "border-[var(--color-lime)] bg-[var(--color-lime)]/10"
                  : "border-[var(--color-hairline-violet)] bg-[var(--color-ink-deep)] hover:border-[var(--color-lime)]/40"
              }`}
            >
              <span className="text-sm text-white">
                {isUploading ? "Uploading..." : "Upload your own"}
              </span>
            </button>
          )}
        </div>
      )}

      {!showPresets && showUpload && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="w-full rounded-lg border border-dashed border-[var(--color-hairline-violet)] bg-[var(--color-ink-deep)] px-4 py-6 text-sm text-white hover:border-[var(--color-lime)]/40 transition-colors"
        >
          {isUploading ? "Uploading..." : "Choose logo file"}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={(field.accept ?? ["image/png", "image/svg+xml", "image/jpeg"]).join(",")}
        className="hidden"
        onChange={handleFileChange}
      />

      {previewUrl && (
        <div className="flex items-center gap-3 rounded-lg border border-[var(--color-hairline-violet)] bg-[var(--color-ink-deep)] p-3">
          <div className="relative h-12 w-12 flex-shrink-0">
            <Image
              src={previewUrl}
              alt="Selected logo preview"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-white truncate">
              {value?.source === "upload"
                ? value.filename
                : value?.source === "preset"
                  ? value.display
                  : "Selected logo"}
            </p>
            <p className="text-xs text-[var(--color-on-dark-muted)]">
              {value?.source === "upload" ? "Custom upload" : "Preset logo"}
            </p>
          </div>
        </div>
      )}

      {field.helper && (
        <p className="text-xs text-[var(--color-on-dark-muted)]">{field.helper}</p>
      )}
      {(error || uploadError) && (
        <p className="text-xs text-red-400">{error ?? uploadError}</p>
      )}
    </div>
  );
}
