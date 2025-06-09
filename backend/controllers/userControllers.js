import upload from "../middleware/uploadPictureMiddleware.js";
import Comment from "../models/Comment.js";
import cloudinary from "../config/cloudinaryConfig.js";
import { createFriendAddedNotification } from "../services/notificationService.js";

import crypto from "crypto";
import bcrypt from "bcrypt";
import { sendPasswordResetEmail } from "../services/emailService.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import { fileRemover } from "../utils/fileRemover.js";

console.log("=== EMAIL CONFIGURATION DEBUG ===");
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log(
  "EMAIL_APP_PASSWORD:",
  process.env.EMAIL_APP_PASSWORD ? "***PRESENT***" : "***MISSING***"
);
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
console.log("=====================================");

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      throw new Error("El usuario ya existe");
    }

    user = await User.create({
      name,
      email,
      password,
      avatar: "",
      coverImg: "",
    });

    return res.status(201).json({
      _id: user._id,
      avatar: user.avatar,
      coverImg: user.coverImg,
      name: user.name,
      email: user.email,
      verified: user.verified,
      admin: user.admin,
      token: await user.generateJWT(),
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      throw new Error("Email no encontrado");
    }

    if (await user.comparePassword(password)) {
      return res.status(201).json({
        _id: user._id,
        avatar: user.avatar,
        coverImg: user.coverImg,
        name: user.name,
        email: user.email,
        verified: user.verified,
        admin: user.admin,
        token: await user.generateJWT(),
      });
    } else {
      throw new Error("Email o contraseña incorrectos");
    }
  } catch (error) {
    next(error);
  }
};

const userProfile = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id).populate(
      "friends",
      "_id name avatar"
    ); // ✅ Populate friends

    if (user) {
      return res.status(200).json({
        _id: user._id,
        avatar: user.avatar,
        coverImg: user.coverImg,
        name: user.name,
        email: user.email,
        verified: user.verified,
        country: user.country,
        city: user.city,
        admin: user.admin,
        friends: user.friends,
      });
    } else {
      let error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Update only the fields sent in the request
    if (req.body.city) user.city = req.body.city;
    if (req.body.country) user.country = req.body.country;
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    // New: update admin and verified fields if provided
    if (typeof req.body.admin !== "undefined") user.admin = req.body.admin;
    if (typeof req.body.verified !== "undefined")
      user.verified = req.body.verified;

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      city: user.city,
      country: user.country,
      coverImg: user.coverImg,
      avatar: user.avatar,
      friends: user.friends,
      verified: user.verified,
      admin: user.admin,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error("No file uploaded.");
    }

    let user = await User.findById(req.user._id);

    if (!user) {
      throw new Error("User not found.");
    }

    // ✅ Delete the old avatar if exists
    if (user.avatar) {
      await cloudinary.uploader.destroy(user.avatar);
    }

    // ✅ Upload the new avatar to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "uploads", // Store images inside 'uploads' folder
    });

    // ✅ Save only the `public_id` instead of full URL
    user.avatar = result.public_id; // 👈 This saves only "uploads/1739621073399-activities"

    await user.save();

    res.json({
      _id: user._id,
      avatar: user.avatar,
      coverImg: user.coverImg, // Returns only `public_id`
      name: user.name,
      email: user.email,
      verified: user.verified,
      admin: user.admin,
      token: await user.generateJWT(),
    });
  } catch (error) {
    next(error);
  }
};

