// ============================================
// ForumX — moderation.js
// Group 15 | Web Technology Project
// This file handles all moderation features
// Pin, Lock, Delete, Ban, Role Management
// ============================================


// ============================================
// SECTION 1 — PIN A TOPIC
// ============================================

function pinTopic(topicId) {
  if (!isModerator()) {
    return { success: false, message: "Only moderators and admins can pin topics!" }
  }

  let topics = getTopics()
  let idx    = topics.findIndex(t => t.id === topicId)

  if (idx === -1) {
    return { success: false, message: "Topic not found!" }
  }

  // Toggle pin status
  topics[idx].isPinned = !topics[idx].isPinned
  saveTopics(topics)

  let user   = getCurrentUser()
  let status = topics[idx].isPinned ? "Pinned" : "Unpinned"
  logActivity(user.id, user.username, status + " topic: " + topics[idx].title)

  return {
    success: true,
    message: "Topic " + status.toLowerCase() + " successfully!",
    isPinned: topics[idx].isPinned
  }
}


// ============================================
// SECTION 2 — LOCK A TOPIC
// ============================================

function lockTopic(topicId) {
  if (!isModerator()) {
    return { success: false, message: "Only moderators and admins can lock topics!" }
  }

  let topics = getTopics()
  let idx    = topics.findIndex(t => t.id === topicId)

  if (idx === -1) {
    return { success: false, message: "Topic not found!" }
  }

  // Toggle lock status
  topics[idx].isLocked = !topics[idx].isLocked
  saveTopics(topics)

  let user   = getCurrentUser()
  let status = topics[idx].isLocked ? "Locked" : "Unlocked"
  logActivity(user.id, user.username, status + " topic: " + topics[idx].title)

  return {
    success: true,
    message: "Topic " + status.toLowerCase() + " successfully!",
    isLocked: topics[idx].isLocked
  }
}


// ============================================
// SECTION 3 — BAN A USER
// ============================================

function banUser(userId) {
  if (!isAdmin()) {
    return { success: false, message: "Only admins can ban users!" }
  }

  let users = getUsers()
  let idx   = users.findIndex(u => u.id === userId)

  if (idx === -1) {
    return { success: false, message: "User not found!" }
  }

  // Cannot ban another admin
  if (users[idx].role === "admin") {
    return { success: false, message: "You cannot ban another admin!" }
  }

  // Toggle ban status
  users[idx].isBanned = !users[idx].isBanned
  saveUsers(users)

  let admin  = getCurrentUser()
  let status = users[idx].isBanned ? "Banned" : "Unbanned"
  logActivity(admin.id, admin.username, status + " user: " + users[idx].username)

  return {
    success: true,
    message: "User " + status.toLowerCase() + " successfully!",
    isBanned: users[idx].isBanned
  }
}


// ============================================
// SECTION 4 — ASSIGN ROLE TO USER
// ============================================

function assignRole(userId, newRole) {
  if (!isAdmin()) {
    return { success: false, message: "Only admins can assign roles!" }
  }

  // Valid roles only
  let validRoles = ["member", "moderator", "admin"]
  if (!validRoles.includes(newRole)) {
    return { success: false, message: "Invalid role! Must be member, moderator or admin." }
  }

  let users = getUsers()
  let idx   = users.findIndex(u => u.id === userId)

  if (idx === -1) {
    return { success: false, message: "User not found!" }
  }

  let oldRole        = users[idx].role
  users[idx].role    = newRole
  saveUsers(users)

  let admin = getCurrentUser()
  logActivity(
    admin.id,
    admin.username,
    "Changed role of " + users[idx].username + " from " + oldRole + " to " + newRole
  )

  return {
    success: true,
    message: users[idx].username + " is now a " + newRole + "!"
  }
}


// ============================================
// SECTION 5 — DELETE ANY POST (ADMIN)
// ============================================

function adminDeleteTopic(topicId) {
  if (!isAdmin() && !isModerator()) {
    return { success: false, message: "You do not have permission to do this!" }
  }
  return deleteTopic(topicId)
}

