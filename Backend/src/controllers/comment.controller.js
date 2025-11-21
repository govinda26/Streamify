import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(404, "Video does not exists");
  }

  const { page = 1, limit = 20 } = req.query;
  const pageNumber = Number(page) > 0 ? Number(page) : 1;
  const pageSize = Number(limit) > 0 ? Number(limit) : 20;

  const commentsAggregation = await Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "authorDetails",
        pipeline: [
          {
            $project: {
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        author: { $first: "$authorDetails" },
      },
    },
    {
      $project: {
        authorDetails: 0,
        __v: 0,
      },
    },
    {
      $facet: {
        comments: [
          { $skip: (pageNumber - 1) * pageSize },
          { $limit: pageSize },
        ],
        totalCount: [
          {
            $count: "count",
          },
        ],
      },
    },
  ]);

  if (!commentsAggregation) {
    throw new ApiError(500, "Something went wrong while getting comments");
  }

  const comments = commentsAggregation[0]?.comments || [];
  const totalCount =
    commentsAggregation[0]?.totalCount?.[0]?.count || comments.length || 0;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        Comments: comments,
        comments,
        page: pageNumber,
        limit: pageSize,
        totalCount,
      },
      "Comments fetched successfully"
    )
  );
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  //get comment from user
  const { comment } = req.body;

  if (!comment) {
    throw new ApiError(400, "Comment is required field");
  }

  //get videoId from params
  const { videoId } = req.params;

  //add comment to video document
  const CreatedComment = await Comment.create({
    content: comment,
    video: videoId,
    owner: req.user?._id,
  });

  //return
  return res
    .status(200)
    .json(new ApiResponse(201, CreatedComment, "Comment added"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  //get new comment from user
  const { comment } = req.body;
  if (!comment) {
    throw new ApiError(400, "Comment is a required field");
  }

  //get commentId from params
  const { commentId } = req.params;
  if (!commentId) {
    throw new ApiError(404, "Comment does not exists");
  }

  //update comment
  const updatedComment = await Comment.findByIdAndUpdate(commentId, {
    $set: { content: comment },
  });

  //return
  return res
    .status(200)
    .json(new ApiResponse(201, updatedComment, "Comment updated Successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;
  if (!commentId) {
    throw new ApiError(404, "Comment does not exists");
  }

  //delete
  const deleteComment = await Comment.findByIdAndDelete(commentId);
  if (!deleteComment) {
    throw new ApiError(500, "Something went wrong while deleting comment");
  }

  //return
  return res.status(200).json(201, {}, "Comment deleted Successfully");
});

export { getVideoComments, addComment, updateComment, deleteComment };
