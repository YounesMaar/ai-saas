import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Replicate from "replicate";
import { checkSubscrpition } from "@/lib/subscription";

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// (process.env.REPLICATE_API_TOKEN!) the ! symbol in the statement earlier is a short hand to say if undefiend || ''

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
    const isPro = await checkSubscrpition();
    const freeTrial = await checkApiLimit();

    if (!freeTrial && !isPro)
      return new NextResponse("free trial has expired", { status: 403 });
    const response = await replicate.run(
      "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
      {
        input: {
          prompt,
        },
      }
    );

    await increaseApiLimit();
    return NextResponse.json(response);
  } catch (err) {
    console.log("[VIDEO_ERROR]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
