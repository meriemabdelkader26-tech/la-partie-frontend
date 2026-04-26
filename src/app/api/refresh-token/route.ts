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

  console.log("[REFRESH] Received request with refreshToken:", refreshToken ? "present" : "missing");
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/graphql";
  console.log("[REFRESH] Attempting refresh with backend:", backendUrl);

  try {
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { refreshToken } }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("[REFRESH] Backend responded with error:", response.status, text);
      return NextResponse.json(
        { error: `Backend error: ${response.status}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log("[REFRESH] Backend response received");
    
    if (result.errors) {
      console.error("[REFRESH] GraphQL errors:", JSON.stringify(result.errors));
    }

    const refreshed = result?.data?.refreshToken;

    if (!refreshed?.token) {
      console.error("[REFRESH] No token in response:", JSON.stringify(result));
      return NextResponse.json(
        { error: "Failed to refresh token" },
        { status: 401 }
      );
    }

    const res = NextResponse.json({
      token: refreshed.token,
      refreshToken: refreshed.refreshToken,
    });

    // Set cookies in the response so the middleware and subsequent client requests see them
    const cookieOptions = {
      path: "/",
      httpOnly: false, // Must be accessible by client for GraphQL client
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
    };

    res.cookies.set("token", refreshed.token, cookieOptions);
    res.cookies.set("access_token", refreshed.token, cookieOptions);
    
    if (refreshed.refreshToken) {
      res.cookies.set("refreshToken", refreshed.refreshToken, cookieOptions);
      res.cookies.set("refresh_token", refreshed.refreshToken, cookieOptions);
    }

    console.log("[REFRESH] Token successfully refreshed and cookies set");
    return res;
  } catch (error: any) {
    console.error("[REFRESH] Fetch error:", error.message);
    return NextResponse.json(
      { error: "Internal server error during refresh" },
      { status: 500 }
    );
  }
}
