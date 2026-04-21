// ============================================
// ForumX — data.js
// Group 15 | Web Technology Project
// This file handles all data storage
// using localStorage (our "database")
// ============================================


// ============================================
// SECTION 1 — DEFAULT DATA (Pre-loaded users)
// ============================================

const defaultUsers = [
  {
    id: 1,
    name: "Admin User",
    username: "admin_forumx",
    email: "admin@forumx.com",
    password: "admin123",
    role: "admin",
    joinDate: "2024-01-01",
    lastActive: new Date().toISOString(),
    postCount: 24,
    isBanned: false,
    avatar: "AU"
  },
  {
    id: 2,
    name: "Mod Sara",
    username: "mod_sara",
    email: "sara@forumx.com",
    password: "mod123",
    role: "moderator",
    joinDate: "2024-02-10",
    lastActive: new Date().toISOString(),
    postCount: 18,
    isBanned: false,
    avatar: "MS"
  },
  {
    id: 3,
    name: "Ravi Kumar",
    username: "ravi_k",
    email: "ravi@forumx.com",
    password: "ravi123",
    role: "member",
    joinDate: "2024-03-15",
    lastActive: new Date().toISOString(),
    postCount: 9,
    isBanned: false,
    avatar: "RK"
  }
]

const defaultTopics = [
  {
    id: 1,
    title: "Welcome to ForumX!",
    body: "This is the official ForumX discussion forum. Feel free to post topics, ask questions, and help others. Be respectful and follow the community guidelines.",
    category: "Announcements",
    authorId: 1,
    authorName: "Admin User",
    date: "2024-01-01",
    isPinned: true,
    isLocked: false,
    upvotes: 15,
    replyCount: 2,
    views: 120
  },
  {
    id: 2,
    title: "How do I center a div in CSS?",
    body: "I have been trying to center a div both horizontally and vertically for hours. Can someone please help me with the correct CSS approach?",
    category: "Technology",
    authorId: 3,
    authorName: "Ravi Kumar",
    date: "2024-03-16",
    isPinned: false,
    isLocked: false,
    upvotes: 8,
    replyCount: 3,
    views: 45
  },
  {
    id: 3,
    title: "Best resources to learn JavaScript in 2024",
    body: "Hey everyone! I am a beginner in web development. Can anyone suggest the best free resources to learn JavaScript from scratch?",
    category: "Technology",
    authorId: 3,
    authorName: "Ravi Kumar",
    date: "2024-03-20",
    isPinned: false,
    isLocked: false,
    upvotes: 12,
    replyCount: 1,
    views: 67
  },
  {
    id: 4,
    title: "Forum rules and guidelines",
    body: "Please read the following rules before posting: 1. Be respectful. 2. No spam. 3. Stay on topic. 4. No hate speech. Violation will result in a ban.",
    category: "Announcements",
    authorId: 1,
    authorName: "Admin User",
    date: "2024-01-05",
    isPinned: true,
    isLocked: true,
    upvotes: 20,
    replyCount: 0,
    views: 200
  }
]

const defaultReplies = [
  {
    id: 1,
    topicId: 1,
    body: "Thanks for creating this forum! Looking forward to great discussions.",
    authorId: 3,
    authorName: "Ravi Kumar",
    date: "2024-01-02",
    upvotes: 3,
    parentReplyId: null
  },
  {
    id: 2,
    topicId: 1,
    body: "Welcome everyone! Feel free to reach out if you need any help.",
    authorId: 2,
    authorName: "Mod Sara",
    date: "2024-01-03",
    upvotes: 5,
    parentReplyId: null
  },
  {
    id: 3,
    topicId: 2,
    body: "You can use flexbox! Try: display:flex; justify-content:center; align-items:center; on the parent container.",
    authorId: 2,
    authorName: "Mod Sara",
    date: "2024-03-17",
    upvotes: 7,
    parentReplyId: null
  },
  {
    id: 4,
    topicId: 2,
    body: "Also CSS Grid works great: display:grid; place-items:center;",
    authorId: 1,
    authorName: "Admin User",
    date: "2024-03-17",
    upvotes: 4,
    parentReplyId: null
  },
  {
    id: 5,
    topicId: 2,
    body: "Thank you both! Flexbox worked perfectly for me.",
    authorId: 3,
    authorName: "Ravi Kumar",
    date: "2024-03-18",
    upvotes: 2,
    parentReplyId: 3
  },
  {
    id: 6,
    topicId: 3,
    body: "I recommend The Odin Project and freeCodeCamp. Both are completely free and beginner friendly!",
    authorId: 2,
    authorName: "Mod Sara",
    date: "2024-03-21",
    upvotes: 6,
    parentReplyId: null
  }
]

