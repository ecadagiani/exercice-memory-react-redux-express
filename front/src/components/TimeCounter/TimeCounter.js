/*
 * Created in février 2021
 * Written by Eden Cadagiani <e.cadagiani@gmail.com>
 */

import React, { useEffect } from "react";
import PropTypes            from "prop-types";
import cx                   from "classnames";

import { useCountDown } from "hooks/useCountDown";
import "./TimeCounter.scss";


const TimeCounter = ( {
    totalSecond,
    start = false,
    onComplete,
    className,
    ...rest
} ) => {
    const [countDown, { start: startCountDown }] = useCountDown( totalSecond * 1000, 1000, onComplete );

    useEffect( () => {
        if ( start ) {
            startCountDown();
        }
    }, [start, startCountDown] );

    return (
        <span className={cx( className, "TimeCounter" )} {...rest}>
            {Math.floor( countDown / 1000 / 60 )}min {(countDown / 1000) % 60}s
        </span>
    );
};

TimeCounter.propTypes = {
    totalSecond: PropTypes.number,
    start:       PropTypes.bool,
    onComplete:  PropTypes.func,
};

export default TimeCounter;
