import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { CTAContainer, HomeContainer } from "@/styles/home";
import { useEffect, useState } from "react";
import Image from "next/image";

import { PublicKey } from "@solana/web3.js";
import {
  FindNftsByOwnerOutput,
  Metaplex,
  Nft,
  NftWithToken,
  Sft,
  SftWithToken,
} from "@metaplex-foundation/js";

export default function Home() {
  const [userTokens, setUserTokens] = useState<
    null | (Nft | Sft | SftWithToken | NftWithToken)[]
  >(null);
  const { connection } = useConnection();
  const wallet = useWallet();

  useEffect(() => {
    (async () => {
      if (wallet && wallet.publicKey) {
        const metaplex = new Metaplex(connection);
        const allTokenAccountByOwner = await metaplex
          .nfts()
          .findAllByOwner({ owner: wallet.publicKey });

        // FILTER BY COLLECTION

        const data = await Promise.all(
          allTokenAccountByOwner.map(
            async (item) =>
              await metaplex
                .nfts()
                .findByMint({ mintAddress: item.mintAddress })
          )
        );
        console.log("data", data);

        setUserTokens(data);
      }
    })();
  }, [wallet]);

  const RenderTokens = () => {
    return (
      <div>
        {userTokens!.map((value, key) => (
          <div key={key}>
            <Image src={value.json?.image!} alt="" width={300} height={300} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <HomeContainer>
      <CTAContainer>{userTokens && <RenderTokens />}</CTAContainer>
    </HomeContainer>
  );
}
