import fetch from 'node-fetch';
import fs from 'fs';

// Fetch articles from Dev.to
async function fetchDevToArticles() {
  const res = await fetch('https://dev.to/api/articles?per_page=100');
  const articles = await res.json();
  return articles.map(a => ({
    title: a.title,
    content: a.description,
    url: a.url,
    tags: a.tag_list
  }));
}

// Function to ensure unique articles based on URL
function getUniqueArticles(articles) {
  const uniqueArticles = [];
  const seenUrls = new Set();

  articles.forEach(article => {
    if (!seenUrls.has(article.url)) {
      uniqueArticles.push(article);
      seenUrls.add(article.url);
    }
  });

  return uniqueArticles;
}

// Fetch articles and save them to JSON file
async function fetchAndSaveArticles() {
  const devtoArticles = await fetchDevToArticles();
  const uniqueArticles = getUniqueArticles(devtoArticles);

  fs.writeFileSync('articles_dataset.json', JSON.stringify(uniqueArticles, null, 2));
  console.log(`Fetched and saved ${uniqueArticles.length} unique Dev.to articles.`);
}

fetchAndSaveArticles();
