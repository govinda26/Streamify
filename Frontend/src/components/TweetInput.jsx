import React, { useState } from "react";
import api from "../lib/api";

function TweetInput({ onTweetCreated }) {
    const [tweetText, setTweetText] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!tweetText.trim()) return;
        setLoading(true);
        try {
            await api.post("/tweets", { content: tweetText });
            setTweetText("");
            if (onTweetCreated) {
                onTweetCreated();
            }
        } catch (error) {
            console.error("Error creating tweet:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-2 border pb-2">
            <textarea
                className="mb-2 h-10 w-full resize-none border-none bg-transparent px-3 pt-2 outline-none"
                placeholder="Write a tweet"
                value={tweetText}
                onChange={(e) => setTweetText(e.target.value)}
            ></textarea>

            <div className="flex items-center justify-end gap-x-3 px-3">
                <button className="inline-block h-5 w-5 hover:text-[#ae7aff]">
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
                            d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                        ></path>
                    </svg>
                </button>
                <button className="inline-block h-5 w-5 hover:text-[#ae7aff]">
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
                            d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                        ></path>
                    </svg>
                </button>
                <button
                    onClick={handleSend}
                    disabled={loading || !tweetText.trim()}
                    className="bg-[#ae7aff] px-3 py-2 font-semibold text-black disabled:opacity-50"
                >
                    {loading ? "Sending..." : "Send"}
                </button>
            </div>
        </div>
    );
}

export default TweetInput;
