// ============================================
// ForumX — activity.js
// Group 15 | Web Technology Project
// This file handles all activity tracking
// User stats, history, recent actions
// ============================================


// ============================================
// SECTION 1 — GET USER ACTIVITY HISTORY
// ============================================

function getUserActivity(userId) {
  let log = getActivity()
  return log
    .filter(entry => entry.userId === userId)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}


// ============================================
// SECTION 2 — GET USER FULL PROFILE STATS
// ============================================

function getUserProfileStats(userId) {
  let user    = getUserById(userId)
  if (!user) return { success: false, message: "User not found!" }

  let topics  = getTopics().filter(t => t.authorId === userId)
  let replies = getReplies().filter(r => r.authorId === userId)
  let activity = getUserActivity(userId)

  // Calculate total upvotes received
  let upvotesReceived = 0
  topics.forEach(t  => upvotesReceived += t.upvotes)
  replies.forEach(r => upvotesReceived += r.upvotes)

  return {
    success: true,
    stats: {
      name:            user.name,
      username:        user.username,
      role:            user.role,
      avatar:          user.avatar,
      joinDate:        user.joinDate,
      lastActive:      user.lastActive,
      totalTopics:     topics.length,
      totalReplies:    replies.length,
      totalPosts:      topics.length + replies.length,
      upvotesReceived: upvotesReceived,
      isBanned:        user.isBanned,
      recentActivity:  activity.slice(0, 5)
    }
  }
}


// ============================================
// SECTION 3 — GET MOST ACTIVE USERS
// ============================================

function getMostActiveUsers(limit = 5) {
  let users = getUsers()

  return users
    .filter(u => !u.isBanned)
    .sort((a, b) => b.postCount - a.postCount)
    .slice(0, limit)
    .map(u => ({
      id:        u.id,
      name:      u.name,
      username:  u.username,
      role:      u.role,
      avatar:    u.avatar,
      postCount: u.postCount
    }))
}


// ============================================
// SECTION 4 — GET MOST UPVOTED TOPICS
// ============================================

function getMostUpvotedTopics(limit = 5) {
  let topics = getTopics()
  return topics
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, limit)
}


// ============================================
// SECTION 5 — GET MOST VIEWED TOPICS
// ============================================

function getMostViewedTopics(limit = 5) {
  let topics = getTopics()
  return topics
    .sort((a, b) => b.views - a.views)
    .slice(0, limit)
}


// ============================================
// SECTION 6 — GET RECENT ACTIVITY FEED
// ============================================

function getRecentActivityFeed(limit = 10) {
  let log = getActivity()
  return log
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit)
}


// ============================================
// SECTION 7 — FORMAT DATE (helper)
// ============================================

function formatDate(dateString) {
  let date = new Date(dateString)
  let now  = new Date()
  let diff = Math.floor((now - date) / 1000)

  if (diff < 60)                    return "Just now"
  if (diff < 3600)                  return Math.floor(diff / 60) + " minutes ago"
  if (diff < 86400)                 return Math.floor(diff / 3600) + " hours ago"
  if (diff < 604800)                return Math.floor(diff / 86400) + " days ago"

  return date.toLocaleDateString("en-IN", {
    day:   "numeric",
    month: "short",
    year:  "numeric"
  })
}


// ============================================
// SECTION 8 — GET CATEGORY STATS
// ============================================

function getCategoryStats() {
  let topics     = getTopics()
  let categories = getCategories()

  return categories.map(cat => {
    let catTopics = topics.filter(t => t.category === cat.name)
    return {
      name:        cat.name,
      icon:        cat.icon,
      color:       cat.color,
      topicCount:  catTopics.length,
      replyCount:  catTopics.reduce((sum, t) => sum + t.replyCount, 0),
      totalViews:  catTopics.reduce((sum, t) => sum + t.views, 0)
    }
  })
}


// ============================================
// SECTION 9 — GET USER TOPICS
// ============================================

function getUserTopics(userId) {
  return getTopics()
    .filter(t => t.authorId === userId)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}


// ============================================
// SECTION 10 — GET USER REPLIES
// ============================================

function getUserReplies(userId) {
  return getReplies()
    .filter(r => r.authorId === userId)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}