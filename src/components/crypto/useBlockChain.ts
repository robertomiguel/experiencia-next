import { useEffect, useState } from 'react';
import sha256 from 'crypto-js/sha256';
import { Block, BlockChainContext } from '@/types/crypto';

// Función para calcular el hash de un bloque.
const calculateHash = (
    index: number,
    previousHash: string,
    timestamp: number,
    data: string,
    nonce: number
): string => sha256(index + previousHash + timestamp + JSON.stringify(data) + nonce).toString();

// Función para crear el bloque génesis.
const createGenesisBlock = (): Block => ({
    index: 0,
    timestamp: Date.now(),
    data: "Genesis block",
    previousHash: "0",
    nonce: 0,
    hash: "" // Inicialmente vacío
});

// Función para simular el proceso de minería de un bloque.
const mineBlock = (difficulty: number, newBlock: Block): Block => {
    newBlock.hash = calculateHash(
        newBlock.index,
        newBlock.previousHash,
        newBlock.timestamp,
        newBlock.data,
        newBlock.nonce
    );
    while (newBlock.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
        newBlock.nonce++;
        newBlock.hash = calculateHash(
            newBlock.index,
            newBlock.previousHash,
            newBlock.timestamp,
            newBlock.data,
            newBlock.nonce
        );
    }
    return newBlock;
};

export const useBlockChain = (): BlockChainContext => {

    const [blocks, setBlocks] = useState<Block[]>([]);
    const [difficulty] = useState<number>(4);

    useEffect(() => {
        // Generar y añadir el bloque génesis una vez montado el componente.
        const genesisBlock = createGenesisBlock();
        genesisBlock.hash = calculateHash(
            genesisBlock.index,
            genesisBlock.previousHash,
            genesisBlock.timestamp,
            genesisBlock.data,
            genesisBlock.nonce
        );
        setBlocks([mineBlock(difficulty, genesisBlock)]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const addBlock = (data: string): void => {
        const lastBlock = blocks[blocks.length - 1];
        const newBlock: Block = {
            index: lastBlock.index + 1,
            timestamp: Date.now(),
            data,
            previousHash: lastBlock.hash,
            nonce: 0,
            hash: "" // Inicialmente vacío
        };
        const minedBlock = mineBlock(difficulty, newBlock);
        setBlocks([...blocks, minedBlock]);
    };

    const editBlock = (index: number, data: string): void => {
        const blockIndex = blocks.findIndex(block => block.index === index);
        if (blockIndex !== -1) {
            const newBlocks = [...blocks];
            newBlocks[blockIndex].data = data;
            setBlocks(newBlocks);
        }
    };

    const isValidBlock = (newBlock: Block, previousBlock: Block): boolean => {
        const hashValid = newBlock.hash === calculateHash(
            newBlock.index,
            newBlock.previousHash,
            newBlock.timestamp,
            newBlock.data,
            newBlock.nonce
        );
        const previousHashValid = newBlock.previousHash === previousBlock.hash;
        const meetsDifficulty = newBlock.hash.substring(0, difficulty) === Array(difficulty + 1).join("0");

        return hashValid && previousHashValid && meetsDifficulty;
    };

    const validateBlockchain = (): Block[] => {
        let invalidBlocks: Block[] = [];
        if (blocks.length > 0) {
            // Validar el bloque génesis
            if (blocks[0].hash !== calculateHash(
                    blocks[0].index,
                    blocks[0].previousHash,
                    blocks[0].timestamp,
                    blocks[0].data,
                    blocks[0].nonce)
                || blocks[0].hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
                    invalidBlocks.push(blocks[0]);
                }

            // Validar el resto de bloques en la cadena
            for (let i = 1; i < blocks.length; i++) {
                if (!isValidBlock(blocks[i], blocks[i - 1])) {
                    invalidBlocks.push(blocks[i]);
                }
            }
        }
        return invalidBlocks;
    };

    return { blocks, addBlock, editBlock, validateBlockchain };
};
