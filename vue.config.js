/*
 * @Author: your name
 * @Date: 2020-03-13 18:41:12
 * @LastEditTime: 2020-03-31 11:51:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-smartresume-master\vue.config.js
 */
module.exports = {
    lintOnSave: false,//禁用lint格式
    devServer: {
        host: "localhost",
        port: "8080",
        proxy: {
            '/api': {
                target: 'http://localhost:8081',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': '/'
                }
            },
        },

    }
};



