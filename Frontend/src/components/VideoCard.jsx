import React from "react";
import { Link } from "react-router-dom";
import { formatDuration, formatTimeAgo, formatViews } from "../utils/format";

function VideoCard({ video }) {
    if (!video) return null;
    
    const { _id, title, thumbnail, duration, views, createdAt, owner, ownerDetails } = video;
    
    // Handle differences in owner population (some APIs return owner object, some return ownerDetails, some return just ID)
    // We prioritize populated objects.
    const ownerData = ownerDetails || (typeof owner === 'object' ? owner : null);
    
    const avatar = ownerData?.avatar || "https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
    const username = ownerData?.username || ownerData?.fullName || "User";
    const channelId = ownerData?._id || (typeof owner === 'string' ? owner : "");

    return (
        <div className="w-full">
            <Link to={`/video/${_id}`}>
                <div className="relative mb-2 w-full pt-[56%] bg-neutral-900 rounded-lg overflow-hidden group">
                     {/* Thumbnail */}
                    <div className="absolute inset-0">
                        <img
                            src={thumbnail}
                            alt={title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                        />
                    </div>
                     {/* Duration Badge */}
                    <span className="absolute bottom-1 right-1 inline-block rounded bg-black/80 px-1.5 py-0.5 text-xs text-white">
                        {formatDuration(duration)}
                    </span>
                </div>
            </Link>

            {/* Metadata Section */}
            <div className="flex gap-x-3 items-start">
                {/* Channel Avatar */}
                <div className="h-9 w-9 shrink-0">
                    <Link to={channelId ? `/channel/id/${channelId}` : "#"}>
                        <img
                            src={avatar}
                            alt={username}
                            className="h-full w-full rounded-full object-cover"
                        />
                    </Link>
                </div>

                {/* Info */}
                <div className="flex flex-col">
                    <Link to={`/video/${_id}`}>
                        <h3 className="line-clamp-2 text-sm font-semibold text-white leading-tight mb-0.5" title={title}>
                            {title}
                        </h3>
                    </Link>
                    
                    <Link to={channelId ? `/channel/id/${channelId}` : "#"} className="text-xs text-gray-400 hover:text-white transition-colors">
                        {username}
                    </Link>
                    
                    <div className="text-xs text-gray-400 flex items-center mt-0.5">
                         <span>{formatViews(views)}</span>
                         <span className="mx-1">•</span>
                         <span>{formatTimeAgo(createdAt)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VideoCard;
