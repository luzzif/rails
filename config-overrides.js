const GitRevisionPlugin = require("git-revision-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// Used to make the build reproducible between different machines (IPFS-related)
module.exports = (config, env) => {
    if (env !== "production") {
        return config;
    }
    const gitRevisionPlugin = new GitRevisionPlugin();
    const shortCommitHash = gitRevisionPlugin.commithash().substring(0, 8);
    config.output.filename = `static/js/[name].${shortCommitHash}.js`;
    config.output.chunkFilename = `static/js/[name].${shortCommitHash}.chunk.js`;
    config.plugins.push(
        new MiniCssExtractPlugin({
            filename: `static/css/[name].${shortCommitHash}.css`,
            chunkFilename: "static/css/[name].chunk.css",
        })
    );
    return config;
};
