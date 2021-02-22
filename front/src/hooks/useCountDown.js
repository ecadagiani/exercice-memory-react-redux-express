/*
 * Created in février 2021
 * Written by Eden Cadagiani <e.cadagiani@gmail.com>
 */

import { useEffect, useCallback, useState, useRef } from "react";


/**
 * Permet de démarrer un compteur
 * @param milliMax(number) - nombre de milliseconde auquel démarre le compteur
 * @param step(number) - le pas du compteur, par default 1000 (une seconde)
 * @param onFinish(function) - callback appelé lorsque le compteur arrive à 0
 * @return [number, {start: (function(): void), reset: (function(): void)}]
 */
export function useCountDown( milliMax, step = 1000, onFinish ) {
    const [timeLeft, setTimeLeft] = useState( milliMax);
    const timer                   = useRef( {
        started:      null,
        lastInterval: null,
        timeLeft:     null,
        timeToCount:  null,
        requestId:    null,
    } );

    const run = useCallback( timeStamp => {
        if ( !timer.current.started ) {
            timer.current.started      = timeStamp;
            timer.current.lastInterval = timeStamp;
        }

        const localInterval = Math.min( step, (timer.current.timeLeft || Infinity) );
        if ( (timeStamp - timer.current.lastInterval) >= localInterval ) {
            timer.current.lastInterval += localInterval;
            setTimeLeft( ( timeLeft ) => {
                timer.current.timeLeft = timeLeft - localInterval;
                return timer.current.timeLeft;
            } );
        }

        if ( timeStamp - timer.current.started < timer.current.timeToCount ) {
            timer.current.requestId = window.requestAnimationFrame( run );
        } else {
            timer.current = {};
            setTimeLeft( 0 );
            if(typeof onFinish === "function")
                onFinish(timeStamp);
        }
    }, [onFinish, step] );

    const start = useCallback( () => {
        window.cancelAnimationFrame( timer.current.requestId );

        timer.current.started      = null;
        timer.current.lastInterval = null;
        timer.current.timeToCount  = milliMax;
        timer.current.requestId    = window.requestAnimationFrame( run );

        setTimeLeft( milliMax );
    }, [run, milliMax] );

    const stop = useCallback(
        () => {
            window.cancelAnimationFrame(timer.current.requestId);
            timer.current.started = null;
            timer.current.lastInterval = null;
            timer.current.timeToCount = timer.current.timeLeft;
        }, [] );

    const resume = useCallback(
        () => {
            if (!timer.current.started && timer.current.timeLeft > 0) {
                window.cancelAnimationFrame(timer.current.requestId);
                timer.current.requestId = window.requestAnimationFrame(run);
            }
        }, [run] );

    const reset = useCallback( () => {
        if ( timer.current.timeLeft ) {
            window.cancelAnimationFrame( timer.current.requestId );
            timer.current = {};
            setTimeLeft( milliMax );
        }
    }, [milliMax] );


    useEffect( () => reset, [reset] );

    return [timeLeft, { start, reset, stop, resume }];
}
