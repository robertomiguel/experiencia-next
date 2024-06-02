'use client'
import { useEffect, useState } from 'react';
import { useBlockChain } from './useBlockChain';
import { Block } from '@/types/crypto';
import style from './blockchain.module.css';

const BlockchainApp = (): JSX.Element => {
    const { blocks, addBlock, editBlock, validateBlockchain } = useBlockChain();
    const [data, setData] = useState<string>('');
    const [timeStamps, setTimeStamps] = useState<string[]>([]);
    const [selectBlock, setSelectBlock] = useState<Block>();
    const [invalidBlocks, setInvalidBlocks] = useState<Block[]>([]);

    useEffect(() => {
        // Actualizamos los timestamps una vez que el componente está montado en el cliente
        setTimeStamps(blocks.map(block => new Date(block.timestamp).toLocaleString()));
    }, [blocks]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        if (data) {
            addBlock(data);
            setData('');
        }
    };

    return (
        <div className='p-2 w-full'>
            <h1>Demo - Mine blockchain</h1>
            <div className={style.formContainer} >
                <form
                    onSubmit={handleSubmit}
                    className={style.formAddBlock}
                    >
                    <h5>Difficult: 4</h5>
                    <label htmlFor="data">Data for new block</label>
                    <input
                        id="data"
                        type="text"
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                        placeholder="Data for new block"
                    />
                    <button type="submit">Mine Block</button>
                </form>
                <div className={style.formAddBlock}>
                    <label>Block number</label>
                    <input
                        readOnly
                        type="text"
                        value={selectBlock?.index}
                        className='bg-transparent border-solid border-2 border-gray-50 text-gray-50 '
                    />
                    <label>Data</label>
                    <input
                        placeholder='Select block...'
                        type="text"
                        value={selectBlock?.data}
                        onChange={(e) => {
                            if (selectBlock) {
                                setSelectBlock({ ...selectBlock, data: e.target.value });
                            }
                        }}
                    />
                    <button
                        onClick={() => editBlock(selectBlock?.index as number, selectBlock?.data as string)}
                        type="submit">Hack Block</button>
                    <button
                        type="submit"
                        onClick={() => {
                            const invalidBlocks = validateBlockchain();
                            setInvalidBlocks(invalidBlocks);
                        }}
                    >
                        Check integrity
                    </button>
                </div>
            </div>

            <div className={style.listContainer} >
                {blocks.map((block, index) => (
                    <div
                        className={`${style.blockBox} ${invalidBlocks.some(s => s.index === index) ? 'bg-red-700' : 'bg-blue-900'}`}
                        key={index}
                        onClick={() => setSelectBlock(block)}
                    >
                        <h4>Block {block.index}</h4>
                        <div>Timestamp: {timeStamps[index]}</div>
                        <div className={style.ellipsis}>Data: {block.data}</div>
                        <div>Nonce: {block.nonce}</div>
                        <div className={style.ellipsis} title={block.hash} >Previous Hash: {block.previousHash}</div>
                        <div className={style.ellipsis} title={block.hash} >Hash: {block.hash}</div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default BlockchainApp;
