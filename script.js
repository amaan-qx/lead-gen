let selectedFiles = [];

function addPhotos() {

  const input = document.getElementById("photos");

  if (input.files.length === 0) {
    return;
  }

  // Add newly selected files to existing files
  for (const file of input.files) {
    selectedFiles.push(file);
  }

  // Clear input so the same file can be selected again
  input.value = "";

  showFiles();
}


function showFiles() {

  const fileList = document.getElementById("fileList");

  fileList.innerHTML = "";

  selectedFiles.forEach((file, index) => {

    const div = document.createElement("div");

    div.className = "file";

    div.textContent = `${index + 1}. ${file.name}`;

    fileList.appendChild(div);

  });

}


async function uploadPhotos() {

  const status = document.getElementById("status");

  if (selectedFiles.length === 0) {
    status.textContent = "Please select photos.";
    return;
  }

  const formData = new FormData();

  for (const file of selectedFiles) {
    formData.append("photos", file);
  }

  status.textContent =
    `Uploading ${selectedFiles.length} photos...`;

  try {

    const response = await fetch(
      "https://agency-amaan.app.n8n.cloud/webhook-test/391c2f48-6e21-4d40-96fb-837686e13860",
      {
        method: "POST",
        body: formData
      }
    );

    const text = await response.text();

    console.log("Status:", response.status);
    console.log("Response:", text);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    status.textContent =
      "Photos uploaded successfully!";

    selectedFiles = [];
    showFiles();

  } catch (error) {

    console.error(error);

    status.textContent = error.message;

  }

}