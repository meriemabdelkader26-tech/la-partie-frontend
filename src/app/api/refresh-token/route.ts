import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { refreshToken } = await req.json();

  const query = `
    mutation RefreshToken($refreshToken: String!) {
      refreshToken(refreshToken: $refreshToken) {
        token
        refreshToken
        refreshExpiresIn
        payload
      }
    }
  `;

  const response = await fetch(process.env.BACKEND_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { refreshToken } }),
  });

  const result = await response.json();
  const refreshed = result?.data?.refreshToken;

  if (!refreshed?.token) {
    return NextResponse.json(
      { error: "Failed to refresh token" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    token: refreshed.token,
    refreshToken: refreshed.refreshToken,
  });
}
