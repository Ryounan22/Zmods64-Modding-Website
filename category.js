function timeAgo(dateString) {
  const now = new Date();
  const postDate = new Date(dateString);
  const seconds = Math.floor((now - postDate) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 }
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count > 0) {
      return count === 1 ? `${count} ${interval.label} ago` : `${count} ${interval.label}s ago`;
    }
  }
  return "just now";
}

const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get("cat");
document.getElementById("title").textContent = `${category}`;

// 🔹 Fetch posts once and handle all updates
fetch("posts.json")
  .then(res => res.json())
  .then(posts => {
    // 🔹 Display category posts
    const postsDiv = document.querySelector(".post-list");
    const filtered = posts.filter(post => post.categories.includes(category));

    if (filtered.length === 0) {
      postsDiv.innerHTML = `<p>No posts found for category: ${category}</p>`;
    } else {
      filtered.forEach(post => {
        postsDiv.innerHTML += `
          <article class="post">
            <img src="${post.image}" alt="${post.title}" class="post-thumb">
            <header>
              <h2><a href="${post.link}">${post.title}</a></h2>
              <p class="post-meta">Posted ${timeAgo(post.date)}</p>
            </header>
            <p class="post-excerpt">${post.summary}</p>
            <a class="read-more" href="${post.link}">Read More</a>
          </article>
        `;
      });
    }

    // 🔹 Sidebar: latest post (for both desktop and mobile)
const latestPostContainerDesktop = document.querySelector("#latest-post-widget .latest-post");
const latestPostContainerMobile = document.querySelector("#latest-post-widget-mobile .latest-post");

if (posts.length > 0) {
  const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
  const latest = sortedPosts[0];

  const latestPostHTML = `
    <a href="${latest.link}">
      <img src="${latest.image}" alt="${latest.title}">
      <span>${latest.title}</span>
    </a>
    <p>Posted ${timeAgo(latest.date)}</p>
  `;

  // Populate desktop sidebar
  if (latestPostContainerDesktop) {
    latestPostContainerDesktop.innerHTML = latestPostHTML;
  }

  // Populate mobile sidebar
  if (latestPostContainerMobile) {
    latestPostContainerMobile.innerHTML = latestPostHTML;
  }
}

    // 🔹 Top nav categories (sorted by most recent post)
    const categoryDates = {};
    posts.forEach(post => {
      post.categories.forEach(cat => {
        const postDate = new Date(post.date);
        if (!categoryDates[cat] || postDate > categoryDates[cat]) {
          categoryDates[cat] = postDate;
        }
      });
    });

    const sortedCategories = Object.entries(categoryDates)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);

    const navContainer = document.getElementById("modnav-categories");
    if (navContainer) {
      navContainer.innerHTML = "";
      sortedCategories.forEach(cat => {
        navContainer.innerHTML += `
          <a href="category.html?cat=${encodeURIComponent(cat)}">${cat}</a>
        `;
      });
    }
  })
  .catch(err => console.error("Error loading posts:", err));