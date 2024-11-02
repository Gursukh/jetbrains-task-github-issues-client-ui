import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const repo = request.nextUrl.searchParams.get("url");

  if (!repo) {
    return NextResponse.json(
      { error: "Repository URL is required" },
      { status: 400 }
    );
  }

  const repoPath = repo.replace("https://github.com/", "");
  const url = `https://api.github.com/repos/${repoPath}`;

  const headers = {
    Accept: "application/vnd.github.v3+json",
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
  };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`Error fetching issues: ${response.statusText}`);
    }

    const issues = await response.json();
    return NextResponse.json(issues, { status: 200 });
  } catch (error : any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
