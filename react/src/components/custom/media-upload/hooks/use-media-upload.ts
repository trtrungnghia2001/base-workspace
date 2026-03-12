import {
  useState,
  useEffect,
  useCallback,
  type ChangeEvent,
  useMemo,
} from "react";

interface UseMediaUploadProps {
  initialValues?: string[] | string;
  maxFiles?: number;
  onUpdate?: (files: File[], previews: string[]) => void;
}

export const useMediaUpload = ({
  initialValues = [],
  maxFiles = 1,
  onUpdate,
}: UseMediaUploadProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // 1. Dùng useMemo để tính toán previews ngay lập tức
  const previews = useMemo(() => {
    // Nếu có file mới được chọn, ưu tiên hiển thị file mới
    if (selectedFiles.length > 0) {
      return selectedFiles.map((file) => URL.createObjectURL(file));
    }

    // Nếu không có file mới, hiển thị ảnh cũ (initialValues) từ server
    if (!initialValues) return [];
    const vals = Array.isArray(initialValues) ? initialValues : [initialValues];
    return vals.filter((v) => typeof v === "string" && v !== "");
  }, [initialValues, selectedFiles]);

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;

      const file = files[0];
      const isVideo = file.type.startsWith("video/");
      const isImage = file.type.startsWith("image/");

      if (!isVideo && !isImage) {
        alert("Unsupported file type!");
        return;
      }

      let updatedFiles: File[];
      if (maxFiles === 1) {
        updatedFiles = [files[0]];
      } else {
        updatedFiles = [...selectedFiles, ...files].slice(0, maxFiles);
      }

      setSelectedFiles(updatedFiles);
      // Tính toán previews sẽ tự chạy lại nhờ useMemo
      onUpdate?.(
        updatedFiles,
        updatedFiles.map((f) => URL.createObjectURL(f)),
      );
    },
    [maxFiles, selectedFiles, onUpdate],
  );

  const removeImage = useCallback(
    (index: number) => {
      const updatedFiles = selectedFiles.filter((_, i) => i !== index);
      setSelectedFiles(updatedFiles);

      // Nếu xóa ảnh cũ (khi chưa chọn file mới), ta cần báo cho Form biết
      if (selectedFiles.length === 0) {
        onUpdate?.([], []);
      } else {
        onUpdate?.(
          updatedFiles,
          updatedFiles.map((f) => URL.createObjectURL(f)),
        );
      }
    },
    [selectedFiles, onUpdate],
  );

  // 2. Dọn dẹp bộ nhớ: Đây là phần quan trọng nhất khi dùng URL.createObjectURL trong useMemo
  useEffect(() => {
    return () => {
      previews.forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [previews]);

  return {
    previews,
    selectedFiles,
    handleFileChange,
    removeImage,
    isMaxed: previews.length >= maxFiles,
  };
};
