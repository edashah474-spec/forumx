// ============================================
// ForumX — forum.js
// Group 15 | Web Technology Project
// This file handles all core forum features
// Topics, Replies, Upvotes, Search, Filter
// ============================================


// ============================================
// SECTION 1 — CREATE A NEW TOPIC
// ============================================

function createTopic(title, body, category) {
  // Check if user is logged in
  if (!isLoggedIn()) {
    return { success: false, message: "You must be logged in to create a topic!" }
  }

  // Check fields are not empty
  if (!title || !body || !category) {
    return { success: false, message: "Title, body and category are all required!" }
  }

  // Check title length
  if (title.length < 5) {
    return { success: false, message: "Title must be at least 5 characters long!" }
  }

  // Check body length
  if (body.length < 10) {
    return { success: false, message: "Topic body must be at least 10 characters long!" }
  }

  let user   = getCurrentUser()
  let topics = getTopics()

  // Create new topic object
  let newTopic = {
    id:         generateId(topics),
    title:      title,
    body:       body,
    category:   category,
    authorId:   user.id,
    authorName: user.name,
    date:       new Date().toISOString(),
    isPinned:   false,
    isLocked:   false,
    upvotes:    0,
    replyCount: 0,
    views:      0
  }

  // Save topic
  topics.push(newTopic)
  saveTopics(topics)

  // Update user post count
  updatePostCount(user.id)

  // Log activity
  logActivity(user.id, user.username, "Created topic: " + title)

  return { success: true, message: "Topic created successfully!", topic: newTopic }
}


// ============================================
// SECTION 2 — GET ALL TOPICS
// ============================================

function getAllTopics() {
  let topics = getTopics()

  // Pinned topics come first, then by date newest first
  return topics.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return new Date(b.date) - new Date(a.date)
  })
}


// ============================================
// SECTION 3 — GET TOPICS BY CATEGORY
// ============================================

function getTopicsByCategory(category) {
  let topics = getAllTopics()
  return topics.filter(t => t.category === category)
}


// ============================================
// SECTION 4 — GET SINGLE TOPIC BY ID
// ============================================

function getTopicById(topicId) {
  let topics = getTopics()
  let topic  = topics.find(t => t.id === topicId)

  if (!topic) {
    return { success: false, message: "Topic not found!" }
  }

  // Increase view count every time topic is opened
  incrementViews(topicId)

  return { success: true, topic: topic }
}


// ============================================
// SECTION 5 — INCREMENT VIEWS
// ============================================

function incrementViews(topicId) {
  let topics = getTopics()
  let idx    = topics.findIndex(t => t.id === topicId)
  if (idx !== -1) {
    topics[idx].views += 1
    saveTopics(topics)
  }
}


// ============================================
// SECTION 6 — DELETE A TOPIC
// ============================================

function deleteTopic(topicId) {
  if (!isLoggedIn()) {
    return { success: false, message: "You must be logged in!" }
  }

  let user   = getCurrentUser()
  let topics = getTopics()
  let topic  = topics.find(t => t.id === topicId)

  if (!topic) {
    return { success: false, message: "Topic not found!" }
  }

  // Only admin, moderator, or the author can delete
  if (!isAdmin() && !isModerator() && topic.authorId !== user.id) {
    return { success: false, message: "You do not have permission to delete this topic!" }
  }

  // Remove topic
  let updated = topics.filter(t => t.id !== topicId)
  saveTopics(updated)

  // Also remove all replies of this topic
  let replies        = getReplies()
  let updatedReplies = replies.filter(r => r.topicId !== topicId)
  saveReplies(updatedReplies)

  logActivity(user.id, user.username, "Deleted topic: " + topic.title)

  return { success: true, message: "Topic deleted successfully!" }
}


// ============================================
// SECTION 7 — EDIT A TOPIC
// ============================================

function editTopic(topicId, newTitle, newBody) {
  if (!isLoggedIn()) {
    return { success: false, message: "You must be logged in!" }
  }

  let user   = getCurrentUser()
  let topics = getTopics()
  let idx    = topics.findIndex(t => t.id === topicId)

  if (idx === -1) {
    return { success: false, message: "Topic not found!" }
  }

  // Only author or admin can edit
  if (topics[idx].authorId !== user.id && !isAdmin()) {
    return { success: false, message: "You can only edit your own topics!" }
  }

  topics[idx].title = newTitle
  topics[idx].body  = newBody
  saveTopics(topics)

  logActivity(user.id, user.username, "Edited topic: " + newTitle)

  return { success: true, message: "Topic updated successfully!" }
}


// ============================================
// SECTION 8 — POST A REPLY
// ============================================

