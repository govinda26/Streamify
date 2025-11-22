import React, { useState } from "react";
import api from "../lib/api";

function SubscribedItem({ subscriber, currentUserId }) {
    // subscriber prop contains the channel details
    // The API returns an object where we need to find the channel info
    // Based on getSubscribedChannels controller:
    // It returns "subscribers" which are actually the channels the user subscribed to.
    // The structure from aggregation is:
    // { _id: channelId, username, fullName, avatar, ... }

    const [isSubscribed, setIsSubscribed] = useState(true); // Since this is in the "Subscribed" list, initial state is true
    const [loading, setLoading] = useState(false);

    const handleToggleSubscription = async () => {
        if (!currentUserId) return;
        setLoading(true);

        // Optimistic update
        const newIsSubscribed = !isSubscribed;
        setIsSubscribed(newIsSubscribed);

        try {
            await api.post(`/subscriptions/c/${subscriber._id}`);
            // Success, nothing to do as we already updated UI
        } catch (error) {
            console.error("Error toggling subscription:", error);
            // Revert on error
            setIsSubscribed(!newIsSubscribed);
            // Ideally show a toast here
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex w-full justify-between">
            <div className="flex items-center gap-x-2">
                <div className="h-14 w-14 shrink-0">
                    <img
                        src={
                            subscriber.avatar ||
                            "https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        }
                        alt={subscriber.fullName}
                        className="h-full w-full rounded-full object-cover"
                    />
                </div>
                <div className="block">
                    <h6 className="font-semibold">{subscriber.fullName}</h6>
                    <p className="text-sm text-gray-300">
                        {subscriber.subscribersCount || 0} Subscribers
                    </p>
                </div>
            </div>

            <div className="block">
                <button
                    onClick={handleToggleSubscription}
                    disabled={loading}
                    className={`group/btn px-3 py-2 text-black ${isSubscribed
                            ? "bg-[#ae7aff] focus:bg-white"
                            : "bg-white focus:bg-[#ae7aff]"
                        } cursor-pointer active:scale-[.97] transition-shadow shadow-sm hover:shadow-md`}
                >
                    {isSubscribed ? (
                        <>
                            <span className="group-focus/btn:hidden">Subscribed</span>
                            <span className="hidden group-focus/btn:inline">Subscribe</span>
                        </>
                    ) : (
                        <>
                            <span className="group-focus/btn:hidden">Subscribe</span>
                            <span className="hidden group-focus/btn:inline">Subscribed</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

export default SubscribedItem;
