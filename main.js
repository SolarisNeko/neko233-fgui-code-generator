"use strict";
//FYI: https://github.com/Tencent/puerts/blob/master/doc/unity/manual.md
Object.defineProperty(exports, "__esModule", { value: true });
exports.onPublish = onPublish;
exports.onDestroy = onDestroy;
const GenCode_CS_1 = require("./GenCode_CS");
const GenCode_TS_1 = require("./GenCode_TS");

function onPublish(handler) {
    console.log('[neko233] 注册我的插件 neko233-fgui-generate-code');
    if (!handler.genCode) {
        return;
    }
    // 禁止默认的输出
    handler.genCode = false;
    // 自定义生成代码

    // 生成 C# 代码
    // (0, GenCode_CS_1.genCodeCs)(handler);

    // 生成 ts 代码
    (0, GenCode_TS_1.genCodeTs)(handler);
}
function onDestroy() {
    //do cleanup here
}
