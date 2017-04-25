/**
 * Created by heavenduke on 17-4-25.
 */

let webpack = require('webpack');
let path = require('path');

module.exports = {
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: [
                'journals',
                'diaries',
                'columns',
                'articles',
                'photos',
                'profile',
                'account',
                'projects',
                'writings',
                'shared',
            ]
        })
    ],
    entry: {
        shared: ["hshare"],
        writings: ["hshare"],
        projects: ["hshare"],
        account: ["hshare"],
        profile: ["hshare"],
        photos: ["hshare"],
        articles: ["hshare"],
        columns: ["hshare"],
        diaries: ["hshare"],
        journals: ["hshare"],
    },
    output: {
        path: path.join(__dirname, "../public/js"),
        filename: "[name].min.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.js$/, loader: 'jsx-loader?harmony' },
            { test: /\.(png|jpg|bmp|jpeg|gif)$/, loader: 'url-loader'}
        ]
    }
};