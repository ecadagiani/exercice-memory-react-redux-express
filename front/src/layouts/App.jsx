/*
 * Created in février 2021
 * Written by Eden Cadagiani <e.cadagiani@gmail.com>
 */

import React from "react";
import { Provider }         from "react-redux";

import store              from "store/store";
import BoardGameLayout from "layouts/BoardGameLayout";


function App() {
    return (
        <div className="App">
            <Provider store={store}>
                <BoardGameLayout/>
            </Provider>
        </div>
    );
}

export default App;
