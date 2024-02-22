import {
  FrameRequest,
  getFrameMessage,
  getFrameHtmlResponse,
} from "@coinbase/onchainkit";
import { NextRequest, NextResponse } from "next/server";
import { getDomainKeySync, NameRegistryState } from "@bonfida/spl-name-service";
import { Connection, PublicKey } from "@solana/web3.js";

export async function POST(req: NextRequest): Promise<Response> {
  let input: string | undefined = "";
  let recipientAddress = "";
  const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL;
  let isEmail = false;
  const body: FrameRequest = await req.json();
  const env = process.env.CROSSMINT_ENV || "staging";

  try {
    const { message } = await getFrameMessage(body, {
      neynarApiKey: "NEYNAR_ONCHAIN_KIT",
    });

    if (message?.input) {
      input = message.input;
    }

    if (!input) {
      return new NextResponse(
        getFrameHtmlResponse({
          image: {
            src: `${NEXT_PUBLIC_URL}/error2.png`,
          },
          ogTitle: "Error",
        })
      );
    }

    if (process.env.WARPCAST_HASH && process.env.NEYNAR_API_KEY) {
      const neynarURL = `https://api.neynar.com/v2/farcaster/cast?identifier=${process.env.WARPCAST_HASH}&type=hash`;

      const neynarResponse = await fetch(neynarURL, {
        headers: {
          api_key: process.env.NEYNAR_API_KEY,
          "content-type": "application/json",
        },
        method: "GET",
      });

      const data = await neynarResponse.json();

      const reactions = await data.cast.reactions;

      const hasRecasted = reactions.recasts.some(
        (recast: { fid: Number }) => recast.fid === message?.interactor.fid
      );
      const hasLiked = reactions.likes.some(
        (likes: { fid: Number }) => likes.fid === message?.interactor.fid
      );

      if (!hasRecasted || !hasLiked) {
        return new NextResponse(
          getFrameHtmlResponse({
            image: {
              src: `${NEXT_PUBLIC_URL}/error1.png`,
            },
            postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
            buttons: [
              {
                label: "Try again",
                action: "post",
              },
            ],
          })
        );
      }
    }

    if (input.slice(-4) === ".sol") {
      const { pubkey } = getDomainKeySync(input);
      const connection = new Connection("https://api.mainnet-beta.solana.com");
      const { registry } = await NameRegistryState.retrieve(connection, pubkey);

      const pubKey = new PublicKey(registry.owner);
      recipientAddress = pubKey.toBase58();
    } else if (input.includes("@")) {
      isEmail = true;
      recipientAddress = `email:${input}:solana`;
    } else {
      recipientAddress = `solana:${input}`;
    }

    const crossmintURL = `https://${env}.crossmint.com/api/2022-06-09/collections/56d9e10d-3caf-46a8-80a3-a507d034e51f/nfts`;
    const crossmintOptions = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "x-api-key": process.env.CROSSMINT_API_KEY!,
      },
      body: JSON.stringify({
        recipient: recipientAddress,
        metadata: {
          name: "Cool NFT 😎",
          image: `${NEXT_PUBLIC_URL}/nft.png`,
          description: "This is my cool NFT",
        },
      }),
    };

    const response = await fetch(crossmintURL, crossmintOptions);
    await response.json();

    return new NextResponse(
      getFrameHtmlResponse({
        image: {
          src: `${NEXT_PUBLIC_URL}/success.png`,
        },
        buttons: [
          isEmail
            ? {
                label: "View your NFT on Crossmint",
                action: "link",
                target: `https://${env}.crossmint.com/user/collection`,
              }
            : {
                label: "Your NFT will arrive soon",
              },
        ],
      })
    );
  } catch (error) {
    return new NextResponse(
      getFrameHtmlResponse({
        image: {
          src: `${NEXT_PUBLIC_URL}/error.png`,
        },
        ogTitle: "Error",
      })
    );
  }
}

export const dynamic = "force-dynamic";
