// ============================================
// ForumX — app.js
// Group 15 | Web Technology Project
// This is the MAIN file that connects
// all JS files together and runs the app
// ============================================


// ============================================
// SECTION 1 — START THE APP
// ============================================

function initApp() {
  // Step 1: Initialize all data in localStorage
  initData()

  // Step 2: Check if user is already logged in
  let user = getCurrentUser()
  if (user) {
    console.log("Welcome back " + user.name + " | Role: " + user.role)
  } else {
    console.log("No user logged in — showing guest view")
  }

  // Step 3: Load the page
  loadPage()

  console.log("ForumX app started successfully!")
}


// ============================================
// SECTION 2 — LOAD PAGE BASED ON URL
// ============================================

function loadPage() {
  let page = window.location.pathname

  if (page.includes("index")    || page === "/") renderHomePage()
  if (page.includes("forum"))                    renderForumPage()
  if (page.includes("topic"))                    renderTopicPage()
  if (page.includes("profile"))                  renderProfilePage()
  if (page.includes("admin"))                    renderAdminPage()
  if (page.includes("login"))                    renderLoginPage()
  if (page.includes("register"))                 renderRegisterPage()
}


// ============================================
// SECTION 3 — RENDER HOME PAGE DATA
// ============================================

function renderHomePage() {
  let stats        = getForumStats()
  let recentTopics = getRecentTopics(5)
  let activeUsers  = getMostActiveUsers(5)
  let categoryStats = getCategoryStats()

  console.log("Home page stats:", stats)
  console.log("Recent topics:", recentTopics)
  console.log("Active users:", activeUsers)
  console.log("Categories:", categoryStats)

  // Pass data to HTML elements (your friend uses these)
  updateElement("total-users",   stats.totalUsers)
  updateElement("total-topics",  stats.totalTopics)
  updateElement("total-posts",   stats.totalPosts)
  updateElement("total-replies", stats.totalReplies)
}


// ============================================
// SECTION 4 — RENDER FORUM PAGE DATA
// ============================================

function renderForumPage() {
  let topics     = getAllTopics()
  let categories = getCategories()

  console.log("Forum topics loaded:", topics.length)

  // Your friend's HTML will call displayTopics()
  // to loop through and show topics on screen
}


// ============================================
// SECTION 5 — RENDER TOPIC PAGE DATA
// ============================================

function renderTopicPage() {
  // Get topic ID from URL
  let params  = new URLSearchParams(window.location.search)
  let topicId = parseInt(params.get("id"))

  if (!topicId) return

  let result  = getTopicById(topicId)
  let replies = getRepliesForTopic(topicId)

  if (result.success) {
    console.log("Topic loaded:", result.topic)
    console.log("Replies loaded:", replies.length)
  }
}


// ============================================
// SECTION 6 — RENDER PROFILE PAGE DATA
// ============================================

function renderProfilePage() {
  let params = new URLSearchParams(window.location.search)
  let userId = parseInt(params.get("id"))

  // If no ID in URL, show current user's profile
  if (!userId && isLoggedIn()) {
    userId = getCurrentUser().id
  }

  if (!userId) return

  let profileStats = getUserProfileStats(userId)
  let userTopics   = getUserTopics(userId)
  let userReplies  = getUserReplies(userId)

  console.log("Profile stats:", profileStats)
  console.log("User topics:", userTopics)
  console.log("User replies:", userReplies)
}


// ============================================
// SECTION 7 — RENDER ADMIN PAGE DATA
// ============================================

function renderAdminPage() {
  // Block non-admins from accessing admin page
  if (!isAdmin() && !isModerator()) {
    alert("Access Denied! You do not have permission to view this page.")
    window.location.href = "index.html"
    return
  }

  let adminStats = getAdminStats()
  let allUsers   = getAllUsers()
  let modLogs    = getModerationLogs()
  let activityFeed = getRecentActivityFeed(20)

  console.log("Admin stats:", adminStats)
  console.log("All users:", allUsers)
  console.log("Mod logs:", modLogs)
}


