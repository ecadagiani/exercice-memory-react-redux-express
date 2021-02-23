/*
 * Created in février 2021
 * Written by Eden Cadagiani <e.cadagiani@gmail.com>
 */

import { configureStore } from '@reduxjs/toolkit'
import { boardReducer }   from "store/reducers/boardReducer";


export default configureStore({
    reducer: {
        board: boardReducer
    }
});
