import { auth } from "@clerk/nextjs";
// this is the next server to use the post function
// it's to return a http response
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscrpition } from "@/lib/subscription";

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const instructionMessage: any = {
  role: "system",
  content:
    "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations.",
};

// learn from this function 1!!!
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
    const isPro = await checkSubscrpition();
    const freeTrial = await checkApiLimit();

    if (!freeTrial && !isPro)
      return new NextResponse("Free Trial has expired", { status: 403 });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [instructionMessage, ...messages],
    });

    await increaseApiLimit();

    return NextResponse.json(response.choices);
  } catch (err) {
    console.log("[ConVERSATION_ERROR]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
