"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genCodeCs = genCodeCs;
const csharp_1 = require("csharp");
const CodeWriter_1 = require("./CodeWriter");
// 自定义的生成代码逻辑
function genCodeCs(handler) {
    console.log("开始生成 CS Code!");
    let settings = handler.project.GetSettings("Publish").codeGeneration;
    console.log("代码生成配置", settings);
    // 转换中文 to 拼音
    let codePkgName = handler.ToFilename(handler.pkg.name);
    let exportCodePath = handler.exportCodePath + '/' + codePkgName;
    // 代码的命名空间
    let namespaceName = "FGUI_Generate_Code";
    // fgui 项目名
    let fguiNamespace = "";
    const myProjectType = handler.project.type;
    const isUnityProject = myProjectType == csharp_1.FairyEditor.ProjectType.Unity;
    // 检查并删除旧的文件
    handler.SetupCodeFolder(exportCodePath, "cs");
    let getMemberByName = settings.getMemberByName;
    // 收集类信息
    let classes = handler.CollectClasses(settings.ignoreNoname, settings.ignoreNoname, fguiNamespace);
    let writer = new CodeWriter_1.default({ blockFromNewLine: false, usingTabs: true });
    let classCnt = classes.Count;
    for (let i = 0; i < classCnt; i++) {
        let classInfo = classes.get_Item(i);
        let members = classInfo.members;
        let references = classInfo.references;
        writer.reset();
        writer.writeln('using FairyGUI; ');
        writer.writeln('using FairyGUI.Utils; ');
        writer.writeln('using UnityEngine; ');
        writer.writeln();
        // 命名空间
        writer.writeln('namespace %s', namespaceName);
        writer.startBlock();
        const className = classInfo.className;
        // 类定义
        writer.writeln('public class %s : %s', classInfo.className, classInfo.superClassName);
        writer.startBlock();
        // 成员变量
        let memberCnt = members.Count;
        for (let j = 0; j < memberCnt; j++) {
            let memberInfo = members.get_Item(j);
            writer.writeln('public %s %s;', memberInfo.type, memberInfo.varName);
        }
        // 静态 URL
        writer.writeln('public static string URL = "ui://%s%s";', handler.pkg.id, classInfo.resId);
        // CreateInstance 方法
        writer.writeln('public static %s CreateInstance()', classInfo.className);
        writer.startBlock();
        writer.writeln('return (%s)UIPackage.CreateObject("%s", "%s");', classInfo.className, handler.pkg.name, classInfo.resName);
        writer.endBlock();
        // 构造函数 onConstruct
        writer.writeln('public override void ConstructFromXML(XML xml)');
        writer.startBlock();
        writer.writeln('base.ConstructFromXML(xml);');
        for (let j = 0; j < memberCnt; j++) {
            let memberInfo = members.get_Item(j);
            if (memberInfo.group == 0) {
                if (getMemberByName)
                    writer.writeln('this.%s = (%s)this.GetChild("%s");', memberInfo.varName, memberInfo.type, memberInfo.name);
                else
                    writer.writeln('this.%s = (%s)this.GetChildAt(%s);', memberInfo.varName, memberInfo.type, memberInfo.index);
            }
            else if (memberInfo.group == 1) {
                if (getMemberByName)
                    writer.writeln('this.%s = this.GetController("%s");', memberInfo.varName, memberInfo.name);
                else
                    writer.writeln('this.%s = this.GetControllerAt(%s);', memberInfo.varName, memberInfo.index);
            }
            else {
                if (getMemberByName)
                    writer.writeln('this.%s = this.GetTransition("%s");', memberInfo.varName, memberInfo.name);
                else
                    writer.writeln('this.%s = this.GetTransitionAt(%s);', memberInfo.varName, memberInfo.index);
            }
        }
        writer.endBlock(); // ConstructFromXML
        writer.endBlock(); // class
        writer.endBlock(); // namespace
        writer.save(exportCodePath + '/' + classInfo.className + '.cs');
    }
    // 生成 Binder 类
    writer.reset();
    writer.writeln('using FairyGUI;');
    writer.writeln('namespace %s', namespaceName);
    writer.startBlock();
    writer.writeln('public static class %sBinder', codePkgName);
    writer.startBlock();
    writer.writeln('public static void BindAll()');
    writer.startBlock();
    for (let i = 0; i < classCnt; i++) {
        let classInfo = classes.get_Item(i);
        writer.writeln('UIObjectFactory.SetPackageItemExtension(%s.URL, typeof(%s));', classInfo.className, classInfo.className);
    }
    writer.endBlock(); // BindAll
    writer.endBlock(); // class
    writer.endBlock(); // namespace
    writer.save(exportCodePath + '/' + codePkgName + 'Binder.cs');
}
