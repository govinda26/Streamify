import React, { useEffect, useState } from "react";
import api from "../lib/api";
import TweetItem from "./TweetItem";
import { useSearch } from "../context/SearchContext";

function TweetList({ channelId, currentUserId, refreshTrigger }) {
    const [tweets, setTweets] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { searchQuery } = useSearch();

    const filteredTweets = React.useMemo(() => {
        if (!searchQuery) return tweets;
        const lowerQuery = searchQuery.toLowerCase();
        return tweets.filter((tweet) =>
            tweet.content?.toLowerCase().includes(lowerQuery)
        );
    }, [tweets, searchQuery]);

    useEffect(() => {
        if (channelId) {
            fetchTweets();
        }
    }, [channelId, refreshTrigger]);

    const fetchTweets = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/tweets/user/${channelId}`);
            setTweets(response.data.data);
        } catch (error) {
            console.error("Error fetching tweets:", error);
            setError("Failed to load tweets");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center text-white">Loading tweets...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    if (filteredTweets.length === 0) {
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
                                        d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-2.281c-1.02-1.016-2.69-1.016-3.71 0l-.841.841a2.25 2.25 0 01-3.182 0l-.841-.841c-1.02-1.016-2.69-1.016-3.71 0a2.126 2.126 0 00-.476 2.281m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                                    ></path>
                                </svg>
                            </span>
                        </span>
                    </p>
                    <h5 className="mb-2 font-semibold">No Tweets</h5>
                    <p>
                        {searchQuery
                            ? `No tweets found for "${searchQuery}"`
                            : "This channel has yet to make a Tweet."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {filteredTweets.map((tweet) => (
                <TweetItem
                    key={tweet._id}
                    tweet={tweet}
                    currentUserId={currentUserId}
                />
            ))}
        </div>
    );
}

export default TweetList;