function postReply(topicId, body, parentReplyId = null) {
  if (!isLoggedIn()) {
    return { success: false, message: "You must be logged in to reply!" }
  }

  if (!body || body.trim() === "") {
    return { success: false, message: "Reply cannot be empty!" }
  }

  // Check if topic exists and is not locked
  let topics = getTopics()
  let topic  = topics.find(t => t.id === topicId)

  if (!topic) {
    return { success: false, message: "Topic not found!" }
  }

  if (topic.isLocked) {
    return { success: false, message: "This topic is locked. No more replies allowed!" }
  }

  let user    = getCurrentUser()
  let replies = getReplies()

  // Create new reply object
  let newReply = {
    id:            generateId(replies),
    topicId:       topicId,
    body:          body,
    authorId:      user.id,
    authorName:    user.name,
    date:          new Date().toISOString(),
    upvotes:       0,
    parentReplyId: parentReplyId
  }

  // Save reply
  replies.push(newReply)
  saveReplies(replies)

  // Update reply count on topic
  let tIdx = topics.findIndex(t => t.id === topicId)
  topics[tIdx].replyCount += 1
  saveTopics(topics)

  // Update user post count
  updatePostCount(user.id)

  logActivity(user.id, user.username, "Replied to topic: " + topic.title)

  return { success: true, message: "Reply posted successfully!", reply: newReply }
}


// ============================================
// SECTION 9 — GET ALL REPLIES FOR A TOPIC
// ============================================

function getRepliesForTopic(topicId) {
  let replies = getReplies()

  // Get only replies for this topic, sorted by date
  return replies
    .filter(r => r.topicId === topicId)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
}


// ============================================
// SECTION 10 — DELETE A REPLY
// ============================================

function deleteReply(replyId) {
  if (!isLoggedIn()) {
    return { success: false, message: "You must be logged in!" }
  }

  let user    = getCurrentUser()
  let replies = getReplies()
  let reply   = replies.find(r => r.id === replyId)

  if (!reply) {
    return { success: false, message: "Reply not found!" }
  }

  // Only admin, moderator, or the author can delete
  if (!isAdmin() && !isModerator() && reply.authorId !== user.id) {
    return { success: false, message: "You do not have permission to delete this reply!" }
  }

  let updated = replies.filter(r => r.id !== replyId)
  saveReplies(updated)

  // Decrease reply count on topic
  let topics = getTopics()
  let tIdx   = topics.findIndex(t => t.id === reply.topicId)
  if (tIdx !== -1 && topics[tIdx].replyCount > 0) {
    topics[tIdx].replyCount -= 1
    saveTopics(topics)
  }

  logActivity(user.id, user.username, "Deleted a reply")

  return { success: true, message: "Reply deleted successfully!" }
}


// ============================================
// SECTION 11 — UPVOTE A TOPIC
// ============================================

function upvoteTopic(topicId) {
  if (!isLoggedIn()) {
    return { success: false, message: "You must be logged in to upvote!" }
  }

  let topics = getTopics()
  let idx    = topics.findIndex(t => t.id === topicId)

  if (idx === -1) {
    return { success: false, message: "Topic not found!" }
  }

  topics[idx].upvotes += 1
  saveTopics(topics)

  return { success: true, upvotes: topics[idx].upvotes }
}


// ============================================
// SECTION 12 — UPVOTE A REPLY
// ============================================

function upvoteReply(replyId) {
  if (!isLoggedIn()) {
    return { success: false, message: "You must be logged in to upvote!" }
  }

  let replies = getReplies()
  let idx     = replies.findIndex(r => r.id === replyId)

  if (idx === -1) {
    return { success: false, message: "Reply not found!" }
  }

  replies[idx].upvotes += 1
  saveReplies(replies)

  return { success: true, upvotes: replies[idx].upvotes }
}


// ============================================
// SECTION 13 — SEARCH TOPICS
// ============================================

function searchTopics(keyword) {
  if (!keyword || keyword.trim() === "") {
    return getAllTopics()
  }

  let topics  = getAllTopics()
  let kw      = keyword.toLowerCase()

  return topics.filter(t =>
    t.title.toLowerCase().includes(kw) ||
    t.body.toLowerCase().includes(kw)  ||
    t.category.toLowerCase().includes(kw)
  )
}


// ============================================
// SECTION 14 — UPDATE USER POST COUNT
// ============================================

function updatePostCount(userId) {
  let users   = getUsers()
  let topics  = getTopics().filter(t => t.authorId === userId)
  let replies = getReplies().filter(r => r.authorId === userId)
  let idx     = users.findIndex(u => u.id === userId)

  if (idx !== -1) {
    users[idx].postCount = topics.length + replies.length
    saveUsers(users)
  }
}


// ============================================
// SECTION 15 — GET RECENT TOPICS
// ============================================

function getRecentTopics(limit = 5) {
  let topics = getTopics()
  return topics
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit)
}