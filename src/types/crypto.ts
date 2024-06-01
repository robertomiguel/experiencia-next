
// Interface que define la estructura de un bloque en la blockchain.
export interface Block {
    index: number;
    timestamp: number;
    data: string;
    previousHash: string;
    nonce: number;
    hash: string;
}

// Interface para el estado y las funciones expuestas por el hook useBlockChain.
export interface BlockChainContext {
    blocks: Block[];
    addBlock: (data: string) => void;
    editBlock: (index: number, data: string) => void;
    validateBlockchain: () => Block[];
}
