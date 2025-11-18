import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/api";

function VideoPlayer() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api
      .get(`/videos/${id}`)
      .then((res) => {
        if (!isMounted) return;
        setVideo(res.data?.data || res.data);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err?.response?.data?.message || err.message || "Failed to load video");
      })
      .finally(() => isMounted && setLoading(false));
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) return <div className="p-6 text-sm text-neutral-400">Loading…</div>;
  if (error) return <div className="p-6 text-sm text-red-400">{error}</div>;
  if (!video) return <div className="p-6">Not found</div>;

  return (
    <div className="space-y-4 p-6">
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-neutral-900">
        {video?.videoFile?.url ? (
          <video src={video.videoFile.url} className="h-full w-full" controls />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-500">No video source</div>
        )}
      </div>
      <div>
        <h1 className="text-xl font-semibold">{video.title}</h1>
        {video.description ? (
          <p className="mt-2 whitespace-pre-wrap text-sm text-neutral-300">{video.description}</p>
        ) : null}
      </div>
    </div>
  );
}

export default VideoPlayer;











