import {
  database,
  getDownloadURL,
  deleteObject,
  onValue,
  ref,
  refdb,
  remove,
  set,
  storage,
  update,
  uploadBytesResumable,
} from "./firebase.js";
import { resizeAll } from "./gallery.js";
import {
  voiceAnimationRipple,
  voiceAnimationSleazy,
  voiceAnimationUndulating,
} from "./voice-animation.js";

const metadata = {
  contentType: "image/jpeg",
};
const loadingContainer = document.querySelector(".loading-container");
const uploadImageForm = document.getElementById("upload-image-form");
const gallery = document.querySelector("#gallery");
const imageUpload = document.getElementById("image-uploaded");
const chooseFile = document.getElementById("choose-file");
const btnSearch = document.querySelector(".btn-search");
const searchInput = document.querySelector("#search");
const voiceIcon = document.getElementById("voice-icon");
const voiceAnimation = document.getElementById("voice-animation");
const contentUploadImage = document.querySelector("#upload-image-form p");

loadingContainer.style.display = "flex";

function removeAccents(str) {
  var AccentsMap = [
    "aàảãáạăằẳẵắặâầẩẫấậ",
    "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
    "dđ",
    "DĐ",
    "eèẻẽéẹêềểễếệ",
    "EÈẺẼÉẸÊỀỂỄẾỆ",
    "iìỉĩíị",
    "IÌỈĨÍỊ",
    "oòỏõóọôồổỗốộơờởỡớợ",
    "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
    "uùủũúụưừửữứự",
    "UÙỦŨÚỤƯỪỬỮỨỰ",
    "yỳỷỹýỵ",
    "YỲỶỸÝỴ",
  ];
  for (var i = 0; i < AccentsMap.length; i++) {
    var re = new RegExp("[" + AccentsMap[i].substr(1) + "]", "g");
    var char = AccentsMap[i][0];
    str = str.replace(re, char);
  }
  return str;
}

const uploadImageToFirebase = (folder, file, keyword) => {
  const storageRef = ref(storage, folder + "/" + file.name);
  const uploadTask = uploadBytesResumable(storageRef, file, metadata);

  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
      switch (snapshot.state) {
        case "paused":
          console.log("Upload is paused");
          break;
        case "running":
          console.log("Upload is running");
          break;
      }
    },
    (error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case "storage/unauthorized":
          // User doesn't have permission to access the object
          break;
        case "storage/canceled":
          // User canceled the upload
          break;

        // ...

        case "storage/unknown":
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    },
    () => {
      // Upload completed successfully, now we can get the download URL
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log("File available at", downloadURL);
        set(
          refdb(
            database,
            "images/" + removeAccents(file.name.replace(".", "_"))
          ),
          {
            name: file.name,
            keyword: keyword,
            url: downloadURL,
          }
        ).then(() => {
          loadingContainer.style.display = "none";
        });
      });
    }
  );
};

