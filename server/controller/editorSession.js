import { EditorSession } from "../models/editorSession.model.js";
import { ApiError } from "../middlewares/err.middleware.js";



export const startEditorSession = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId } = req.body;

    if (!postId) {
      throw new ApiError("Post ID required", 400);
    }

    let session = await EditorSession.findOne({
      user: userId,
      post: postId,
    });

    if (!session) {
      session = await EditorSession.create({
        user: userId,
        post: postId,
        saveStatus: "saved",
      });
    }

    res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    console.log(error);
    throw new ApiError(error.message,error.statusCode)
  }
};



export const updateSessionStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId, saveStatus } = req.body;

    const session = await EditorSession.findOne({
      user: userId,
      post: postId,
    });

    if (!session) {
      throw new ApiError("Session not found", 404);
    }

    session.saveStatus = saveStatus || session.saveStatus;
    session.lastSavedAt = new Date();

    await session.save();

    res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    console.log(error);
    throw new ApiError(error.message,error.statusCode)
  }
};



export const markAiUsed = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId } = req.body;

    const session = await EditorSession.findOne({
      user: userId,
      post: postId,
    });

    if (!session) {
      throw new ApiError("Session not found", 404);
    }

    session.aiLastUsedAt = new Date();
    await session.save();

    res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    console.log(error);
    throw new ApiError(error.message,error.statusCode)
  }
};
