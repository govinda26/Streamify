import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";

const formatTimeAgo = (value) => {
  if (!value) return "";
  const date = new Date(value);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const minutes = Math.round(diff / (1000 * 60));
  const hours = Math.round(diff / (1000 * 60 * 60));
  const days = Math.round(diff / (1000 * 60 * 60 * 24));
  
  if (Math.abs(days) < 30) return rtf.format(days, "day");
  const months = Math.round(diff / (1000 * 60 * 60 * 24 * 30));
  if (Math.abs(months) < 12) return rtf.format(months, "month");
  const years = Math.round(diff / (1000 * 60 * 60 * 24 * 365));
  return rtf.format(years, "year");
};

function MyPlaylists() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await api.get("/playlist/user");
        setPlaylists(res.data?.data || []);
      } catch (err) {
        setError("Failed to load collections.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  if (loading) return <div className="p-8 text-white">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="w-full bg-[#121212] text-white min-h-screen">
      <div className="p-8">
        <h1 className="mb-6 text-2xl font-bold">My Collections</h1>
        {playlists.length === 0 ? (
          <p className="text-gray-400">You haven't created any playlists yet.</p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4">
            {playlists.map((playlist) => (
              <div key={playlist._id} className="w-full">
                <Link to={`/channel/${playlist.owner}/playlist/${playlist._id}`}>
                  <div className="relative mb-2 w-full pt-[56%] bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-[#ae7aff] transition-colors">
                    <div className="absolute inset-0 flex items-center justify-center">
                        {/* Placeholder or first video thumbnail could go here if available */}
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </div>
                  </div>
                </Link>
                <div>
                    <h6 className="mb-1 font-semibold">{playlist.name}</h6>
                    <p className="text-sm text-gray-400">
                      {playlist.description || "No description"}
                    </p>
                     <p className="text-xs text-gray-500 mt-1">
                      Updated {formatTimeAgo(playlist.updatedAt)}
                    </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyPlaylists;
