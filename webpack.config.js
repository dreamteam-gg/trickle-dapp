const { resolve } = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const dest = "docs";

module.exports = {
    resolve: {
        alias: {
            'cldr$': 'cldrjs',
            'cldr': 'cldrjs/dist/cldr'
        }
    },
    entry: "./src/react-app.js",
    output: {
        path: resolve(dest),
        filename: "react-app.js"
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: "src/index.html", to: `index.html` },
            { from: "src/index.html", to: `404.html` },
            { from: "src/app/img/favicon.ico", to: `favicon.ico` }
        ], {
            force: true
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: "static",
            openAnalyzer: false
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.(png|gif|ttf|eot|svg|woff2?)$/,
                use: "url-loader?name=[name].[ext]",
            },
            {
                test: /\.s?css$/,
                use: [
                    {
                        loader: require.resolve("style-loader"),
                    },
                    {
                        loader: require.resolve("css-loader"),
                        options: {
                            importLoaders: 1,
                        }
                    },
                    {
                        loader: require.resolve("sass-loader")
                    }
                ]
            }
        ]
    }
};