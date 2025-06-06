import React, { useEffect, useCallback } from "react";

export const useSwipeLock = () => {
    let sw = false

    /**
     * イベントリスナーの設定
     */
    useEffect(() => {
        // モバイルスクロール禁止処理
        document.addEventListener("touchstart", (e) => { if (e.touches[0].clientX < 100 || e.touches[0].clientX > window.innerWidth - 100) sw = true }, false);
        document.addEventListener("touchmove", (e) => { if (sw) e.preventDefault() }, false);
        document.addEventListener("touchend", (e) => { sw = false }, false);

    }, []);

    /**
     * モバイルスクロール禁止処理
     */
    const scrollNo = (e) => {
        e.preventDefault();

    };
};