// 🔹 Load posts first
fetch("posts.json")
  .then(res => res.json())
  .then(posts => {
    // Store posts globally if needed
    allPosts = posts;

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
      .sort((a, b) => b[1] - a[1]) // newest first
      .map(entry => entry[0]);

    const navContainer = document.getElementById("modnav-categories");
    if (navContainer) {
      navContainer.innerHTML = sortedCategories
        .map(cat => `<a href="category.html?cat=${encodeURIComponent(cat)}">${cat}</a>`)
        .join("");
    }

    // Render posts initially
    renderPosts(posts);
  })
  .catch(err => console.error("Error loading posts:", err));