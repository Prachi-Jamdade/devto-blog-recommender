import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import 'dotenv/config';

// Load your Supabase keys from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Service Role Key needed for inserting
const supabase = createClient(supabaseUrl, supabaseKey);

// Load articles with embeddings
const articles = JSON.parse(fs.readFileSync('articles_with_embeddings.json', 'utf8'));

// Insert articles into Supabase
async function uploadArticles() {
  for (const article of articles) {
    // Convert embedding object to array (if it's an object)
    const embeddingArray = Object.values(article.embedding); 

    const { error } = await supabase
      .from('articles')
      .insert({
        title: article.title,
        content: article.content,
        url: article.url,
        embedding: embeddingArray // Insert the embedding as an array
      });

    if (error) {
      console.error('❌ Error inserting:', article.title, error.message);
    } else {
      console.log('✅ Inserted:', article.title);
    }
  }
}

uploadArticles();
