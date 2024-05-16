import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Replicate from "replicate";
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscrpition } from "@/lib/subscription";

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// (process.env.REPLICATE_API_TOKEN!) this is a short hand to say if undefiend || ''

const replicate = new Replicate({
  auth: process.env.REPLICATE_AI_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    // this is how you can get the body
    const body = await req.json();
    const { prompt } = body.values;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!prompt) {
      return new NextResponse("prompt is required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscrpition();

    if (!freeTrial && !isPro)
      return new NextResponse("free trial has expired", { status: 403 });
    const response = await replicate.run(
      "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
      {
        input: {
          prompt_a: prompt,
        },
      }
    );

    await increaseApiLimit();
    return NextResponse.json(response);
  } catch (err) {
    console.log("[Music_ERROR]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
