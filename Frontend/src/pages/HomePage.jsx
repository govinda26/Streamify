import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";

const formatDuration = (seconds) => {
    if (seconds === undefined || seconds === null) return "";
    const totalSeconds = Math.max(0, Math.round(Number(seconds)));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hours > 0) {
        return [hours, minutes, secs]
            .map((val) => String(val).padStart(2, "0"))
            .join(":");
    }
    return [minutes, secs].map((val) => String(val).padStart(2, "0")).join(":");
};

const formatTimeAgo = (value) => {
    if (!value) return "";
    const date = new Date(value);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    const minutes = Math.round(diff / (1000 * 60));
    const hours = Math.round(diff / (1000 * 60 * 60));
    const days = Math.round(diff / (1000 * 60 * 60 * 24));
    const months = Math.round(diff / (1000 * 60 * 60 * 24 * 30));
    const years = Math.round(diff / (1000 * 60 * 60 * 24 * 365));

    if (Math.abs(minutes) < 60) return rtf.format(minutes, "minute");
    if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
    if (Math.abs(days) < 30) return rtf.format(days, "day");
    if (Math.abs(months) < 12) return rtf.format(months, "month");
    return rtf.format(years, "year");
};

function HomePage() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

    if (videos.length === 0) {
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
                        <p>There are no videos here available. Please try to search some thing else.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
            <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 p-4">
                {videos.map((video) => (
                    <div key={video._id} className="w-full">
                        <Link to={`/video/${video._id}`}>
                            <div className="relative mb-2 w-full pt-[56%]">
                                <div className="absolute inset-0">
                                    <img
                                        src={video.thumbnail}
                                        alt={video.title}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
                                    {formatDuration(video.duration)}
                                </span>
                            </div>
                        </Link>

                        <div className="flex gap-x-2">
                            <div className="h-10 w-10 shrink-0">
                                <Link to={`/channel/id/${video.owner?._id}`}>
                                    <img
                                        src={
                                            video.owner?.avatar ||
                                            "https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                        }
                                        alt={video.owner?.username}
                                        className="h-full w-full rounded-full object-cover"
                                    />
                                </Link>
                            </div>
                            <div className="w-full">
                                <Link to={`/video/${video._id}`}>
                                    <h6 className="mb-1 font-semibold">{video.title}</h6>
                                </Link>
                                <p className="flex text-sm text-gray-200">
                                    {video.views} views • {formatTimeAgo(video.createdAt)}
                                </p>
                                <Link to={`/channel/id/${video.owner?._id}`}>
                                    <p className="text-sm text-gray-200">
                                        {video.owner?.fullName || video.owner?.username}
                                    </p>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default HomePage;
