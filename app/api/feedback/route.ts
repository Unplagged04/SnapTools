import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { feedback, userEmail } = body;

    if (!feedback || typeof feedback !== "string") {
      return NextResponse.json(
        { error: "Please write a message before submitting." },
        { status: 400 }
      );
    }

    // .env.local থেকে নেবে, না পেলে সরাসরি সিক্রেট কি ব্যবহার করবে
    const accessKey =
      process.env.WEB3FORMS_ACCESS_KEY ||
      "b1ae952b-4ea3-46b6-bd82-ecb261f039b3";

    const payload: Record<string, string> = {
      access_key: accessKey,
      subject: "New SnapTools User Feedback",
      from_name: "SnapTools Client",
      message: feedback,
    };

    if (userEmail && userEmail.trim()) {
      payload.replyto = userEmail.trim();
    }

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!result.success) {
      return NextResponse.json(
        { error: result.message || "Web3Forms submission failed." },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal server error occurred." },
      { status: 500 }
    );
  }
}
