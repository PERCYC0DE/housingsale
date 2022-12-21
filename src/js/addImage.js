import { Dropzone } from "dropzone";

const token = document
  .querySelector('meta[name="csrf-token"]')
  .getAttribute("content");

Dropzone.options.image = {
  dictDefaultMessage: "Sube tus imágenes aquí",
  acceptedFiles: ".png,.jpg,.jpeg",
  maxFilesize: 5,
  maxFiles: 1,
  paralleUploads: 1,
  autoProcessQueue: false, // Upload image automatic
  addRemoveLinks: true,
  dictRemoveFile: "Borrar archivo",
  dictMaxFilesExceeded: "El limite es un archivo",
  headers: {
    "CSRF-Token": token,
  },
  paramName: "image",
  // Modify function to upload file with button in form
  init: function () {
    const dropzone = this;
    const btnPublish = document.querySelector("#publish");
    btnPublish.addEventListener("click", function () {
      dropzone.processQueue();
    });

    dropzone.on("queuecomplete", function () {
      console.log("Se subio");
      if (dropzone.getActiveFiles().length == 0) {
        window.location.href = "/properties";
      }
    });
  },
};
