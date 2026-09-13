import jwt from "jsonwebtoken";

// VERIFY JWT TOKEN
export function verifyToken(token) {
  if (!token) {
    return {
      success: false,
      message: "No token provided",
    };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return {
      success: true,
      user: decoded,
    };
  } catch (error) {
    return {
      success: false,
      message: "Invalid or expired token",
    };
  }
}

// CHECK ADMIN
export function isAdmin(user) {
  return user?.role === "admin";
}

// CHECK NORMAL USER
export function isUser(user) {
  return user?.role === "user";
}
