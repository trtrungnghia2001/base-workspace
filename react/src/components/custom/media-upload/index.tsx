"use client";

import { useRef, useMemo } from "react";
import { Camera, X, ImagePlus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaUpload } from "./hooks/use-media-upload";

interface MediaUploadProps {
  // Chấp nhận cả string (1 file) hoặc string[] (nhiều file)
  value?: string | string[];
  onChange: (files: File[]) => void;
  onRemove?: (index: number) => void;
  maxFiles?: number;
  mode?: "avatar" | "thumbnail";
  width?: string | number;
  height?: string | number;
  containerClassName?: string;
  mediaClassName?: string;
  isPending?: boolean;
  accept?: string;
  title?: string;
}

export function MediaUpload({
  value,
  onChange,
  onRemove,
  maxFiles = 1,
  mode = "thumbnail",
  width,
  height,
  containerClassName,
  mediaClassName,
  isPending = false,
  accept = "image/*,video/*",
  title,
}: MediaUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  width = width ?? (mode === "avatar" ? 120 : 320);
  height = height ?? (mode === "avatar" ? 120 : 180);

  // Chuẩn hóa value về mảng để Hook xử lý đồng nhất
  const initialValues = useMemo(() => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);

  const { previews, selectedFiles, handleFileChange, removeImage } =
    useMediaUpload({
      initialValues,
      maxFiles,
      onUpdate: (files) => onChange(files),
    });

  const isSingle = maxFiles === 1;

  // Render từng item (ảnh/video)
  const renderMediaItem = (url: string, index: number) => {
    const isVideo = selectedFiles[index]
      ? selectedFiles[index].type.startsWith("video/")
      : url.match(/\.(mp4|webm|ogg|mov|m4v)$/i);

    return (
      <div key={url + index} className="relative">
        <div
          style={isSingle ? { width, height } : {}}
          className={cn(
            "relative group border border-muted overflow-hidden bg-muted/10 transition-all",
            mode === "avatar"
              ? "rounded-full aspect-square"
              : "rounded-xl aspect-video",
            isSingle ? "w-full" : "w-full",
            !isPending && "cursor-pointer",
          )}
          // CLICK VÀO ẢNH THÌ CHỌN FILE (Ý của bro)
          onClick={() => !isPending && fileInputRef.current?.click()}
        >
          {isVideo ? (
            <video
              src={url}
              className={cn("h-full w-full object-cover", mediaClassName)}
              muted
              playsInline
            />
          ) : (
            <img
              src={url}
              alt="Preview"
              className={cn("h-full w-full object-cover", mediaClassName)}
            />
          )}

          {/* Hover Overlay để báo hiệu thay đổi */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all">
            <Camera className="h-6 w-6 text-white mb-1" />
            <span className="text-[10px] text-white font-bold uppercase">
              Change
            </span>
          </div>
        </div>
        {/* Nút Xóa (Nằm tách biệt để không trigger click chọn file) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            removeImage(index);
            onRemove?.(index);
          }}
          className="absolute top-2 right-2 bg-destructive/80 hover:bg-destructive text-white rounded-full p-1 z-20 shadow-sm"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    );
  };

  return (
    <div className={cn("w-max space-y-2", containerClassName)}>
      <div className={cn("flex flex-wrap gap-4")}>
        {/* Render media đã có */}
        {previews.map((url, index) => renderMediaItem(url, index))}

        {/* Nút "Thêm mới" - Chỉ hiện khi chưa đủ maxFiles */}
        {previews.length < maxFiles && (
          <div
            style={isSingle && previews.length === 0 ? { width, height } : {}}
            onClick={() => !isPending && fileInputRef.current?.click()}
            className={cn(
              "flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 cursor-pointer transition-all bg-muted/5",
              mode === "avatar"
                ? "rounded-full aspect-square"
                : "rounded-xl aspect-video",
              isPending && "opacity-50 cursor-not-allowed",
            )}
          >
            {isPending ? (
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            ) : (
              <>
                <ImagePlus className="h-6 w-6 text-muted-foreground" />
                <span className="text-10 font-bold uppercase mt-1 text-muted-foreground">
                  Upload
                </span>
              </>
            )}
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={accept}
        multiple={maxFiles > 1}
        onChange={handleFileChange}
        disabled={isPending}
      />
      {title && (
        <div className="text-muted-foreground font-medium text-center">
          {title}
        </div>
      )}
    </div>
  );
}
