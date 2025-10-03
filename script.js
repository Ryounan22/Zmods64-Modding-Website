let allPosts = [];
let currentPage = 1;
const postsPerPage = 3;
let isSearching = false; // 🔹 track if search is active

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

function renderPosts(posts) {
  const postsDiv = document.querySelector(".post-list");
  postsDiv.innerHTML = "";

  let postsToRender = posts;

  if (!isSearching) {
    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    postsToRender = posts.slice(start, end);
  }

  postsToRender.forEach(post => {
    const categoriesHTML = post.categories.map(cat =>
      `<a href="category.html?cat=${encodeURIComponent(cat)}" class="post-category">${cat}</a>`
    ).join(", ");

    postsDiv.innerHTML += `
      <article class="post">
        <img src="${post.image}" alt="${post.title}" class="post-thumb">
        <header>
          <h2><a href="${post.link}">${post.title}</a></h2>
          <p class="post-meta">Posted ${timeAgo(post.date)}</p>
        </header>
        <p class="post-excerpt">${post.summary}</p>
        <p class="post-categories">Categories: ${categoriesHTML}</p>
        <a class="read-more" href="${post.link}">Read More</a>
      </article>
    `;
  });

  if (!isSearching) {
    renderPagination(posts.length);
  } else {
    document.querySelector(".pagination").innerHTML = "";
  }
}

function renderPagination(totalPosts) {
  const paginationDiv = document.querySelector(".pagination");
  paginationDiv.innerHTML = "";

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  // Previous button
  const prevBtn = document.createElement("button");
  prevBtn.textContent = "Previous";
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      renderPosts(allPosts);
      window.scrollTo(0, 0);
    }
  };
  paginationDiv.appendChild(prevBtn);

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.textContent = i;
    pageBtn.className = (i === currentPage) ? "active" : "";
    pageBtn.onclick = () => {
      currentPage = i;
      renderPosts(allPosts);
      window.scrollTo(0, 0);
    };
    paginationDiv.appendChild(pageBtn);
  }

  // Next button
  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderPosts(allPosts);
      window.scrollTo(0, 0);
    }
  };
  paginationDiv.appendChild(nextBtn);
}

// 🔹 Fetch posts
fetch("posts.json")
  .then(res => res.json())
  .then(posts => {
    allPosts = posts;

    // Render first page
    renderPosts(allPosts);

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

    // 🔹 Top nav categories
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

// 🔹 Search function
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();
      if (query.trim() === "") {
        // Restore pagination
        isSearching = false;
        currentPage = 1;
        renderPosts(allPosts);
      } else {
        // Show all results (disable pagination)
        isSearching = true;
        const filtered = allPosts.filter(post =>
          post.title.toLowerCase().includes(query) ||
          post.summary.toLowerCase().includes(query) ||
          post.categories.some(cat => cat.toLowerCase().includes(query))
        );
        renderPosts(filtered);
      }
    });
  }
});