const galleryItemCreated = (name, url, keyword, description) => {
  const galleryItem = document.createElement("div");
  galleryItem.classList.add("gallery-item");

  const content = document.createElement("div");
  content.classList.add("content");

  const img = document.createElement("img");
  img.src = url;
  img.alt = name;

  const expand = document.createElement("div");
  expand.classList.add("expand");

  const btnCloseExpand = document.createElement("div");
  btnCloseExpand.classList.add("btn-close-expand");
  btnCloseExpand.innerHTML = `<span class="material-symbols-rounded">close</span>`;

  const properties = document.createElement("div");
  properties.classList.add("properties");

  const propertiesName = document.createElement("div");
  propertiesName.classList.add("properties-name");
  propertiesName.innerHTML = `<h3>${name}</h3>`;

  const propertiesKeyword = document.createElement("div");
  propertiesKeyword.classList.add("properties-keyword");
  propertiesKeyword.innerHTML = `<label>Từ khóa</label>`;

  const propertiesKeywordTextarea = document.createElement("textarea");
  propertiesKeywordTextarea.textContent = keyword;

  const propertiesDescription = document.createElement("div");
  propertiesDescription.classList.add("properties-description");
  propertiesDescription.innerHTML = `<label>Mô tả</label>`;

  const propertiesDescriptionTextarea = document.createElement("textarea");
  propertiesDescriptionTextarea.textContent = description;

  const btnSaveProperties = document.createElement("div");
  btnSaveProperties.classList.add("btn-save-properties");
  btnSaveProperties.innerHTML = `<span class="material-symbols-rounded">save</span>`;

  const btnDeleteProperties = document.createElement("div");
  btnDeleteProperties.classList.add("btn-delete-properties");
  btnDeleteProperties.innerHTML = `<span class="material-symbols-rounded">delete</span>`;

  gallery.appendChild(galleryItem);
  content.appendChild(img);
  galleryItem.appendChild(content);
  galleryItem.appendChild(expand);
  expand.appendChild(properties);
  expand.appendChild(btnCloseExpand);
  properties.appendChild(propertiesName);
  properties.appendChild(propertiesKeyword);
  properties.appendChild(propertiesKeywordTextarea);
  properties.appendChild(propertiesDescription);
  properties.appendChild(propertiesDescriptionTextarea);
  properties.appendChild(btnSaveProperties);
  properties.appendChild(btnDeleteProperties);

  btnCloseExpand.addEventListener("click", () => {
    console.log(124124);
    expand.style.display = "none";
    galleryItem.classList.remove("full");
  });

  btnSaveProperties.addEventListener("click", () => {
    loadingContainer.style.display = "flex";
    update(refdb(database, "images/" + removeAccents(name.replace(".", "_"))), {
      keyword: propertiesKeywordTextarea.value,
      description: propertiesDescriptionTextarea.value,
    }).then(() => {
      setTimeout(() => {
        loadingContainer.style.display = "none";
      }, 2000);
    });
  });

  btnDeleteProperties.addEventListener("click", () => {
    loadingContainer.style.display = "flex";
    remove(
      refdb(database, "images/" + removeAccents(name.replace(".", "_")))
    ).then(() => {
      setTimeout(() => {
        loadingContainer.style.display = "none";
      }, 2000);
    });
    deleteObject(ref(storage, "images/" + name));
  });

  img.addEventListener("click", () => {
    galleryItem.classList.add("full");
    expand.style.display = "flex";
  });

  return galleryItem;
};

const galleryCharacterCreated = (character, listItem) => {
  const galleryCharacter = document.createElement("div");
  galleryCharacter.classList.add("gallery-character");

  const h3 = document.createElement("h3");
  h3.textContent = character;

  const galleryItemList = document.createElement("div");
  galleryItemList.classList.add("gallery-item-list");

  listItem.forEach((item) => {
    const galleryItem = galleryItemCreated(
      item.name,
      item.url,
      item.keyword,
      item.description
    );
    galleryItemList.appendChild(galleryItem);
  });

  gallery.appendChild(galleryCharacter);
  galleryCharacter.appendChild(h3);
  galleryCharacter.appendChild(galleryItemList);
};

onValue(refdb(database, "images"), (snapshot) => {
  loadingContainer.style.display = "flex";

  const data = snapshot.val();
  if (!data) {
    loadingContainer.style.display = "none";
    return;
  }
  const fileNames = Object.keys(data);
  const fileValues = Object.values(data);

  let docsGalleryCharacter = {};

  gallery.innerHTML = "";
  fileNames.forEach((file, index) => {
    const character = file.slice(0, 1).toLowerCase();
    console.log(character, file);
    if (docsGalleryCharacter[character] !== undefined) {
      docsGalleryCharacter[character][file] = {
        name: fileValues[index].name,
        url: fileValues[index].url,
        keyword: fileValues[index].keyword,
        description: fileValues[index].description,
      };
    } else {
      docsGalleryCharacter[character] = {
        [file]: {
          name: fileValues[index].name,
          url: fileValues[index].url,
          keyword: fileValues[index].keyword,
          description: fileValues[index].description,
        },
      };
    }

    if (index === fileNames.length - 1) {
      console.log(1, Object.keys(docsGalleryCharacter));
      const listCharacter = Object.keys(docsGalleryCharacter);
      console.log(2, listCharacter);

      listCharacter.forEach((character) => {
        galleryCharacterCreated(
          character,
          Object.values(docsGalleryCharacter[character])
        );
      });

      setTimeout(() => {
        resizeAll();
        loadingContainer.style.display = "none";
      }, 2000);
    }
  });
});

