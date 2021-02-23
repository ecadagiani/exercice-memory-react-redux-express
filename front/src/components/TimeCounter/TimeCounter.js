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
    stop = false,
    onComplete,
    className,
    controlledCountDown = null,
    ...rest
} ) => {
    const [countDown, { start: startCountDown }] = useCountDown( totalSecond * 1000, 1000, onComplete );

    useEffect( () => {
        if ( start && !controlledCountDown ) {
            startCountDown();
        }
    }, [start, controlledCountDown, startCountDown] );

    const _countDown = controlledCountDown || countDown;

    return (
        <span className={cx( className, "TimeCounter" )} {...rest}>
            {Math.floor( _countDown / 1000 / 60 ) || 0}min {(_countDown / 1000 % 60) || 0}s
        </span>
    );
};

TimeCounter.propTypes = {
    totalSecond:         PropTypes.number,
    start:               PropTypes.bool,
    onComplete:          PropTypes.func,
    controlledCountDown: PropTypes.number,
};

export default TimeCounter;
