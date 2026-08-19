import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { name } = await params; 

  if (!name || !/^[A-Za-z0-9_]+$/.test(name)) {
    return NextResponse.json(
      { error: "Invalid subreddit name." },
      { status: 400 }
    );
  }

  try {
    const redditRes = await axios.get(
      `https://www.reddit.com/r/${name}/hot.json?limit=50`,
      {
        headers: {
          "User-Agent": "VibeSubreddit/1.0 (internship assignment)",
        },
        timeout: 10000,
      }
    );

    const children = redditRes.data?.data?.children ?? [];

    if (children.length === 0) {
      return NextResponse.json(
        { error: `No posts found for "${name}". It may be empty or restricted.` },
        { status: 404 }
      );
    }

    const posts = children.map((child) => ({
      id: child.data.id,
      title: child.data.title,
      author: child.data.author,
      score: child.data.score,
      numComments: child.data.num_comments,
      url: `https://reddit.com${child.data.permalink}`,
      createdUtc: child.data.created_utc,
    }));

    return NextResponse.json({ subreddit: name, posts });
  } catch (error) {
    const status = error.response?.status;

    if (status === 404) {
      return NextResponse.json(
        { error: `Subreddit "${name}" not found.` },
        { status: 404 }
      );
    }

    if (status === 403) {
      return NextResponse.json(
        { error: `Subreddit "${name}" is private, banned, or quarantined.` },
        { status: 403 }
      );
    }

    if (error.code === "ECONNABORTED") {
      return NextResponse.json(
        { error: "Reddit took too long to respond. Try again." },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong fetching Reddit data." },
      { status: 500 }
    );
  }
}