import React, { useEffect, useState, useMemo } from "react";
import api from "../lib/api";
import { useSearch } from "../context/SearchContext";
import VideoCard from "../components/VideoCard";

function LikedVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { searchQuery } = useSearch();

  const filteredVideos = useMemo(() => {
    if (!searchQuery) return videos;
    const lowerQuery = searchQuery.toLowerCase();
    return videos.filter((video) => {
      const titleMatch = video.title?.toLowerCase().includes(lowerQuery);
      const ownerMatch =
        video.ownerDetails?.username?.toLowerCase().includes(lowerQuery) ||
        video.owner?.username?.toLowerCase().includes(lowerQuery);
      return titleMatch || ownerMatch;
    });
  }, [videos, searchQuery]);

  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        const res = await api.get("/likes/videos");
        const data = res.data?.data || [];
        // The API might return objects with a 'video' field populated
        // Let's assume the structure is like { _id, video: { ... } } or similar based on typical aggregation
        // If it returns flat videos, great. If not, we map.
        // Based on typical patterns, it's often a list of like documents with a populated 'video' field.
        // Let's verify data structure if possible, but standard is `getLikedVideos` returns `likedVideos` array.
        
        // Flatten if needed: assuming the controller returns the liked video details directly or wrapped.
        // Usually, `getLikedVideos` aggregation pipeline sets `video` field. 
        // We'll handle both cases defensively.
        
        const validVideos = data.map(item => item.video || item).filter(v => v?._id);
        setVideos(validVideos);
      } catch (err) {
        setError("Failed to load liked videos.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedVideos();
  }, []);

  if (loading) return <div className="p-8 text-white">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="w-full bg-[#121212] text-white min-h-screen">
      <div className="p-8">
        <h1 className="mb-6 text-2xl font-bold">Liked Videos</h1>
        {filteredVideos.length === 0 ? (
          <p className="text-gray-400">
            {searchQuery
              ? `No results found for "${searchQuery}"`
              : "You haven't liked any videos yet."}
          </p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4">
            {filteredVideos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LikedVideos;