// ============================================
// SECTION 8 — RENDER LOGIN PAGE
// ============================================

function renderLoginPage() {
  // If already logged in redirect to forum
  if (isLoggedIn()) {
    window.location.href = "forum.html"
  }
}


// ============================================
// SECTION 9 — RENDER REGISTER PAGE
// ============================================

function renderRegisterPage() {
  // If already logged in redirect to forum
  if (isLoggedIn()) {
    window.location.href = "forum.html"
  }
}


// ============================================
// SECTION 10 — HELPER: UPDATE HTML ELEMENT
// ============================================

function updateElement(id, value) {
  let el = document.getElementById(id)
  if (el) el.innerText = value
}


// ============================================
// SECTION 11 — HELPER: SHOW MESSAGE
// ============================================

function showMessage(elementId, message, type = "success") {
  let el = document.getElementById(elementId)
  if (!el) return

  el.innerText        = message
  el.style.display    = "block"
  el.style.color      = type === "success" ? "#22c55e" : "#ef4444"
  el.style.padding    = "10px"
  el.style.borderRadius = "6px"
  el.style.marginTop  = "10px"

  // Auto hide after 4 seconds
  setTimeout(() => { el.style.display = "none" }, 4000)
}


// ============================================
// SECTION 12 — HANDLE LOGIN FORM SUBMIT
// ============================================

function handleLogin() {
  let email    = document.getElementById("login-email").value.trim()
  let password = document.getElementById("login-password").value.trim()

  if (!email || !password) {
    showMessage("login-msg", "Please fill in all fields!", "error")
    return
  }

  let result = loginUser(email, password)

  if (result.success) {
    showMessage("login-msg", result.message, "success")
    setTimeout(() => { window.location.href = "forum.html" }, 1000)
  } else {
    showMessage("login-msg", result.message, "error")
  }
}


// ============================================
// SECTION 13 — HANDLE REGISTER FORM SUBMIT
// ============================================

function handleRegister() {
  let name     = document.getElementById("reg-name").value.trim()
  let username = document.getElementById("reg-username").value.trim()
  let email    = document.getElementById("reg-email").value.trim()
  let password = document.getElementById("reg-password").value.trim()

  let result = registerUser(name, username, email, password)

  if (result.success) {
    showMessage("reg-msg", result.message, "success")
    setTimeout(() => { window.location.href = "login.html" }, 1500)
  } else {
    showMessage("reg-msg", result.message, "error")
  }
}


// ============================================
// SECTION 14 — HANDLE LOGOUT
// ============================================

function handleLogout() {
  logoutUser()
  window.location.href = "index.html"
}


// ============================================
// SECTION 15 — HANDLE NEW TOPIC FORM
// ============================================

function handleCreateTopic() {
  let title    = document.getElementById("topic-title").value.trim()
  let body     = document.getElementById("topic-body").value.trim()
  let category = document.getElementById("topic-category").value

  let result = createTopic(title, body, category)

  if (result.success) {
    showMessage("topic-msg", result.message, "success")
    setTimeout(() => {
      window.location.href = "topic.html?id=" + result.topic.id
    }, 1000)
  } else {
    showMessage("topic-msg", result.message, "error")
  }
}


// ============================================
// SECTION 16 — HANDLE REPLY FORM
// ============================================

function handlePostReply(topicId) {
  let body = document.getElementById("reply-body").value.trim()

  let result = postReply(topicId, body)

  if (result.success) {
    showMessage("reply-msg", result.message, "success")
    document.getElementById("reply-body").value = ""
    renderTopicPage()
  } else {
    showMessage("reply-msg", result.message, "error")
  }
}


// ============================================
// SECTION 17 — RUN APP ON PAGE LOAD
// ============================================

window.onload = function () {
  initApp()
}