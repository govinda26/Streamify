import React, { useEffect, useState, useCallback, useMemo } from "react";
import api from "../lib/api";
import { useSearch } from "../context/SearchContext";
import VideoCard from "../components/VideoCard";

function HomePage() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { searchQuery } = useSearch();

    const filteredVideos = useMemo(() => {
        if (!searchQuery) return videos;
        const lowerQuery = searchQuery.toLowerCase();
        return videos.filter((video) => {
            const titleMatch = video.title?.toLowerCase().includes(lowerQuery);
            const ownerMatch = video.owner?.username?.toLowerCase().includes(lowerQuery) || video.owner?.fullName?.toLowerCase().includes(lowerQuery);
            return titleMatch || ownerMatch;
        });
    }, [videos, searchQuery]);

    const fetchVideos = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            // Fetch all videos (no userId param)
            const response = await api.get("/videos?limit=50&sortBy=createdAt&sortType=desc");
            // The aggregation with $facet returns an array with one object containing the results
            const videoData = response.data?.data?.[0]?.videos || [];
            setVideos(videoData);
        } catch (error) {
            console.error("Error fetching videos:", error);
            setError("Failed to load videos");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchVideos();
    }, [fetchVideos]);

    if (loading) {
        return <div className="flex justify-center p-8 text-white">Loading videos...</div>;
    }

    if (error) {
        return <div className="flex justify-center p-8 text-red-500">{error}</div>;
    }

    if (filteredVideos.length === 0) {
        return (
            <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
                <div className="flex h-full items-center justify-center">
                    <div className="w-full max-w-sm text-center">
                        <p className="mb-3 w-full">
                            <span className="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                    className="w-6">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"></path>
                                </svg>
                            </span>
                        </p>
                        <h5 className="mb-2 font-semibold">No videos available</h5>
                        <p>
                          {searchQuery
                            ? `No results found for "${searchQuery}"`
                            : "There are no videos here available. Please try to search some thing else."}
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
            <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 p-4">
                {filteredVideos.map((video) => (
                    <VideoCard key={video._id} video={video} />
                ))}
            </div>
        </section>
    );
}

export default HomePage;
