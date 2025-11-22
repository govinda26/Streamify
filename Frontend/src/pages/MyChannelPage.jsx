import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../lib/api";
import UploadVideoModal from "../components/UploadVideoModal";
import ChannelPlaylists from "../components/ChannelPlaylists";
import TweetInput from "../components/TweetInput";
import TweetList from "../components/TweetList";
import SubscribedList from "../components/SubscribedList";

const tabs = ["Videos", "Playlist", "Tweets", "Subscribed"];

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

const formatViews = (views) => {
  if (views === undefined || views === null) return "0 views";
  if (views < 1000) return `${views} views`;
  const formatter = new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  });
  return `${formatter.format(views)} views`;
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

const extractVideos = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) {
    if (Array.isArray(payload[0]?.videos)) return payload[0].videos;
    return payload.filter(Boolean);
  }
  if (Array.isArray(payload?.videos)) return payload.videos;
  return [];
};

function MyChannelPage() {
  const { username, channelId } = useParams();
  const [channel, setChannel] = useState(null);
  const [channelLoading, setChannelLoading] = useState(false);
  const [channelError, setChannelError] = useState("");
  const loggedInUserId = localStorage.getItem("user_id");

  const isOwnChannel = useMemo(() => {
    if (!channel?._id || !loggedInUserId) return false;
    return channel._id === loggedInUserId;
  }, [channel, loggedInUserId]);

  const [videos, setVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(false);
  const [videosError, setVideosError] = useState("");
  const [activeTab, setActiveTab] = useState("Videos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTweets, setRefreshTweets] = useState(false);

  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(null);

  const resetFormState = useCallback(() => {
    setVideoFile(null);
    setThumbnailFile(null);
    setTitle("");
    setDescription("");
    setUploadError("");
    setUploadProgress(null);
  }, []);

  const fetchChannel = useCallback(async () => {
    if (!username && !channelId) return;
    setChannelLoading(true);
    setChannelError("");
    try {
      let res;
      if (channelId) {
        res = await api.get(`/channel/${channelId}`);
      } else {
        res = await api.get(`/users/c/${username}`);
      }
      setChannel(res.data?.data || res.data);
    } catch (error) {
      setChannelError(
        error?.response?.data?.message ||
        "Unable to load this channel at the moment."
      );
    } finally {
      setChannelLoading(false);
    }
  }, [username, channelId]);

  const fetchVideos = useCallback(async (ownerId) => {
    if (!ownerId) return;
    setVideosLoading(true);
    setVideosError("");
    try {
      const params = new URLSearchParams({
        userId: ownerId,
        sortBy: "createdAt",
        sortType: "desc",
        limit: "24",
      });
      const response = await api.get(`/videos?${params.toString()}`);
      setVideos(extractVideos(response?.data?.data));
    } catch (error) {
      setVideosError(
        error?.response?.data?.message || "Unable to fetch videos right now."
      );
    } finally {
      setVideosLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChannel();
  }, [fetchChannel]);

  useEffect(() => {
    if (channel?._id) {
      fetchVideos(channel._id);
    }
  }, [channel?._id, fetchVideos]);

  const closeModal = useCallback(() => {
    if (uploading) return;
    setIsModalOpen(false);
    resetFormState();
  }, [resetFormState, uploading]);

  const handleUpload = useCallback(async () => {
    if (!videoFile || !thumbnailFile || !title.trim() || !description.trim()) {
      setUploadError("All fields are required before uploading.");
      return;
    }

    setUploading(true);
    setUploadError("");
    setUploadProgress(null);

    try {
      const formData = new FormData();
      formData.append("videoFile", videoFile);
      formData.append("thumbnail", thumbnailFile);
      formData.append("title", title);
      formData.append("description", description);

      await api.post("/videos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
        onUploadProgress: (event) => {
          if (!event.total) return;
          setUploadProgress(Math.round((event.loaded * 100) / event.total));
        },
      });

      resetFormState();
      setIsModalOpen(false);
      await fetchVideos(channel?._id || loggedInUserId);
    } catch (error) {
      setUploadError(
        error?.response?.data?.message ||
        "Upload failed. Please try again in a moment."
      );
    } finally {
      setUploading(false);
    }
  }, [
    channel?._id,
    description,
    fetchVideos,
    loggedInUserId,
    resetFormState,
    thumbnailFile,
    title,
    videoFile,
  ]);

  const toggleSubscribe = async () => {
    if (!channel?._id) return;
    try {
      await api.post(`/subscriptions/c/${channel._id}`);
      // Optimistically update UI or refetch
      fetchChannel();
    } catch (error) {
      console.error("Error toggling subscription:", error);
    }
  };

  return (
    <div className="w-full bg-[#121212] text-white">
      <div className="relative min-h-[150px] w-full pt-[16.28%]">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={
              channel?.coverImage ||
              "https://images.pexels.com/photos/1092424/pexels-photo-1092424.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            }
            alt="cover-photo"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      <div className="px-4 pb-4">
        <div className="flex flex-wrap gap-4 pb-4 pt-6">
          <span className="relative -mt-12 inline-block h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-white">
            <img
              src={
                channel?.avatar ||
                "https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              }
              alt="channel-avatar"
              className="h-full w-full object-cover"
            />
          </span>
          <div className="mr-auto inline-block">
            <h1 className="font-bolg text-xl">{channel?.fullName}</h1>
            <p className="text-sm text-gray-400">@{channel?.username}</p>
            <p className="text-sm text-gray-400">
              {formatViews(channel?.subscribersCount)} Subscribers •{" "}
              {channel?.subscribedToCount} Subscribed
            </p>
          </div>
          <div className="inline-block">
            <button
              onClick={toggleSubscribe}
              className={`group/btn mr-1 flex w-full items-center gap-x-2 px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 hover:bg-pink-500 hover:text-white hover:shadow-[5px_5px_0px_0px_#4f4e4e] sm:w-auto ${channel?.isSubscribed ? "bg-pink-500 text-white" : "bg-[#ae7aff]"
                }`}
            >
              <span className="inline-block w-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                  ></path>
                </svg>
              </span>
              <span className="group-hover/btn:hidden">
                {channel?.isSubscribed ? "Subscribed" : "Subscribe"}
              </span>
              <span className="hidden group-hover/btn:inline">
                {channel?.isSubscribed ? "Unsubscribe" : "Subscribe"}
              </span>
            </button>
          </div>
        </div>

        <ul className="no-scrollbar sticky top-[66px] z-[2] flex flex-row gap-x-2 overflow-auto border-b-2 border-gray-400 bg-[#121212] py-2 sm:top-[82px]">
          {tabs.map((tab) => (
            <li key={tab} className="w-full">
              <button
                onClick={() => setActiveTab(tab)}
                className={`w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400 hover:text-white ${activeTab === tab ? "border-[#ae7aff] text-[#ae7aff]" : ""
                  }`}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>

        {/* Tab Content */}
        {activeTab === "Videos" && (
          <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 pt-2">
            {isOwnChannel && (
              <div className="w-full">
                <div
                  onClick={() => setIsModalOpen(true)}
                  className="flex h-full w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-600 bg-gray-800 p-4 text-center hover:bg-gray-700 cursor-pointer"
                >
                  <span className="mb-2 inline-block rounded-full bg-[#E4D3FF] p-4 text-[#AE7AFF]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      ></path>
                    </svg>
                  </span>
                  <h6 className="mb-1 font-semibold text-white">Upload New Video</h6>
                  <p className="text-sm text-gray-400">
                    Click here to upload a new video to your channel.
                  </p>
                </div>
              </div>
            )}

            {videosLoading ? (
              <div className="col-span-full text-center text-white">
                Loading videos...
              </div>
            ) : videosError ? (
              <div className="col-span-full text-center text-red-500">
                {videosError}
              </div>
            ) : videos.length === 0 && !isOwnChannel ? (
              <div className="col-span-full text-center text-white">
                No videos available
              </div>
            ) : (
              videos.map((video) => (
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
                      <img
                        src={
                          channel?.avatar ||
                          "https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        }
                        alt={channel?.username}
                        className="h-full w-full rounded-full object-cover"
                      />
                    </div>
                    <div className="w-full">
                      <h6 className="mb-1 font-semibold">{video.title}</h6>
                      <p className="flex text-sm text-gray-200">
                        {formatViews(video.views)} • {formatTimeAgo(video.createdAt)}
                      </p>
                      <p className="text-sm text-gray-200">
                        {channel?.fullName || channel?.username}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "Playlist" && (
          <ChannelPlaylists channelId={channel?._id} isOwnChannel={isOwnChannel} />
        )}

        {activeTab === "Tweets" && (
          <div className="w-full max-w-3xl mx-auto pt-4">
            {isOwnChannel && (
              <TweetInput onTweetCreated={() => setRefreshTweets(prev => !prev)} />
            )}
            <TweetList channelId={channel?._id} refreshTrigger={refreshTweets} />
          </div>
        )}

        {activeTab === "Subscribed" && (
          <SubscribedList channelId={channel?._id} />
        )}
      </div>

      {isModalOpen && (
        <UploadVideoModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            resetFormState();
          }}
          onUpload={handleUpload}
          videoFile={videoFile}
          setVideoFile={setVideoFile}
          thumbnailFile={thumbnailFile}
          setThumbnailFile={setThumbnailFile}
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          uploading={uploading}
          uploadError={uploadError}
          uploadProgress={uploadProgress}
        />
      )}
    </div>
  );
}

export default MyChannelPage;
