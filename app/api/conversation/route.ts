import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscrpition } from "@/lib/subscription";

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

interface messagesProps {
  role: String;
  content: String;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    // this is how you can get the body
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!openai.apiKey) {
      return new NextResponse("OpenAI API key not configured", { status: 500 });
    }
    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscrpition();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free Trial has expired.", { status: 403 });
    }
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });

    await increaseApiLimit();
    return NextResponse.json(response.choices);
  } catch (err) {
    console.log("[ConVERSATION_ERROR]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
