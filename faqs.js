// Toggle FAQ answers
function toggleAnswer(element) {
  element.classList.toggle('active');
  const answer = element.nextElementSibling;
  answer.classList.toggle('show');
}

// Load posts for category navigation
let allPosts = [];

fetch("posts.json")
  .then(res => res.json())
  .then(posts => {
    // Store posts globally
    allPosts = posts;

    // Build top nav categories
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
      .sort((a, b) => b[1] - a[1]) // newest first
      .map(entry => entry[0]);

    const navContainer = document.getElementById("modnav-categories");
    if (navContainer) {
      navContainer.innerHTML = sortedCategories
        .map(cat => `<a href="category.html?cat=${encodeURIComponent(cat)}">${cat}</a>`)
        .join("");
    }
  })
  .catch(err => {
    console.error("Error loading posts:", err);
    // Don't break the FAQ functionality if posts.json fails to load
    const navContainer = document.getElementById("modnav-categories");
    if (navContainer) {
      navContainer.innerHTML = '<span style="color: #999;">Categories unavailable</span>';
    }
  });