import { pipeline } from '@xenova/transformers';
import fs from 'fs';
import fetch from 'node-fetch';

// Load articles
const articles = JSON.parse(fs.readFileSync('articles_dataset.json', 'utf8'));

// Load the embedding model
const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

// Function to generate embedding for a single article
async function generateEmbedding(text) {
  const output = await extractor(text, { pooling: 'mean', normalize: true });
  return output.data;
}

// Generate embeddings for all articles
async function generateAndSave() {
  const articlesWithEmbeddings = [];

  for (const article of articles) {
    const embedding = await generateEmbedding(`${article.title} ${article.content}`);
    articlesWithEmbeddings.push({
      ...article,
      embedding
    });
    console.log(`Generated embedding for: ${article.title}`);
  }

  fs.writeFileSync('articles_with_embeddings.json', JSON.stringify(articlesWithEmbeddings, null, 2));
  console.log('✅ All embeddings generated and saved.');
}

generateAndSave();

export {generateEmbedding}
