import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import { useSearch } from "../context/SearchContext";

function MySubscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const userId = localStorage.getItem("user_id");
  const { searchQuery } = useSearch();

  const filteredSubscribers = useMemo(() => {
    if (!searchQuery) return subscribers;
    const lowerQuery = searchQuery.toLowerCase();
    return subscribers.filter((item) => {
        // item is the user object now
        const sub = item;
        if (!sub) return false;
        return (
            sub.username?.toLowerCase().includes(lowerQuery) ||
            sub.fullName?.toLowerCase().includes(lowerQuery)
        );
    });
  }, [subscribers, searchQuery]);

  useEffect(() => {
    const fetchSubscribers = async () => {
      if (!userId) {
          setLoading(false);
          return;
      }
      try {
        const res = await api.get(`/subscriptions/u/${userId}`);
        // `getUserChannelSubscribers` returns a list of subscription documents.
        // Each document typically has a 'subscriber' field populated with user details.
        // We'll map that out.
        const data = res.data?.data || [];
        setSubscribers(data);
      } catch (err) {
        setError("Failed to load subscribers.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, [userId]);

  if (loading) return <div className="p-8 text-white">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="w-full bg-[#121212] text-white min-h-screen">
      <div className="p-8">
        <h1 className="mb-6 text-2xl font-bold">My Subscribers</h1>
        {filteredSubscribers.length === 0 ? (
          <p className="text-gray-400">
             {searchQuery
              ? `No results found for "${searchQuery}"`
              : "You don't have any subscribers yet."}
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredSubscribers.map((item) => {
               // The item is the user object directly due to $replaceRoot in the controller
               const sub = item;
               if (!sub) return null;

               return (
                <div key={item._id} className="flex items-center justify-between border-b border-gray-800 pb-4">
                  <div className="flex items-center gap-4">
                    <Link to={`/channel/id/${sub._id}`}>
                        <img
                        src={sub.avatar || "https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
                        alt={sub.username}
                        className="h-12 w-12 rounded-full object-cover"
                        />
                    </Link>
                    <div>
                        <Link to={`/channel/id/${sub._id}`}>
                             <h3 className="font-semibold text-white">{sub.fullName}</h3>
                        </Link>
                        <p className="text-sm text-gray-400">@{sub.username}</p>
                    </div>
                  </div>
                  {/* You could add a 'Subscribe Back' button here if desired */}
                </div>
               );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MySubscribers;
