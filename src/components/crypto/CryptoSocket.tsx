'use client'
import { useEffect, useRef, useState } from "react";
import { Select } from "../common/Select";
import style from './blockchain.module.css'

interface SymbolData {
    name: string;
    diff: string;
    percent: string;
    symbolPrice: string;
    open: string;
    openAs: string;
    logo: string;
}

const symbolList = [
    {
        label: 'Bitcoin / TetherUS BTCUSDT',
        value: 'BINANCE%3ABTCUSDT'
    },
    {
        label: 'Apple Inc AAPL',
        value: 'NASDAQ%3AAAPL'
    },
    {
        label: 'Alphabet Inc (Google) Class A GOOGL',
        value: 'NASDAQ%3AGOOGL'
    },
    {
        label: 'Amazon.com AMZN',
        value: 'NASDAQ%3AAMZN'
    },
    {
        label: 'Microsoft Corp. MSFT',
        value: 'NASDAQ%3AMSFT'
    },
    {
        label: 'Tesla TSLA',
        value: 'NASDAQ%3ATSLA'
    },
    {
        label: 'NVIDIA NVDA',
        value: 'NASDAQ%3ANVDA'
    },
    {
        label: 'PayPal Holdings, Inc. PYPL',
        value: 'NASDAQ%3APYPL'
    },
    {
        label: 'Intel Corporation INTC',
        value: 'NASDAQ%3AINTC'
    },
    {
        label: 'Adobe Inc. ADBE',
        value: 'NASDAQ%3AADBE'
    },
    {
        label: 'Comcast Corporation CMCSA',
        value: 'NASDAQ%3ACMCSA'
    },
    {
        label: 'Cisco Systems, Inc. CSCO',
        value: 'NASDAQ%3ACSCO'
    },
    {
        label: 'PepsiCo, Inc. PEP',
        value: 'NASDAQ%3APEP'
    },
    {
        label: 'Broadcom Inc. AVGO',
        value: 'NASDAQ%3AAVGO'
    },
]

export const CryptoSocket = () => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const [symbolData, setSymbolData] = useState<SymbolData>()
    const [symbol, setSymbol] = useState<string>('BINANCE%3ABTCUSDT')
    const [isChange, setIsChange] = useState<boolean>(false)

    const getSymbolPrice = () => {
        if (iframeRef.current) {
            const iframe = iframeRef.current;
            const iframeContent = iframe.contentDocument;
            if (iframeContent) {
                const name = iframeContent.getElementsByClassName('tv-symbol-header__first-line tv-symbol-info-widget__first-line');
                const diff = iframeContent.getElementsByClassName('js-symbol-change tv-symbol-price-quote__change-value');
                const percent = iframeContent.getElementsByClassName('js-symbol-change-pt tv-symbol-price-quote__change-value');
                const symbolPrice = iframeContent.getElementsByClassName('tv-symbol-price-quote__value js-symbol-last');
                const open = iframeContent.getElementsByClassName('js-last-price-block-title tv-symbol-price-quote__market-stat')
                const openAs = iframeContent.getElementsByClassName('js-symbol-lp-time')
                const logo = iframeContent.getElementsByClassName('tv-circle-logo')
                setSymbolData({
                    name: name.length ? name[0].textContent as string : '',
                    symbolPrice: symbolPrice.length ? symbolPrice[0].textContent as string : '',
                    diff: diff.length ? diff[0].textContent as string : '',
                    percent: percent.length ? percent[0].textContent as string : '',
                    open: open.length ? open[0].textContent as string : '',
                    openAs: openAs.length ? openAs[0].textContent as string : '',
                    logo: logo.length ? logo[0].getAttribute('src') as string : ''
                })
            }
        }
    }
    useEffect(() => {
        if (isChange) {
            getSymbolPrice()
            setIsChange(false)
        }
    }, [isChange, symbol])

    return (
        <div className="w-full p-2" >
            <h1>Crypto data</h1>
            <Select options={symbolList} value={symbol} onChange={(e) => {
                setSymbol(e)
                setIsChange(true)
                setSymbolData(undefined)
            }} />
            <button
                className="w-full sm:w-fit m-auto mb-3"
                onClick={getSymbolPrice}
            >
                Capture symbol data
            </button>
            <div className={style.ellipsis} >
                <pre>
                    {JSON.stringify(symbolData, null, 2)}
                </pre>
            </div>
            {!isChange && <iframe
                ref={iframeRef}
                src={`/api/crypto?symbol=${symbol}`}
                width="100%"
                height="300px"
                allow="encrypted-media"
            ></iframe>}
        </div>
    )   
}