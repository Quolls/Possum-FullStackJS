import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Swiper from "@/components/swiper/Swiper"; // 确保路径正确
import { Button } from "@/components/ui";

interface FileUploaderProps {
  fieldChange: (files: File[]) => void; // 用于处理文件上传的回调
  mediaUrl?: string; // 可选的，用于显示已有图片的URL
}

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  const [fileUrls, setFileUrls] = useState<string[]>(
    mediaUrl ? [mediaUrl] : []
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFileUrls = acceptedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setFileUrls((prevUrls) => [...prevUrls, ...newFileUrls]);
      fieldChange(acceptedFiles); // 注意：这里应该触发实际的文件上传逻辑
    },
    [fieldChange]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
    },
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer">
      <input {...getInputProps()} className="cursor-pointer" />
      {fileUrls.length > 0 ? (
        <Swiper>
          {fileUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Preview ${index}`}
              className="file_uploader-img"
            />
          ))}
        </Swiper>
      ) : (
        <div className="file_uploader-box">
          <img
            src="/assets/icons/file-upload.svg"
            width={96}
            height={77}
            alt="file upload"
          />
          <h3 className="base-medium text-light-2 mb-2 mt-6">
            Drag photo here
          </h3>
          <p className="text-light-4 small-regular mb-6">SVG, PNG, JPG</p>
          <Button type="button" className="shad-button_dark_4">
            Select from computer
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