const searchByKey = (keyword) => {
  onValue(refdb(database, "images"), (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      return;
    }

    const fileNames = Object.keys(data);
    const fileValues = Object.values(data);
    const keywordUpToLowerCase = removeAccents(
      keyword.toLowerCase().split(".")[0]
    );
    let searchTemp = false;

    let docsGalleryCharacter = {};

    gallery.innerHTML = "";
    fileNames.forEach((file, index) => {
      const listKeyword = removeAccents(
        fileValues[index].keyword.toLowerCase()
      ).split(",");

      for (let i = 0; i < listKeyword.length; i++) {
        if (listKeyword[i].trim().includes(keywordUpToLowerCase)) {
          const character = file.slice(0, 1).toLowerCase();
          if (docsGalleryCharacter[character] !== undefined) {
            docsGalleryCharacter[character][file] = {
              name: fileValues[index].name,
              url: fileValues[index].url,
              keyword: fileValues[index].keyword,
              description: fileValues[index].description,
            };
          } else {
            docsGalleryCharacter[character] = {
              [file]: {
                name: fileValues[index].name,
                url: fileValues[index].url,
                keyword: fileValues[index].keyword,
                description: fileValues[index].description,
              },
            };
          }
          searchTemp = true;
          resizeAll();
          break;
        }
      }

      if (index === fileNames.length - 1) {
        const listCharacter = Object.keys(docsGalleryCharacter);
        listCharacter.forEach((character) => {
          galleryCharacterCreated(
            character,
            Object.values(docsGalleryCharacter[character])
          );
        });

        setTimeout(() => {
          resizeAll();
          loadingContainer.style.display = "none";
        }, 2000);
      }
    });

    if (searchTemp === false) {
      gallery.innerHTML = "";
      gallery.innerHTML = `<div class="gallery-empty">
        <h3>Đang tìm kiếm trên Google</h3>
      </div>`;

      let query = keyword;
      let url = "http://www.google.com/search?q=" + query + "&tbm=isch";
      window.open(url, "_blank");
    }
  });
};

class SpeechRecognitionApi {
  constructor(options) {
    const SpeechToText =
      window.speechRecognition || window.webkitSpeechRecognition;
    this.speechApi = new SpeechToText();
    this.speechApi.continuous = true;
    this.speechApi.interimResults = false;
    this.speechApi.lang = "vi-VN";
    this.output = options.output
      ? options.output
      : document.createElement("div");

    this.speechApi.onspeechstart = () => {
      voiceAnimationUndulating();
    };

    this.speechApi.onresult = (event) => {
      var resultIndex = event.resultIndex;
      var transcript = event.results[resultIndex][0].transcript;

      console.log("transcript>>", transcript);
      this.output.value = transcript;

      searchByKey(transcript);
      this.speechApi.stop();
      voiceIconStatus(false);
    };
  }
  init() {
    this.speechApi.start();
  }
  stop() {
    this.speechApi.stop();
  }
}

const voiceIconStatus = (status) => {
  if (status) {
    voiceAnimationSleazy();
    voiceIcon.style.display = "none";
    voiceAnimation.style.display = "flex";
  } else {
    voiceAnimationRipple();
    voiceIcon.style.display = "flex";
    voiceAnimation.style.display = "none";
  }
};

window.onload = function () {
  const speech = new SpeechRecognitionApi({
    output: searchInput,
  });

  chooseFile.addEventListener("change", function (e) {
    contentUploadImage.textContent = "";
    const file = e.target.files[0];
    imageUpload.src = URL.createObjectURL(file);
  });

  uploadImageForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const imageFile = e.target.elements.file.files[0];
    const keyword = e.target.elements.keyword.value;

    loadingContainer.style.display = "flex";

    uploadImageToFirebase("images", imageFile, keyword);
  });

  btnSearch.addEventListener("click", function (e) {
    e.preventDefault();
    const keyword = document.querySelector("#search").value;
    searchByKey(keyword);
  });

  voiceIcon.addEventListener("click", function () {
    voiceIconStatus(true);
    speech.init();
  });
};
