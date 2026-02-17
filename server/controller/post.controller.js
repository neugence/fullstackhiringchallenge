import { Post } from "../models/post.model.js";
import { ApiError } from "../middlewares/err.middleware.js";



export const createPost = async (req, res) => {
  try {
    const userId = req.user._id;

    const post = await Post.create({
      author: userId,
      title: "Untitled",
      content_json: {},
      status: "draft",
    });

    res.status(201).json({
      success: true,
      message: "Draft created",
      post,
    });
  } catch (error) {
    console.log(error);
    throw new ApiError(error.message,error.statusCode)
  }
};



export const updatePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { content_json, title } = req.body;

    const post = await Post.findById(id);

    if (!post) {
      throw new ApiError("Post not found", 404);
    }

    if (post.author.toString() !== userId.toString()) {
      throw new ApiError("Not authorized to edit this post", 403);
    }

    if (content_json) post.content_json = content_json;
    if (title) post.title = title;

    await post.save();

    res.status(200).json({
      success: true,
      message: "Auto-saved successfully",
      post,
    });
  } catch (error) {
    console.log(error);
    throw new ApiError(error.message,error.statusCode)
  }
};



export const publishPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      throw new ApiError("Post not found", 404);
    }

    if (post.author.toString() !== userId.toString()) {
      throw new ApiError("Not authorized", 403);
    }

    post.status = "published";
    await post.save();

    res.status(200).json({
      success: true,
      message: "Post published successfully",
      post,
    });
  } catch (error) {
    console.log(error);
    throw new ApiError(error.message,error.statusCode)
  }
};



export const getMyPosts = async (req, res) => {
  try {
    const userId = req.user._id;

    const posts = await Post.find({ author: userId }).sort({
      updatedAt: -1,
    });

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.log(error);
    throw new ApiError(error.message,error.statusCode)
  }
};



export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      throw new ApiError("Post not found", 404);
    }

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.log(error);
    throw new ApiError(error.message,error.statusCode)
  }
};
