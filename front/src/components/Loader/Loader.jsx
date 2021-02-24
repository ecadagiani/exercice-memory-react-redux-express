/*
 * Created in février 2021
 * Written by Eden Cadagiani <e.cadagiani@gmail.com>
 */

import React     from "react";

import "./Loader.scss";


const Loader = props => {
    return (
        <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
};

Loader.propTypes = {};

export default Loader;
