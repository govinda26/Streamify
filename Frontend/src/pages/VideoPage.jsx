import React, { useMemo } from "react";

function VideoPage() {
  // Placeholder list; when populated, the grid will render videos instead of the empty state
  const videos = useMemo(() => [], []);

  return (
    <div className="h-screen overflow-y-auto bg-[#121212] text-white">
      {/* Header (sticky) - using the exact navbar structure provided, with JSX className */}
      <header className="sticky inset-x-0 top-0 z-50 w-full border-b border-white bg-[#121212] px-4">
        <nav className="mx-auto flex max-w-7xl items-center py-2">
          <div className="mr-4 w-12 shrink-0 sm:w-16">
            {" "}
            ... [SVG logo same as before] ...{" "}
          </div>
          <div className="relative mx-auto hidden w-full max-w-md overflow-hidden sm:block">
            <input
              className="w-full border bg-transparent py-1 pl-8 pr-3 placeholder-white outline-none sm:py-2"
              placeholder="Search"
            />
            <span className="absolute left-2.5 top-1/2 inline-block -translate-y-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
                className=" h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                ></path>
              </svg>
            </span>
          </div>
        </nav>
      </header>

      {/* Content */}
      {videos.length === 0 ? (
        <main className="flex flex-col items-center justify-center py-20">
          <h2 className="text-2xl font-semibold text-gray-200 mb-4">
            No videos yet
          </h2>
          <p className="text-gray-400 mb-6">
            Once you upload or like a video, it will appear here.
          </p>
          <button className="bg-[#ae7aff] text-black px-5 py-2 rounded-lg hover:bg-[#9a66ff]">
            Upload Video
          </button>
        </main>
      ) : (
        <main className="mx-auto max-w-7xl px-4 py-6">
          {/* Responsive grid for future videos */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {videos.map((video) => (
              <div key={video.id} className="rounded bg-[#1a1a1a] p-3">
                {/* Replace with your actual VideoCard component if desired */}
                <div className="aspect-video w-full rounded bg-black/40" />
                <div className="mt-2 text-sm text-gray-200 line-clamp-2">
                  {video.title}
                </div>
              </div>
            ))}
          </div>
        </main>
      )}
    </div>
  );
}

export default VideoPage;
