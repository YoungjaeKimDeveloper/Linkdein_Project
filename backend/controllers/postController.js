import cloudinary from "../lib/cloudinary.config.js";
// models
import { Post } from "../models/post.model.js";
import { Notification } from "../models/notification.model.js";
import { sendCommentNotificationEmail } from "../emails/emailHandlers.js";

export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      author: {
        $in: req.user.connections,
      },
    })
      .populate("author", "name username profilePicture headline")
      .populate("comments.user", "name profilePicture")
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, posts: posts });
  } catch (error) {
    console.error("ERROR IN [getFeedPosts]", error.message);
    return res.status(500).json({
      success: false,
      message: `ERROR IN [getFeedPosts ${error.message}`,
    });
  }
};

export const createPost = async (req, res) => {
  try {
    const { content, image } = req.body;
    // newPost Object
    let newPost;

    if (image) {
      const imageResult = await cloudinary.uploader.upload(image);
      newPost = new Post({
        author: req.user._id,
        content,
        image: imageResult.secure_url,
      });
    } else {
      newPost = new Post({
        author: req.user._id,
        content: content,
      });
      return res
        .status(201)
        .json({ success: true, message: "POST CREATED ✅", newPost });
    }
  } catch (error) {
    console.error("ERROR IN [createPost]", error.message);
    return res.status(500).json({
      success: false,
      message: `SERVER ERROR IN [createPost] ${error.message}`,
    });
  }
};
// 포스트 지우는 함수
export const deletePost = async (req, res) => {
  try {
    // id로 포스트 먼저 찾기
    const post = await Post.findById(req.params.id);
    // 포스트 없는경우
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "CANNOT FIND THE POST" });
    }
    // 삭제하려는 유저  포스트 유저 확인 id는 toString() 으로 변환해줘야함
    if (req.user._id.toString() !== post.author.toString()) {
      return res
        .status(401)
        .json({ success: false, message: "UNAUTHORIZED -ACCESS" });
    }
    // Cloudinary에서 사진 지워주기
    if (post.image) {
      try {
        // 클라우드 ID추출하기
        const publicId = post.image.split("/").pop().split(".")[0];
        const result = await cloudinary.uploader.destroy(publicId);
        if (result.result === 200) {
          console.info("Image deleted successfully ✅");
        } else {
          console.warn("Image deletion failed or was not found on Cloudinary.");
        }
      } catch (error) {
        console.error("Failed to delete image from Cloudinary:", error.message);
      }
    }
    await Post.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "POST DELETED ✅", deletedPost: post });
  } catch (error) {
    console.error(`"SERVER ERROR IN [deletePost]: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: `"SERVER ERROR IN [deletePost]: ${error.message}`,
    });
  }
};
// 아이디 별로 POSTING가져오기
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id)
      .populate("author", "name userName profilePicture headline")
      .populate("comments.user", "name profilePicture userName headline");
    return res.status(200).json({ success: true, posts: post });
  } catch (error) {
    console.error("ERROR IN [getPostById] : ", error.message);
    return res
      .status(500)
      .json({ success: false, message: `ERROR IN ${error.message}` });
  }
};

export const createComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const post = await Post.findByIdAndUpdate(
      id,
      {
        $push: { comments: { user: req.user._id, content } },
      },
      { new: true }
    ).populate("author", "name email userName headline profilePicture");
    // 포스트 작성인과 댓글단 사람이 다를경우(타인)) 알람주기
    if (post.author.toString() !== req.user._id.toString()) {
      const newNotification = new Notification({
        recipient: post.author,
        type: "comment",
        relatedUser: req.user._id,
        relatedPost: id,
      });

      await newNotification.save();
      //todo send Email  실제로 이메일 보내주기
      try {
        const postUrl = process.env.CLIENT_URL + "/post/" + id;
        await sendCommentNotificationEmail(
          post.author.email,
          post.author.name,
          req.user.name,
          postUrl,
          content
        );
      } catch (error) {
        console.error("Error in sending comment notification email:", error);
      }
    }
    return res.status(201).json({ success: true, message: "Commnet added" });
  } catch (error) {
    console.error("ERROR IN [createComment]", error.message);
    return res.status(500).json({
      success: false,
      message: `ERROR IN [createComment] ${error.message}`,
    });
  }
};
export const likePost = async (req, res) => {
  try {
    const postID = req.params.id;
    const post = await Post.findById(postID);
    const userId = req.user._id;

    if (post.likes.includes(userId)) {
      // 싫어요
      post.likes = post.likes.filter(
        (likedId) => likedId.toString() !== userId.toString()
      );
    } else {
      // 좋아요
      post.likes = post.likes.push(userId);
    }
    await post.save();
    // create a notificaiton if the post owner is not the user who liked
    if (post.author.toString() !== userId.toString()) {
      const newNotification = new Notification({
        recipient: post.author,
        type: "like",
        relatedUser: userId,
        relatedPost: postID,
      });
      await newNotification.save();
    }
    return res
      .status(201)
      .json({ success: true, message: "LIKE ADDED", post: post });
    // 포스트 못찾는경우
  } catch (error) {
    console.error("ERROR IN [likePost]: ", error.message);
    return res.status(500).json({
      success: false,
      message: `SERVER ERROR IN [likePost] ❌: ${error.message}`,
    });
  }
};

// 포스트 찾기

// likes 에 push해주기
// Save 해주기
