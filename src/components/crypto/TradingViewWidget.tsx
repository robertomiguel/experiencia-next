'use client'
import React, { useEffect, useRef } from 'react';

const TRADINVIEW_COIN_SYMBOL = [
    "BINANCE:BTCUSDT",
    "NASDAQ:AAPL",
    "NASDAQ:GOOGL",
    "NASDAQ:AMZN",
    "NASDAQ:MSFT",
    "NASDAQ:TSLA",
    "NASDAQ:NVDA",
    "NASDAQ:PYPL",
    "NASDAQ:INTC",
    "NASDAQ:ADBE",
    "NASDAQ:CMCSA",
    "NASDAQ:CSCO",
    "NASDAQ:PEP",
    "NASDAQ:AVGO",
]

enum WidgetName {
    ADVANCE = 'advance',
    CLOCK = 'clock',
    INFO = 'info',
}

export const TradingViewWidget = () => {

    const advanceWidget = useRef<HTMLDivElement>(null);
    const clockWidget = useRef<HTMLDivElement>(null);
    const infoWidget = useRef<HTMLDivElement>(null);

    const loadAdvanceWidget = (symbol: string) => {
        if (!advanceWidget.current) return;
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = `
        {
          "autosize": true,
          "symbol": "${symbol}",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "allow_symbol_change": true,
          "calendar": false,
          "support_host": "https://www.tradingview.com"
        }`;
        advanceWidget.current.appendChild(script);
    }

    const loadClockWidget = (symbol: string) => {
        if (!clockWidget.current) return;
        const script = document.createElement("script");
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = `
        {
          "interval": "1m",
          "width": "100%",
          "isTransparent": false,
          "height": 450,
          "symbol": "${symbol}",
          "showIntervalTabs": true,
          "displayMode": "single",
          "locale": "en",
          "colorTheme": "dark"
        }`;
        clockWidget.current.appendChild(script);
    }

    const loadInfoWidget = (symbol: string) => {
        if (!infoWidget.current) return;
        const script = document.createElement("script");
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js';
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = `
        {
          "symbol": "${symbol}",
          "width": "100%",
          "locale": "en",
          "colorTheme": "dark",
          "isTransparent": false
        }`;
        infoWidget.current.appendChild(script);
    }

    const changeSymbol = (symbol: string, widget: WidgetName) => {
        switch (widget) {
            case WidgetName.ADVANCE:
                if (advanceWidget.current) {
                    advanceWidget.current.innerHTML = '';
                    loadAdvanceWidget(symbol);
                }
                break;
            case WidgetName.CLOCK:
                if (clockWidget.current) {
                    clockWidget.current.innerHTML = '';
                    loadClockWidget(symbol);
                }
                break;
            case WidgetName.INFO:
                if (infoWidget.current) {
                    infoWidget.current.innerHTML = '';
                    loadInfoWidget(symbol);
                }
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        loadAdvanceWidget(TRADINVIEW_COIN_SYMBOL[0]);
        loadClockWidget(TRADINVIEW_COIN_SYMBOL[0]);
        loadInfoWidget(TRADINVIEW_COIN_SYMBOL[0]);
        const cRef = clockWidget.current;
        const aRef = advanceWidget.current;
        const iRef = infoWidget.current;
        return () => {
            if (cRef) {
                cRef.innerHTML = '';
            }
            if (aRef) {
                aRef.innerHTML = '';
            }
            if (iRef) {
                iRef.innerHTML = '';
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (<div className='flex flex-col gap-3 m-2 sm:m-3 justify-center items-center ' >
        <div className='flex flex-row gap-2 flex-wrap sm:flex-nowrap justify-center items-center ' >
            {TRADINVIEW_COIN_SYMBOL.map((symbol, index) => (
                <button className='w-fit' key={index} onClick={() => {
                    changeSymbol(symbol, WidgetName.ADVANCE)
                    changeSymbol(symbol, WidgetName.CLOCK)
                    changeSymbol(symbol, WidgetName.INFO)
                }} >{symbol.split(':')[1]}</button>
            ))
            }
        </div>
        <div className="w-full h-96 hidden sm:block " ref={advanceWidget} />
        <div className="w-full sm:hidden block " ref={infoWidget} />
        <div className="w-full sm:max-w-sm h-96" ref={clockWidget} />
    </div>);
}
