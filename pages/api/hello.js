import fs from 'fs/promises';
import path from 'path';

const POSTS_FILE = path.join(process.cwd(), 'data', 'posts.json');

async function readPosts() {
  try {
    const raw = await fs.readFile(POSTS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writePosts(posts) {
  await fs.mkdir(path.dirname(POSTS_FILE), { recursive: true });
  await fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2));
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, tags = [], content, status } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content required' });
    }
    const posts = await readPosts();
    const newPost = {
      id: Date.now().toString(),
      title,
      tags,
      content,
      status,
      createdAt: new Date().toISOString()
    };
    posts.unshift(newPost);
    await writePosts(posts);
    return res.status(201).json(newPost);
  }

  if (req.method === 'GET') {
    const posts = await readPosts();
    return res.status(200).json(posts);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
export default function handler(req, res) {
  if (req.method === 'POST') {
    const { title, tags, content, status } = req.body;

    console.log("📌 Received Post Data:");
    console.log("Title:", title);
    console.log("Tags:", tags);
    console.log("Content:", content);
    console.log("Status:", status);

    // In real use, save to database here
    res.status(200).json({ message: 'Post saved successfully!' });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
