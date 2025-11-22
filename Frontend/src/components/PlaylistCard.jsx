import React from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

function PlaylistCard({ playlist, channelId }) {
    const { _id, name, description, totalVideos, playlistThumbnail, updatedAt } =
        playlist;

    return (
        <Link
            to={`/channel/${channelId}/playlist/${_id}`}
            className="w-full"
        >
            <div className="relative mb-2 w-full pt-[56%]">
                <div className="absolute inset-0">
                    <img
                        src={
                            playlistThumbnail ||
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
            <p className="flex text-sm text-gray-200 line-clamp-2">{description}</p>
        </Link>
    );
}

export default PlaylistCard;