export const updateCoverImg = async (req, res, next) => {
  try {
    console.log("🔄 updateCoverImg controller called");

    if (!req.file) {
      throw new Error("No file uploaded.");
    }

    let user = await User.findById(req.user._id);

    if (!user) {
      throw new Error("User not found.");
    }

    console.log("👤 Current user coverImg:", user.coverImg);
    console.log("👤 coverImg type:", typeof user.coverImg);
    console.log(
      "👤 coverImg exists in schema:",
      user.schema.paths.coverImg ? "Yes" : "No"
    );

    // Delete old cover image if it exists and is not empty
    if (user.coverImg && user.coverImg.trim() !== "") {
      console.log("🗑️ Deleting old cover image:", user.coverImg);
      try {
        await cloudinary.uploader.destroy(user.coverImg);
        console.log("✅ Old cover image deleted");
      } catch (deleteError) {
        console.log("⚠️ Error deleting old image:", deleteError.message);
      }
    } else {
      console.log("🆕 No existing cover image to delete");
    }

    // Upload new image
    console.log("📤 Uploading new cover image to Cloudinary...");
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "uploads",
      public_id: `cover_${user._id}_${Date.now()}`,
      overwrite: true,
      resource_type: "image",
    });

    console.log("✅ Cloudinary upload result:", {
      public_id: result.public_id,
      secure_url: result.secure_url,
    });

    // CRITICAL: Force the field to exist and update it
    console.log("💾 Updating coverImg field...");

    // Method 1: Use $set to explicitly set the field
    const updateResult = await User.updateOne(
      { _id: user._id },
      {
        $set: {
          coverImg: result.public_id,
          updatedAt: new Date(),
        },
      }
    );

    console.log("📝 Update result:", updateResult);

    // Verify the update worked
    const updatedUser = await User.findById(user._id);
    console.log("🔍 After update - coverImg:", updatedUser.coverImg);
    console.log(
      "🔍 After update - coverImg type:",
      typeof updatedUser.coverImg
    );

    // If still empty, try alternative method
    if (!updatedUser.coverImg || updatedUser.coverImg.trim() === "") {
      console.log("⚠️ First method failed, trying alternative...");

      // Method 2: Direct assignment with markModified
      updatedUser.coverImg = result.public_id;
      updatedUser.markModified("coverImg");
      await updatedUser.save();

      console.log("🔍 After save - coverImg:", updatedUser.coverImg);
    }

    // Final verification
    const finalUser = await User.findById(user._id);
    console.log("✅ Final verification - coverImg:", finalUser.coverImg);

    // Prepare response
    const responseData = {
      _id: finalUser._id,
      avatar: finalUser.avatar,
      coverImg: finalUser.coverImg,
      name: finalUser.name,
      email: finalUser.email,
      verified: finalUser.verified,
      admin: finalUser.admin,
      city: finalUser.city,
      country: finalUser.country,
      friends: finalUser.friends,
      token: await finalUser.generateJWT(),
    };

    console.log("📤 Sending response with coverImg:", responseData.coverImg);
    res.json(responseData);
  } catch (error) {
    console.error("❌ updateCoverImg error:", error);
    next(error);
  }
};

