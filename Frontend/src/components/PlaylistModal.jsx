import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import api from "../lib/api";

function PlaylistModal({ videoId, onClose, isOpen }) {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateInput, setShowCreateInput] = useState(false);
    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        fetchPlaylists();
    }, []);

    // Handle ESC key press to close modal
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    const fetchPlaylists = async () => {
        try {
            const response = await api.get("/playlist/user");
            setPlaylists(response.data.data);
        } catch (error) {
            console.error("Error fetching playlists:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePlaylist = async (data) => {
        try {
            await api.post("/playlist/create", {
                name: data.name,
                description: "Created via video save",
            });
            reset();
            setShowCreateInput(false);
            fetchPlaylists();
        } catch (error) {
            console.error("Error creating playlist:", error);
        }
    };

    const toggleVideoInPlaylist = async (playlistId, isPresent) => {
        try {
            if (isPresent) {
                await api.post("/playlist/remove-video", { playlistId, videoId });
            } else {
                await api.post("/playlist/add-video", { playlistId, videoId });
            }
            fetchPlaylists();
        } catch (error) {
            console.error("Error updating playlist:", error);
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-md rounded-lg bg-[#121212] p-6 text-white shadow-xl border border-gray-800"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-white"
                >
                    <IoClose size={24} />
                </button>
                <h2 className="mb-4 text-lg font-semibold">Save to...</h2>

                {loading ? (
                    <div className="py-4 text-center text-gray-400">Loading...</div>
                ) : playlists.length === 0 && !showCreateInput ? (
                    <div className="py-4 text-center text-gray-400">
                        No playlist created
                    </div>
                ) : (
                    <ul className="mb-4 max-h-60 overflow-y-auto">
                        {playlists.map((playlist) => {
                            const isVideoPresent = playlist.videos.some(
                                (v) => v === videoId || v._id === videoId
                            );
                            return (
                                <li
                                    key={playlist._id}
                                    className="flex items-center gap-3 py-2 hover:bg-gray-800 px-2 rounded"
                                >
                                    <input
                                        type="checkbox"
                                        id={playlist._id}
                                        checked={isVideoPresent}
                                        onChange={() =>
                                            toggleVideoInPlaylist(playlist._id, isVideoPresent)
                                        }
                                        className="h-4 w-4 accent-[#AE7AFF]"
                                    />
                                    <label
                                        htmlFor={playlist._id}
                                        className="cursor-pointer select-none flex-1"
                                    >
                                        {playlist.name}
                                    </label>
                                </li>
                            );
                        })}
                    </ul>
                )}

                {!showCreateInput ? (
                    <button
                        onClick={() => setShowCreateInput(true)}
                        className="flex w-full items-center justify-center gap-2 rounded bg-[#222] py-2 font-semibold hover:bg-[#333]"
                    >
                        + Create new playlist
                    </button>
                ) : (
                    <form
                        onSubmit={handleSubmit(handleCreatePlaylist)}
                        className="mt-4 flex flex-col gap-2"
                    >
                        <label className="text-sm text-gray-300">Name</label>
                        <input
                            {...register("name", { required: true })}
                            placeholder="Enter playlist name..."
                            className="w-full rounded bg-transparent border border-gray-700 p-2 text-white focus:border-[#AE7AFF] focus:outline-none"
                        />
                        <div className="mt-2 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setShowCreateInput(false)}
                                className="rounded px-4 py-1 text-sm font-semibold hover:bg-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="rounded bg-[#AE7AFF] px-4 py-1 text-sm font-semibold text-black hover:bg-[#9a60ff]"
                            >
                                Create
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>,
        document.body
    );
}

export default PlaylistModal;
