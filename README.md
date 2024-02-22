# NFT minting Farcaster frame on Solana

A Farcaster frame that allows users to mint NFTs on solana directly to their wallets or email after recasting and liking the cast. Check out the [blog](https://blog.avneesh.tech/farcaster-frames-solana) for more details on how to create this frame and check out this [cast]() to see the frame in action.

## Tools

Tools used in this project are:

- [Next.js](https://nextjs.org/): We'll use next.js as our framework for creating the frame.
- [Crossmint](https://www.crossmint.com/): To mint NFTs on solana to the user's wallet address or email, we'll use crossmint.
- [Neynar](https://neynar.com/): We will use neynar to check whether the user has recasted and liked the cast.
- [Onchainkit](https://onchainkit.xyz/): We will use the onchainkit to create the frame, and get the message from the frame on our server.

## How to use

Deploy the frame to vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Favneesh0612%2Ffarcaster-frame-solana&env=NEXT_PUBLIC_URL,CROSSMINT_ENV,NEYNAR_API_KEY,WARPCAST_HASH,CROSSMINT_API_KEY&envDescription=Check%20out%20what%20to%20enter%20in%20the%20env%20vars%20on%20the%20blog&envLink=https%3A%2F%2Fblog.avneesh.tech%2Ffarcaster-frames-solana%23heading-getting-to-production)

Set the environment variables:

- `NEXT_PUBLIC_URL`: The URL of your next.js app.
- `CROSSMINT_API_KEY`: The API key for crossmint. Head over to the [API keys section](https://staging.crossmint.com/console/projects/apiKeys) in the Crossmint dashboard and create a new server key with permission to mint NFTs. Then, add the key as an environment variable.
- `CROSSMINT_ENV`: If you switch over your app from testnet to mainnet, you can add the environment variable `CROSSMINT_ENV` and set it to `www`.
- `CROSSMINT_COLLECTION_ID`: The collection id of the collection in which you want to mint the NFTs. 

If you want to check whether the user has recasted and liked the cast, you can add the following environment variables:

- `WARPCAST_HASH`: The hash of the cast which you want to check has been recasted and liked.
- `NEYNAR_API_KEY` The API key for neynar. You can get it from the [neynar dashboard](https://dev.neynar.com/).
