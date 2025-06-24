import { getUserIds, getData, setData, clearData } from "./storage.js";

// Clear existing data for demo users (optional reset)
clearData("1");
clearData("2");

// Get references to key DOM elements
const userSelect = document.getElementById("user-select");
const bookmarksDiv = document.getElementById("bookmarks");
const form = document.getElementById("bookmark-form");

let currentUser = null;

// Initialize on window load
window.onload = () => {
  loadUsers();
  userSelect.addEventListener("change", handleUserChange);
  form.addEventListener("submit", handleFormSubmit);
};

// Load users into dropdown
function loadUsers() {
  const users = getUserIds();
  userSelect.innerHTML = `<option value="">-- Select a user --</option>`;
  for (const id of users) {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = `User ${id}`;
    userSelect.appendChild(option);
  }
}

// Handle user selection change
function handleUserChange() {
  currentUser = userSelect.value;
  if (currentUser) {
    showBookmarks(currentUser);
  } else {
    bookmarksDiv.textContent = "";
  }
}

// Display bookmarks for the selected user
function showBookmarks(userId) {
  const bookmarks = getData(userId) || [];

  if (bookmarks.length === 0) {
    bookmarksDiv.textContent = "No bookmarks found for this user.";
    return;
  }

  // Sort bookmarks by newest first
  bookmarks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const list = document.createElement("ul");

  for (const bm of bookmarks) {
    const item = document.createElement("li");

    // Title as clickable link
    const link = document.createElement("a");
    link.href = bm.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = bm.title;
    link.setAttribute("aria-label", `Bookmark titled ${bm.title}`);
    item.appendChild(link);

    // Description next to title
    item.appendChild(document.createTextNode(` - ${bm.description}`));

    // Timestamp
    const timestamp = document.createElement("small");
    timestamp.textContent = new Date(bm.createdAt).toLocaleString();
    const timestampWrapper = document.createElement("div");
    timestampWrapper.appendChild(timestamp);
    item.appendChild(timestampWrapper);

    list.appendChild(item);
  }

  // Replace old content
  bookmarksDiv.innerHTML = "";
  bookmarksDiv.appendChild(list);
}

// Handle form submission to add a new bookmark
function handleFormSubmit(event) {
  event.preventDefault();

  if (!currentUser) {
    alert("Please select a user first.");
    return;
  }

  // Get form values
  const url = document.getElementById("url").value.trim();
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();

  if (!url || !title || !description) return;

  const newBookmark = {
    url,
    title,
    description,
    createdAt: new Date().toISOString(),
  };

  const userBookmarks = getData(currentUser) || [];
  userBookmarks.push(newBookmark);
  setData(currentUser, userBookmarks);

  form.reset();
  showBookmarks(currentUser);
}