export const fixExistingUsers = async (req, res) => {
  try {
    // Update all users that don't have coverImg field or have null/undefined
    const result = await User.updateMany(
      {
        $or: [
          { coverImg: { $exists: false } },
          { coverImg: null },
          { coverImg: undefined },
        ],
      },
      {
        $set: { coverImg: "" },
      }
    );

    console.log("✅ Fixed users:", result);
    res.json({
      message: "Users fixed",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("❌ Error fixing users:", error);
    res.status(500).json({ error: error.message });
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const filter = req.query.searchKeyword;
    let where = {};
    if (filter) {
      where.email = { $regex: filter, $options: "i" };
    }
    let query = User.find(where);
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * pageSize;
    const total = await User.find(where).countDocuments();
    const pages = Math.ceil(total / pageSize);

    res.header({
      "x-filter": filter,
      "x-totalcount": JSON.stringify(total),
      "x-currentpage": JSON.stringify(page),
      "x-pagesize": JSON.stringify(pageSize),
      "x-totalpagecount": JSON.stringify(pages),
    });

    if (page > pages) {
      return res.json([]);
    }

    const result = await query
      .skip(skip)
      .limit(pageSize)
      .sort({ updatedAt: "desc" });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.userId);

    if (!user) {
      throw new Error("User no found");
    }

    const postsToDelete = await Post.find({ user: user._id });
    const postIdsToDelete = postsToDelete.map((post) => post._id);

    await Comment.deleteMany({
      post: { $in: postIdsToDelete },
    });

    await Post.deleteMany({
      _id: { $in: postIdsToDelete },
    });

    postsToDelete.forEach((post) => {
      fileRemover(post.photo);
    });

    await user.remove();
    fileRemover(user.avatar);

    res.status(204).json({ message: "Usuario borrado con éxito" });
  } catch (error) {
    next(error);
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { userId } = req.params; // Ensure userId is correctly received
    const user = await User.findById(userId).populate(
      "friends", // 🔥 Populate full friend objects
      "_id name avatar" // Specify only needed fields
    );

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(user.friends); // ✅ Return populated friends
  } catch (err) {
    console.error("Error al obtener los amigos del usuario:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
};

export const toggleFriend = async (req, res, next) => {
  try {
    const { userId } = req.params; // The ID of the user to add/remove as friend
    const currentUser = await User.findById(req.user.id);
    const friend = await User.findById(userId);

    if (!friend) return res.status(404).json({ message: "User not found" });

    let friendAdded = false;

    if (currentUser.friends.includes(userId)) {
      // Remove Friend
      currentUser.friends = currentUser.friends.filter(
        (id) => id.toString() !== userId
      );
      friend.friends = friend.friends.filter(
        (id) => id.toString() !== currentUser.id
      );
    } else {
      // Add Friend
      currentUser.friends.push(userId);
      friend.friends.push(currentUser.id);
      friendAdded = true;
    }

    await currentUser.save();
    await friend.save();

    // If a friend was added, create a notification for the recipient
    if (friendAdded) {
      // Use currentUser.name as the sender's name
      await createFriendAddedNotification(
        currentUser._id,
        currentUser.name,
        userId
      );
    }

    res.json({ friends: currentUser.friends });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error toggling friend" });
  }
};

export const userProfileById = async (req, res) => {
  try {
    const { userId } = req.params; // Now using userId
    const user = await User.findById(userId).select("-password"); // Exclude password field

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error al obtener perfil de usuario:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

const getUserCount = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error en getUserCount:", error);
    res.status(500).json({ error: "Error al obtener el contador de usuarios" });
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    console.log(`Password reset requested for: ${email}`);

    // Find user in MongoDB by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        message: "No existe una cuenta con este email",
      });
    }

    console.log(`User found: ${user.name} (ID: ${user._id})`);

    // Generate random reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash the token before saving to database
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save hashed token and expiration to user record
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    console.log(`Token saved to database for user: ${user.email}`);

    // Send email with the original (unhashed) token
    try {
      await sendPasswordResetEmail(user.email, resetToken);

      res.status(200).json({
        message: "Email de recuperación enviado exitosamente",
      });
    } catch (emailError) {
      // If email fails, remove token from database
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      console.error("Email sending failed:", emailError);
      return res.status(500).json({
        message: "Error enviando el email. Intenta nuevamente.",
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    next(error);
  }
};

// NEW CONTROLLER 2: Verify Reset Token
export const verifyResetToken = async (req, res, next) => {
  try {
    const { token } = req.params;

    console.log(`Verifying reset token: ${token}`);

    // Hash the token from URL to compare with database
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with this token that hasn't expired
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      console.log("Token not found or expired");
      return res.status(400).json({
        message: "Token inválido o expirado",
      });
    }

    console.log(`Valid token for user: ${user.email}`);

    res.status(200).json({
      message: "Token válido",
      email: user.email,
    });
  } catch (error) {
    console.error("Verify token error:", error);
    next(error);
  }
};

// NEW CONTROLLER 3: Reset Password
export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    // Validate password
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        message: "La contraseña debe tener al menos 6 caracteres",
      });
    }

    // Find user with valid token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Token inválido o expirado",
      });
    }

    // 🔥 KEY CHANGE: Let the User model hash the password automatically
    user.password = newPassword; // Don't hash manually!
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save(); // This triggers the model's password hashing

    res.status(200).json({
      message: "Contraseña actualizada exitosamente",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    next(error);
  }
};
export {
  registerUser,
  loginUser,
  userProfile,
  updateProfile,
  updateProfilePicture,
  getAllUsers,
  deleteUser,
  getUserCount,
};
