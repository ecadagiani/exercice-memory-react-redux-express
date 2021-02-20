/*
 * Created in février 2021
 * Written by Eden Cadagiani <e.cadagiani@gmail.com>
 */

const HtmlWebPackPlugin  = require( "html-webpack-plugin" );
const CleanWebpackPlugin = require( "clean-webpack-plugin" );

module.exports = {
    mode:    "development",
    module:  {
        rules: [
            {
                test:    /\.jsx?$/,
                loader:  "babel-loader",
                exclude: /node_modules/,
            },
            {
                test:   /\.s(a|c)ss$/,
                loader: ["style-loader", "css-loader", "sass-loader"],
            },
            {
                test:   /\.html$/,
                loader: "html-loader",
            },
        ],
    },
    resolve: {
        extensions: [".js", ".scss"],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebPackPlugin( {
            template: "./src/index.html",
            filename: "./index.html",
        } ),
    ],
};
