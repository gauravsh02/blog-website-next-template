import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const TinymceEditor = ({defaultValue = "", setEditorValue = (a:any, b:any)=>{} }) => {

    const [state, setState] = useState({
        content: defaultValue,
        saved: false,
        post: {
          description: ""
        },
        urlImage: '',
        loading: false
    });

    const _handleEditorChange = (e:any) => {
        setState({ ...state, content: e.target.getContent() })
        if( typeof setEditorValue === "function" ) {
            setEditorValue(e.target.getContent(), "content");
        }
      }
    
      const _handSave = () => {
        //Let push state.content which you got to server
        //can view result at console window :)
        setState({ ...state, saved: true })
      }

      const textToHtml = (text: string) => {
        const elem = document.createElement('div');
        return text.split(/\n\n+/).map((paragraph) => {
          return '<p>' + paragraph.split(/\n+/).map((line) => {
            elem.textContent = line;
            return elem.innerHTML;
          }).join('<br/>') + '</p>';
        }).join('');
      };

      return (
        <Editor
          apiKey={``}
        //   initialValue={textToHtml(defaultValue)}
          initialValue={defaultValue}
          onChange={_handleEditorChange}
        //   value={state.content}
          init={{
            // height: 600,
            // menubar: true,
            // config: {},
            skin: 'oxide-dark',
            content_css: 'dark',
            // theme_modern_font_sizes: "10px,12px,13px,14px,16px,18px,20px",
            // font_size_style_values: "12px,13px,14px,16px,18px,20px",

            // images_upload_base_path: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            // images_upload_credentials: true,

            // plugins: [
            //   'advlist autolink lists link image charmap print preview anchor',
            //   'searchreplace visualblocks code fullscreen',
            //   'insertdatetime media table paste code help wordcount'
            // ],
            // toolbar:
            //   `undo redo| link code image | formatselect | sizeselect fontselect fontsizeselect bold italic backcolor | \
            //     alignleft aligncenter alignright alignjustify | \
            //     bullist numlist outdent indent | removeformat | help`,
            // image_title: true,


            // plugins: "advcode advlist advtable anchor autocorrect autolink autosave casechange charmap checklist code codesample directionality editimage emoticons export footnotes formatpainter help image insertdatetime link linkchecker lists media mediaembed mergetags nonbreaking pagebreak permanentpen powerpaste searchreplace table tableofcontents tinymcespellchecker typography visualblocks visualchars wordcount print preview fullscreen paste help",
            plugins: "anchor autolink autosave charmap checklist code codesample directionality editimage emoticons help image insertdatetime link lists media nonbreaking pagebreak searchreplace table visualblocks visualchars wordcount print preview fullscreen paste help",

            toolbar: "undo redo | blocks fontfamily fontsizeinput | bold italic underline forecolor backcolor | link image | align lineheight checklist bullist numlist | indent outdent | removeformat typography",
            height: "700px",
          
            //HTML custom font options
            font_size_formats:
              "8pt 9pt 10pt 11pt 12pt 14pt 18pt 24pt 30pt 36pt 48pt 60pt 72pt 96pt",
          
            toolbar_sticky: true,


            // automatic_uploads: true,
            // file_picker_types: 'image',
            // file_picker_callback: function (cb, value, meta) {
            //   var input = document.createElement('input');
            //   input.setAttribute('type', 'file');
            //   input.setAttribute('accept', 'image/*');
            //   var url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
            //   var xhr = new XMLHttpRequest();
            //   var fd = new FormData();
            //   xhr.open('POST', url, true);

            //   input.onchange = function () {
            //     var file = this.files[0];
            //     var reader = new FileReader();
            //     xhr.onload = function () {
            //       if (xhr.readyState === 4 && xhr.status === 200) {
            //         // File uploaded successfully
            //         var response = JSON.parse(xhr.responseText);

            //         // https://res.cloudinary.com/cloudName/image/upload/v1483481128/public_id.jpg
            //         var url = response.secure_url;
            //         // console.log(url)
            //         // Create a thumbnail of the uploaded image, with 150px width
            //         cb(url, { title: response.original_filename });

            //       }
            //     };

            //     reader.onload = function () {
            //       var id = 'blobid' + (new Date()).getTime();
            //       var blobCache = window.tinymce.activeEditor.editorUpload.blobCache;
            //       var base64 = reader.result.split(',')[1];

            //       var blobInfo = blobCache.create(id, file, base64);
            //       blobCache.add(blobInfo);

            //       // call the callback and populate the Title field with the file name

            //       fd.append('upload_preset', unsignedUploadPreset);
            //       fd.append('tags', 'browser_upload');
            //       fd.append('file', blobInfo.blob(), blobInfo.filename());

            //       xhr.send(fd);

            //     };

            //     reader.readAsDataURL(file);
            //   };

            //   input.click();
            // },
            // images_upload_handler: (blobInfo, success, failure) => {
            //   let data = new FormData();
            //   var reader = new FileReader();
            //   // var file = this.files[0];
            //   var url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
            //   data.append('file', blobInfo.blob(), blobInfo.filename());
            //   data.append('upload_preset', unsignedUploadPreset);
            //   data.append('tags', 'browser_upload');
            //   axios.post(url, data)
            //     .then(function (res) {
            //       success(res.data.secure_url)
            //     })
            //     .catch(function (err) {
            //       console.log(err)
            //     });
            //   reader.readAsDataURL(blobInfo.blob())
            // },
          }}
        />
    );
}

export default TinymceEditor;