import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../lib/api";
import PlaylistModal from "../components/PlaylistModal";

const formatViews = (views) => {
  if (views === undefined || views === null) return "0 views";
  if (views < 1000) return `${views} views`;
  const formatter = new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  });
  return `${formatter.format(views)} views`;
};

const formatDuration = (seconds) => {
  if (!seconds && seconds !== 0) return "";
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

const extractVideos = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) {
    if (Array.isArray(payload[0]?.videos)) return payload[0].videos;
    return payload.filter(Boolean);
  }
  if (Array.isArray(payload?.videos)) return payload.videos;
  return [];
};

function VideoDetailPage() {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState("");

  const [channelProfile, setChannelProfile] = useState(null);
  const [recommended, setRecommended] = useState([]);

  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);

  const ownerUsername = useMemo(
    () => video?.ownerDetails?.username,
    [video?.ownerDetails?.username]
  );

  const fetchVideo = useCallback(async () => {
    if (!videoId) return;
    setVideoLoading(true);
    setVideoError("");
    try {
      const res = await api.get(`/videos/${videoId}`);
      const data = res.data?.data || res.data;
      setVideo(data);
      setLikesCount(data?.likesCount || 0);
      setIsLiked(Boolean(data?.isLiked));
      setSubscribersCount(data?.subscribersCount || 0);
      setIsSubscribed(Boolean(data?.isSubscribed));
    } catch (error) {
      setVideoError(
        error?.response?.data?.message || "Unable to load this video."
      );
    } finally {
      setVideoLoading(false);
    }
  }, [videoId]);

  useEffect(() => {
    fetchVideo();
  }, [fetchVideo]);

  const fetchChannelProfile = useCallback(async () => {
    if (!ownerUsername) return;
    try {
      const res = await api.get(`/users/c/${ownerUsername}`);
      const data = res.data?.data || res.data;
      setChannelProfile(data);
      if (typeof data?.subscribersCount === "number") {
        setSubscribersCount(data.subscribersCount);
      }
      if (typeof data?.isSubscribed === "boolean") {
        setIsSubscribed(data.isSubscribed);
      }
    } catch {
      // silently ignore
    }
  }, [ownerUsername]);

  useEffect(() => {
    fetchChannelProfile();
  }, [fetchChannelProfile]);

  const fetchRecommended = useCallback(
    async (ownerId) => {
      if (!ownerId) return;
      try {
        const params = new URLSearchParams({
          userId: ownerId,
          sortBy: "createdAt",
          sortType: "desc",
          limit: "10",
        });
        const res = await api.get(`/videos?${params.toString()}`);
        const list = extractVideos(res?.data?.data).filter(
          (item) => item._id !== videoId
        );
        setRecommended(list.slice(0, 8));
      } catch {
        setRecommended([]);
      }
    },
    [videoId]
  );

  useEffect(() => {
    if (video?.owner) {
      fetchRecommended(video.owner);
    }
  }, [video?.owner, fetchRecommended]);

  const fetchComments = useCallback(async () => {
    if (!videoId) return;
    setCommentsLoading(true);
    try {
      const res = await api.get(`/comments/${videoId}`);
      const data =
        res?.data?.data?.Comments ||
        res?.data?.data?.comments ||
        res?.data?.data ||
        [];
      setComments(Array.isArray(data) ? data : []);
    } catch {
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  }, [videoId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleToggleLike = async () => {
    if (!videoId) return;
    try {
      const res = await api.post(`/likes/toggle/v/${videoId}`);
      const nowLiked = Boolean(res?.data?.data?.isLiked);
      setIsLiked(nowLiked);
      setLikesCount((prev) => Math.max(0, prev + (nowLiked ? 1 : -1)));
    } catch {
      // ignore
    }
  };

  const toggleSubscribe = async () => {
    const channelId = channelProfile?._id || video?.owner;
    if (!channelId) return;
    try {
      const res = await api.post(`/subscriptions/c/${channelId}`);
      const subscribed = Boolean(res?.data?.data?.isSubscribed);
      setIsSubscribed(subscribed);
      setSubscribersCount((prev) =>
        Math.max(0, prev + (subscribed ? 1 : -1))
      );
    } catch {
      // ignore
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      await api.post(`/comments/${videoId}`, {
        content: commentText.trim(),
      });
      setCommentText("");
      fetchComments();
    } catch {
      // ignore error feedback for now
    }
  };

  const ownerAvatar =
    channelProfile?.avatar || video?.ownerDetails?.avatar || "";
  const ownerName =
    channelProfile?.fullName || video?.ownerDetails?.fullName || "";

  return (
    <div className="w-full bg-[#121212] text-white">
      <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
        <div className="flex w-full flex-col gap-4 p-4 lg:flex-row lg:p-8">
          <div className="w-full lg:w-3/4">
            <div className="relative mb-4 w-full pt-[56%]">
              <div className="absolute inset-0">
                <video
                  className="h-full w-full"
                  controls
                  autoPlay
                  src={video?.videoFile}
                ></video>
              </div>
            </div>

            <div className="mb-4 flex items-start justify-between">
              <div>
                <h1 className="mb-2 text-2xl font-semibold">{video?.title}</h1>
                <div className="flex items-center gap-x-2 text-sm text-gray-400">
                  <span>{formatViews(video?.views)}</span>
                  <span>•</span>
                  <span>{formatTimeAgo(video?.createdAt)}</span>
                </div>
              </div>
              <div className="flex gap-x-4">
                <button
                  onClick={handleToggleLike}
                  className={`flex items-center gap-x-1 ${isLiked ? "text-pink-500" : "text-white"
                    }`}
                >
                  <span className="inline-block w-5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill={isLiked ? "currentColor" : "none"}
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.247-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.396C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
                      ></path>
                    </svg>
                  </span>
                  {likesCount}
                </button>
                <button
                  onClick={() => setIsPlaylistModalOpen(true)}
                  className="flex items-center gap-x-1 cursor-pointer hover:text-[#ae7aff] transition-colors"
                >
                  <span className="inline-block w-5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 4.5v2.25c0 .414.336.75.75.75h13.5c.414 0 .75-.336.75-.75V3.75a.75.75 0 00-.75-.75z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 7.5v3.75c0 .414-.336.75-.75.75h-13.5a.75.75 0 00-.75.75v9.75c0 .414.336.75.75.75h13.5a2.25 2.25 0 002.25-2.25v-9.75a2.25 2.25 0 00-2.25-2.25z"
                      ></path>
                    </svg>
                  </span>
                  Save
                </button>
              </div>
            </div>

            <div className="mb-6 flex items-center justify-between rounded-lg bg-[#1E1E1E] p-4">
              <div className="flex items-center gap-x-4">
                <Link to={`/channel/id/${video?.ownerDetails?._id}`}>
                  <img
                    src={
                      channelProfile?.avatar ||
                      "https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    }
                    alt={ownerUsername}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                </Link>
                <div>
                  <Link to={`/channel/id/${video?.ownerDetails?._id}`}>
                    <h3 className="font-semibold">{ownerUsername}</h3>
                  </Link>
                  <p className="text-sm text-gray-400">
                    {subscribersCount} Subscribers
                  </p>
                </div>
              </div>
              <button
                onClick={toggleSubscribe}
                className={`rounded px-4 py-2 font-semibold transition-colors ${isSubscribed
                  ? "bg-gray-600 text-white hover:bg-gray-500"
                  : "bg-[#ae7aff] text-black hover:bg-[#9f86ff]"
                  }`}
              >
                {isSubscribed ? "Subscribed" : "Subscribe"}
              </button>
            </div>

            <div className="mb-6 border-b border-gray-700 pb-4">
              <p className="whitespace-pre-line text-gray-300">
                {video?.description}
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-xl font-semibold">
                {comments.length} Comments
              </h3>
              <div className="mb-6 flex gap-x-4">
                <img
                  src="https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt="User"
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="w-full">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full border-b border-gray-700 bg-transparent pb-2 outline-none focus:border-[#ae7aff]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddComment();
                      }
                    }}
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={handleAddComment}
                      disabled={!commentText.trim()}
                      className="rounded bg-[#ae7aff] px-4 py-1.5 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Comment
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                {commentsLoading ? (
                  <p>Loading comments...</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment._id} className="flex gap-x-4">
                      <Link to={`/channel/id/${comment.owner?._id}`}>
                        <img
                          src={
                            comment.owner?.avatar ||
                            "https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                          }
                          alt={comment.owner?.username}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      </Link>
                      <div>
                        <div className="flex items-center gap-x-2">
                          <Link to={`/channel/id/${comment.owner?._id}`}>
                            <h4 className="font-semibold">
                              {comment.owner?.username}
                            </h4>
                          </Link>
                          <span className="text-xs text-gray-400">
                            {formatTimeAgo(comment.createdAt)}
                          </span>
                        </div>
                        <p className="mt-1 text-gray-300">{comment.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/4">
            <h3 className="mb-4 text-xl font-semibold">Related Videos</h3>
            <div className="flex flex-col gap-4">
              {recommended.map((vid) => (
                <div key={vid._id} className="flex gap-x-2">
                  <Link
                    to={`/video/${vid._id}`}
                    className="relative h-24 w-40 shrink-0"
                  >
                    <img
                      src={vid.thumbnail}
                      alt={vid.title}
                      className="h-full w-full rounded object-cover"
                    />
                    <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 text-xs">
                      {formatDuration(vid.duration)}
                    </span>
                  </Link>
                  <div>
                    <Link to={`/video/${vid._id}`}>
                      <h4 className="line-clamp-2 text-sm font-semibold">
                        {vid.title}
                      </h4>
                    </Link>
                    <Link to={`/channel/id/${vid.owner?._id}`}>
                      <p className="text-xs text-gray-400">
                        {vid.owner?.username}
                      </p>
                    </Link>
                    <p className="text-xs text-gray-400">
                      {formatViews(vid.views)} • {formatTimeAgo(vid.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <PlaylistModal
        isOpen={isPlaylistModalOpen}
        onClose={() => setIsPlaylistModalOpen(false)}
        videoId={videoId}
      />
      {videoError ? (
        <div className="fixed inset-x-0 top-16 z-50 mx-auto max-w-xl rounded border border-red-500/40 bg-red-500/20 px-4 py-3 text-center text-sm text-red-200">
          {videoError}
        </div>
      ) : null}
    </div>
  );
}

export default VideoDetailPage;
