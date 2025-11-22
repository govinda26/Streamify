import React, { useEffect, useState } from "react";
import api from "../lib/api";
import SubscribedItem from "./SubscribedItem";

function SubscribedList({ channelId, currentUserId }) {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (channelId) {
            fetchSubscribedChannels();
        }
    }, [channelId]);

    const fetchSubscribedChannels = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch channels the current channel is subscribed to
            const response = await api.get(`/subscriptions/c/${channelId}`);
            setSubscribers(response.data.data);
        } catch (error) {
            console.error("Error fetching subscribed channels:", error);
            setError("Failed to load subscribed channels");
        } finally {
            setLoading(false);
        }
    };

    const filteredSubscribers = subscribers.filter((sub) =>
        sub.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <div className="text-center text-white">Loading subscriptions...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    if (subscribers.length === 0) {
        return (
            <div className="flex justify-center p-4">
                <div className="w-full max-w-sm text-center">
                    <p className="mb-3 w-full">
                        <span className="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]">
                            <span className="inline-block w-6">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                    className="w-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                                    ></path>
                                </svg>
                            </span>
                        </span>
                    </p>
                    <h5 className="mb-2 font-semibold">No people subscribers</h5>
                    <p>
                        This channel has yet to <strong>subscribe</strong> a new channel.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-y-4 py-4">
            <div className="relative mb-2 rounded-lg bg-white py-2 pl-8 pr-3 text-black">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                        className="h-5 w-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                        ></path>
                    </svg>
                </span>
                <input
                    className="w-full bg-transparent outline-none"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {filteredSubscribers.map((subscriber) => (
                <SubscribedItem
                    key={subscriber._id}
                    subscriber={subscriber}
                    currentUserId={currentUserId}
                />
            ))}
        </div>
    );
}

export default SubscribedList;