const defaultCategories = [
  { id: 1, name: "Announcements",  icon: "📢", color: "#6366f1" },
  { id: 2, name: "Technology",     icon: "💻", color: "#4f7cff" },
  { id: 3, name: "General",        icon: "💬", color: "#8b5cf6" },
  { id: 4, name: "Help & Support", icon: "🆘", color: "#ec4899" }
]

const defaultActivityLog = [
  { id: 1, userId: 1, username: "admin_forumx", action: "Created topic: Welcome to ForumX!",      date: "2024-01-01" },
  { id: 2, userId: 3, username: "ravi_k",        action: "Registered account",                     date: "2024-03-15" },
  { id: 3, userId: 3, username: "ravi_k",        action: "Created topic: How do I center a div?",  date: "2024-03-16" },
  { id: 4, userId: 2, username: "mod_sara",      action: "Replied to: How do I center a div?",     date: "2024-03-17" }
]


// ============================================
// SECTION 2 — INITIALIZE LOCALSTORAGE
// ============================================

function initData() {
  if (!localStorage.getItem("fx_users")) {
    localStorage.setItem("fx_users", JSON.stringify(defaultUsers))
  }
  if (!localStorage.getItem("fx_topics")) {
    localStorage.setItem("fx_topics", JSON.stringify(defaultTopics))
  }
  if (!localStorage.getItem("fx_replies")) {
    localStorage.setItem("fx_replies", JSON.stringify(defaultReplies))
  }
  if (!localStorage.getItem("fx_categories")) {
    localStorage.setItem("fx_categories", JSON.stringify(defaultCategories))
  }
  if (!localStorage.getItem("fx_activity")) {
    localStorage.setItem("fx_activity", JSON.stringify(defaultActivityLog))
  }
  if (!localStorage.getItem("fx_currentUser")) {
    localStorage.setItem("fx_currentUser", JSON.stringify(null))
  }
  console.log("ForumX data initialized successfully!")
}


// ============================================
// SECTION 3 — GET DATA FUNCTIONS
// ============================================

function getUsers()       { return JSON.parse(localStorage.getItem("fx_users"))       || [] }
function getTopics()      { return JSON.parse(localStorage.getItem("fx_topics"))      || [] }
function getReplies()     { return JSON.parse(localStorage.getItem("fx_replies"))     || [] }
function getCategories()  { return JSON.parse(localStorage.getItem("fx_categories"))  || [] }
function getActivity()    { return JSON.parse(localStorage.getItem("fx_activity"))    || [] }
function getCurrentUser() { return JSON.parse(localStorage.getItem("fx_currentUser"))       }


// ============================================
// SECTION 4 — SAVE DATA FUNCTIONS
// ============================================

function saveUsers(users)      { localStorage.setItem("fx_users",       JSON.stringify(users))  }
function saveTopics(topics)    { localStorage.setItem("fx_topics",      JSON.stringify(topics)) }
function saveReplies(replies)  { localStorage.setItem("fx_replies",     JSON.stringify(replies))}
function saveActivity(log)     { localStorage.setItem("fx_activity",    JSON.stringify(log))    }
function saveCurrentUser(user) { localStorage.setItem("fx_currentUser", JSON.stringify(user))   }


// ============================================
// SECTION 5 — ID GENERATOR
// ============================================

function generateId(arr) {
  if (arr.length === 0) return 1
  return Math.max(...arr.map(item => item.id)) + 1
}


// ============================================
// SECTION 6 — LOG ACTIVITY
// ============================================

function logActivity(userId, username, action) {
  let log = getActivity()
  log.unshift({
    id: generateId(log),
    userId,
    username,
    action,
    date: new Date().toISOString()
  })
  if (log.length > 100) log = log.slice(0, 100)
  saveActivity(log)
}


// ============================================
// SECTION 7 — FORUM STATS
// ============================================

function getForumStats() {
  return {
    totalUsers:   getUsers().length,
    totalTopics:  getTopics().length,
    totalReplies: getReplies().length,
    totalPosts:   getTopics().length + getReplies().length
  }
}


// ============================================
// SECTION 8 — RESET ALL DATA (testing only)
// ============================================

function resetAllData() {
  localStorage.removeItem("fx_users")
  localStorage.removeItem("fx_topics")
  localStorage.removeItem("fx_replies")
  localStorage.removeItem("fx_categories")
  localStorage.removeItem("fx_activity")
  localStorage.removeItem("fx_currentUser")
  initData()
  console.log("ForumX data has been reset!")
}