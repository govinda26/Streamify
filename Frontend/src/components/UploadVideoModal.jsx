import React from "react";

function UploadVideoModal({
  isOpen,
  onClose,
  videoFile,
  thumbnailFile,
  title,
  description,
  setVideoFile,
  setThumbnailFile,
  setTitle,
  setDescription,
  onSave,
  uploading,
  uploadError,
  uploadProgress,
}) {
  if (!isOpen) return null;

  const handleOverlayClick = () => {
    if (!uploading) {
      onClose();
    }
  };

  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center text-white"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 z-10 bg-black/50 px-4 pb-[86px] pt-4 sm:px-14 sm:py-8"
        onClick={stopPropagation}
      >
        <div className="h-full overflow-auto border bg-[#121212]">
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-xl font-semibold">Upload Videos</h2>
            <button
              type="button"
              onClick={onSave}
              disabled={uploading}
              className="group/btn bg-[#ae7aff] px-3 py-2 font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading ? "Saving..." : "Save"}
            </button>
          </div>

          {uploadError ? (
            <div className="border-b border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {uploadError}
            </div>
          ) : null}

          {typeof uploadProgress === "number" ? (
            <div className="border-b border-white/10 px-4 py-2 text-sm text-gray-300">
              Uploading… {uploadProgress}%
            </div>
          ) : null}

          <div className="mx-auto flex w-full max-w-3xl flex-col gap-y-4 p-4">
            <div className="w-full border-2 border-dashed px-4 py-12 text-center">
              <span className="mb-4 inline-block w-24 rounded-full bg-[#E4D3FF] p-4 text-[#AE7AFF]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="h-16 w-16 mx-auto text-[#AE7AFF]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </span>
              <h6 className="mb-2 font-semibold">
                Drag and drop video files to upload
              </h6>
              <p className="text-gray-400">
                Your videos will be private until you publish them.
              </p>
              <label
                htmlFor="upload-video"
                className="group/btn mt-4 inline-flex cursor-pointer bg-[#ae7aff] px-3 py-2 font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none"
              >
                <input
                  type="file"
                  id="upload-video"
                  className="sr-only"
                  accept="video/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0] || null;
                    setVideoFile(file);
                  }}
                />
                Select Files
              </label>
              {videoFile ? (
                <p className="mt-2 text-sm text-gray-300">{videoFile.name}</p>
              ) : null}
            </div>

            <div className="w-full">
              <label htmlFor="thumbnail">
                Thumbnail <sup>*</sup>
              </label>
              <input
                type="file"
                id="thumbnail"
                className="w-full border p-1 file:bg-[#ae7aff] file:px-3 file:py-1.5"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0] || null;
                  setThumbnailFile(file);
                }}
              />
              {thumbnailFile ? (
                <p className="mt-1 text-sm text-gray-300">{thumbnailFile.name}</p>
              ) : null}
            </div>

            <div className="w-full">
              <label htmlFor="title">
                Title <sup>*</sup>
              </label>
              <input
                type="text"
                id="title"
                className="w-full border bg-transparent px-2 py-1 outline-none"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>

            <div className="w-full">
              <label htmlFor="desc">
                Description <sup>*</sup>
              </label>
              <textarea
                id="desc"
                className="h-40 w-full resize-none border bg-transparent px-2 py-1 outline-none"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadVideoModal;

