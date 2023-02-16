import React, { useState, useEffect } from 'react';
import dynamic from "next/dynamic";
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File

const SunEditor = dynamic(() => import("suneditor-react"), {
    ssr: false,
});

const defaultFonts = [
    "Arial",
    "Comic Sans MS",
    "Courier New",
    "Impact",
    "Georgia",
    "Tahoma",
    "Trebuchet MS",
    "Verdana"
];

const Editor = ({defaultValue = "", setEditorValue:any = undefined}) => {

    const [value, setValue] = useState("");

    useEffect( () => {
        setValue(defaultValue);
    }, []);

    const setSunEditorValue = function (editorValue: any) {
        setValue(editorValue);
        if( typeof setEditorValue === "function" ) {
            setEditorValue(editorValue, "content");
        }
    };

    return (
        <div>
            <SunEditor
                plugin=""
                setContents={value}
                onChange={setSunEditorValue}
                setOptions={{
                    buttonList: [
                        ["undo", "redo"],
                        ["font", "fontSize"],
                        ['paragraphStyle', 'blockquote'],
                        [
                            "bold",
                            "underline",
                            "italic",
                            "strike",
                            "subscript",
                            "superscript"
                        ],
                        ["fontColor", "hiliteColor"],
                        ["align", "list", "lineHeight"],
                        ["outdent", "indent"],
                        ["table", "horizontalRule", "link", "image", "video"],
                        // ['math'], //You must add the 'katex' library at options to use the 'math' plugin.
                        // ['imageGallery'], // You must add the "imageGalleryUrl".
                        ["fullScreen", "showBlocks", "codeView"],
                        // ["print"],
                        // ["preview", "print"],
                        ["removeFormat"],
        
                        // ['save', 'template'],
                    // '/', Line break
                ], // Or Array of button list, eg. [['font', 'align'], ['image']]
                defaultTag: "div",
                //   minHeight: "300px",
                showPathLabel: false,
                font: defaultFonts
                }}
            />
        </div>
    );
};

export default Editor;