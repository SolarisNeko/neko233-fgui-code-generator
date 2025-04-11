//FYI: https://github.com/Tencent/puerts/blob/master/doc/unity/manual.md

import { FairyEditor } from 'csharp';
import { genCodeTs } from './GenCode_TS';
import { genCodeCs } from './GenCode_CS';

function onPublish(handler: FairyEditor.PublishHandler) {
    console.log('[neko233] 注册我的插件 neko233-generate-fgui-code');
    
    if (!handler.genCode) {
        return;
    }
    // 禁止默认的输出
    handler.genCode = false;



    // 自定义生成代码
    genCodeTs(handler); 
    genCodeCs
    // genCodeCs(handler); 
}


function onDestroy() {
    //do cleanup here
}

export { onPublish, onDestroy };