function adminDeleteReply(replyId) {
  if (!isAdmin() && !isModerator()) {
    return { success: false, message: "You do not have permission to do this!" }
  }
  return deleteReply(replyId)
}


// ============================================
// SECTION 6 — GET ALL USERS (ADMIN PANEL)
// ============================================

function getAllUsers() {
  if (!isAdmin() && !isModerator()) {
    return { success: false, message: "Access denied!" }
  }

  let users = getUsers()
  return {
    success: true,
    users: users.map(u => ({
      id:         u.id,
      name:       u.name,
      username:   u.username,
      email:      u.email,
      role:       u.role,
      joinDate:   u.joinDate,
      lastActive: u.lastActive,
      postCount:  u.postCount,
      isBanned:   u.isBanned,
      avatar:     u.avatar
    }))
  }
}


// ============================================
// SECTION 7 — GET MODERATION LOGS
// ============================================

function getModerationLogs() {
  if (!isAdmin() && !isModerator()) {
    return { success: false, message: "Access denied!" }
  }

  let log = getActivity()

  // Filter only moderation related actions
  let modActions = ["Pinned", "Unpinned", "Locked", "Unlocked", "Banned", "Unbanned", "Deleted", "Changed role"]

  let filtered = log.filter(entry =>
    modActions.some(action => entry.action.startsWith(action))
  )

  return { success: true, logs: filtered }
}


// ============================================
// SECTION 8 — GET FULL ACTIVITY LOG (ADMIN)
// ============================================

function getFullActivityLog() {
  if (!isAdmin()) {
    return { success: false, message: "Only admins can view the full activity log!" }
  }

  return { success: true, logs: getActivity() }
}


// ============================================
// SECTION 9 — GET ADMIN DASHBOARD STATS
// ============================================

function getAdminStats() {
  if (!isAdmin() && !isModerator()) {
    return { success: false, message: "Access denied!" }
  }

  let users   = getUsers()
  let topics  = getTopics()
  let replies = getReplies()

  let bannedUsers     = users.filter(u => u.isBanned).length
  let lockedTopics    = topics.filter(t => t.isLocked).length
  let pinnedTopics    = topics.filter(t => t.isPinned).length
  let adminCount      = users.filter(u => u.role === "admin").length
  let modCount        = users.filter(u => u.role === "moderator").length
  let memberCount     = users.filter(u => u.role === "member").length

  return {
    success: true,
    stats: {
      totalUsers:    users.length,
      totalTopics:   topics.length,
      totalReplies:  replies.length,
      totalPosts:    topics.length + replies.length,
      bannedUsers:   bannedUsers,
      lockedTopics:  lockedTopics,
      pinnedTopics:  pinnedTopics,
      adminCount:    adminCount,
      modCount:      modCount,
      memberCount:   memberCount
    }
  }
}


// ============================================
// SECTION 10 — SEARCH USERS (ADMIN)
// ============================================

function searchUsers(keyword) {
  if (!isAdmin() && !isModerator()) {
    return { success: false, message: "Access denied!" }
  }

  let users = getUsers()
  let kw    = keyword.toLowerCase()

  let filtered = users.filter(u =>
    u.name.toLowerCase().includes(kw)     ||
    u.username.toLowerCase().includes(kw) ||
    u.email.toLowerCase().includes(kw)    ||
    u.role.toLowerCase().includes(kw)
  )

  return { success: true, users: filtered }
}


// ============================================
// SECTION 11 — WARN USER (MODERATOR)
// ============================================

function warnUser(userId, reason) {
  if (!isModerator()) {
    return { success: false, message: "Only moderators and admins can warn users!" }
  }

  let users = getUsers()
  let user  = users.find(u => u.id === userId)

  if (!user) {
    return { success: false, message: "User not found!" }
  }

  let mod = getCurrentUser()
  logActivity(
    mod.id,
    mod.username,
    "Warned user: " + user.username + " | Reason: " + reason
  )

  return {
    success: true,
    message: "Warning issued to " + user.username + " successfully!"
  }
}