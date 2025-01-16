import cloudinary from "../lib/cloudinary.config.js";
import { Post } from "../models/post.model.js";

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
        // Get the public key to delete the image
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
