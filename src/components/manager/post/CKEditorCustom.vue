<template>
  <div id="app">
    <ckeditor
      :editor="editor"
      v-model="editorData"
      :config="editorConfig"
      id="editor"
    ></ckeditor>
  </div>
</template>

<script>
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { defineComponent, ref } from "@vue/runtime-core";

export default defineComponent({
  setup() {
    const uploadAdapter = (loader) => {
      console.log("check loader", loader);

      return {
        upload: () => {
          return new Promise((resolve, reject) => {
            loader.file.then(async (file) => {
              try {
                if (file) {
                  console.log("check file:::", file);
                  resolve({ default: file });
                }
              } catch (error) {
                reject(error);
              }
            });
          });
        },
      };
    };

    const uploader = (editor) => {
      editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
        return uploadAdapter(loader);
      };
    };

    // Load the custom upload adapter as a plugin of the editor.
    ClassicEditor.create(document.querySelector("#editor"), {
      extraPlugins: [uploader],
    }).catch((error) => {
      console.log("error upload ckeditor:::", error);
    });

    const editor = ClassicEditor;
    const editorData = ref("<p>Content of the editor.</p>");
    const editorConfig = {};

    return {
      editor,
      editorData,
      editorConfig,
    };
  },
});
</script>
