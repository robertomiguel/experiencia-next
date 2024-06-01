import BlockchainApp from "@/components/crypto/BlockchainApp";
import { CryptoSocket } from "@/components/crypto/CryptoSocket";

export default function CryptoPage() {

    return (
        <div>
            <div>
                <CryptoSocket />
            </div>
            <div>
                <BlockchainApp />
            </div>
        </div>
    )
}