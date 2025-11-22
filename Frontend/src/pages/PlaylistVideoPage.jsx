import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import api from "../lib/api";

function PlaylistVideoPage() {
    const { playlistId } = useParams();
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (playlistId) {
            fetchPlaylistDetails();
        }
    }, [playlistId]);

    const fetchPlaylistDetails = async () => {
        try {
            const response = await api.get(`/playlist/${playlistId}/details`);
            setPlaylist(response.data.data);
        } catch (error) {
            console.error("Error fetching playlist details:", error);
            setError("Failed to load playlist details");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center text-white pt-20">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 pt-20">{error}</div>;
    }

    if (!playlist) {
        return <div className="text-center text-white pt-20">Playlist not found</div>;
    }

    const { name, description, videos, owner, totalVideos, updatedAt } = playlist;

    return (
        <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
            <div className="flex flex-wrap gap-x-4 gap-y-10 p-4 xl:flex-nowrap">
                <div className="w-full shrink-0 sm:max-w-md xl:max-w-sm">
                    <div className="relative mb-2 w-full pt-[56%]">
                        <div className="absolute inset-0">
                            <img
                                src={
                                    videos[0]?.thumbnail ||
                                    "https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                }
                                alt={name}
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-x-0 bottom-0">
                                <div className="relative border-t bg-white/30 p-4 text-white backdrop-blur-sm before:absolute before:inset-0 before:bg-black/40">
                                    <div className="relative z-[1]">
                                        <p className="flex justify-between">
                                            <span className="inline-block">Playlist</span>
                                            <span className="inline-block">{totalVideos} videos</span>
                                        </p>
                                        <p className="text-sm text-gray-200">
                                            100K Views · {formatDistanceToNow(new Date(updatedAt))} ago
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h6 className="mb-1 font-semibold text-white">{name}</h6>
                    <p className="flex text-sm text-gray-200">{description}</p>
                    <div className="mt-6 flex items-center gap-x-3">
                        <div className="h-16 w-16 shrink-0">
                            <img
                                src={owner?.avatar}
                                alt={owner?.username}
                                className="h-full w-full rounded-full object-cover"
                            />
                        </div>
                        <div className="w-full">
                            <h6 className="font-semibold text-white">{owner?.fullName}</h6>
                            <p className="text-sm text-gray-300">
                                {owner?.subscribersCount || 0} Subscribers
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex w-full flex-col gap-y-4">
                    {videos.map((video) => (
                        <div key={video._id} className="border border-gray-700 rounded-lg overflow-hidden">
                            <Link
                                to={`/video/${video._id}`}
                                className="w-full max-w-3xl gap-x-4 sm:flex"
                            >
                                <div className="relative mb-2 w-full sm:mb-0 sm:w-5/12">
                                    <div className="w-full pt-[56%]">
                                        <div className="absolute inset-0">
                                            <img
                                                src={video.thumbnail}
                                                alt={video.title}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm text-white">
                                            {Math.floor(video.duration / 60)}:
                                            {String(Math.floor(video.duration % 60)).padStart(2, "0")}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-x-2 px-2 sm:w-7/12 sm:px-0 py-2">
                                    <div className="h-10 w-10 shrink-0 sm:hidden">
                                        <img
                                            src={video.owner?.avatar}
                                            alt={video.owner?.username}
                                            className="h-full w-full rounded-full object-cover"
                                        />
                                    </div>
                                    <div className="w-full">
                                        <h6 className="mb-1 font-semibold text-white sm:max-w-[75%] line-clamp-2">
                                            {video.title}
                                        </h6>
                                        <p className="flex text-sm text-gray-200 sm:mt-3">
                                            {video.views} Views ·{" "}
                                            {formatDistanceToNow(new Date(video.createdAt))} ago
                                        </p>
                                        <div className="flex items-center gap-x-4 mt-2">
                                            <div className="hidden h-10 w-10 shrink-0 sm:block">
                                                <img
                                                    src={video.owner?.avatar}
                                                    alt={video.owner?.username}
                                                    className="h-full w-full rounded-full object-cover"
                                                />
                                            </div>
                                            <p className="text-sm text-gray-200">
                                                {video.owner?.fullName}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default PlaylistVideoPage;
