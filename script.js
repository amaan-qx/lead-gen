let selectedFiles = [];

function addPhotos() {
  const input = document.getElementById("photos");

  if (input.files.length === 0) {
    return;
  }

  // Add newly selected files
  for (const file of input.files) {
    selectedFiles.push(file);
  }

  // Clear input so same file can be selected again
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


function showResults(results) {
  const container = document.getElementById("results");

  container.innerHTML = "";

  results.forEach((brand) => {

    const div = document.createElement("div");
    div.className = "result";


    // Brand name
    const name = document.createElement("span");

    name.textContent = brand.brand_name;


    // Copy button
    const copyButton = document.createElement("button");

    copyButton.textContent = "Copy";

    copyButton.onclick = async () => {

      try {

        await navigator.clipboard.writeText(brand.message);

        copyButton.textContent = "Copied!";

        setTimeout(() => {
          copyButton.textContent = "Copy";
        }, 1500);

      } catch (error) {

        console.error("Copy failed:", error);

      }
    };


    // Instagram button
    const instagramButton = document.createElement("a");

    instagramButton.textContent = "Open Instagram";

    instagramButton.href = brand.instagram_url;

    instagramButton.target = "_blank";

    instagramButton.rel = "noopener noreferrer";


    // Add everything
    div.appendChild(name);

    div.appendChild(copyButton);

    div.appendChild(instagramButton);

    container.appendChild(div);
  });
}


async function uploadPhotos() {

  const status = document.getElementById("status");

  const submitButton = document.getElementById("submitButton");

  const addButton = document.getElementById("addButton");

  const loader = document.getElementById("loader");


  // No files
  if (selectedFiles.length === 0) {

    status.textContent = "Please select photos.";

    return;
  }


  // Disable buttons
  submitButton.disabled = true;

  addButton.disabled = true;

  submitButton.textContent = "Processing...";


  // Clear previous results
  document.getElementById("results").innerHTML = "";


  // Show loader
  loader.classList.remove("hidden");

  status.textContent =
    `Processing ${selectedFiles.length} photo${selectedFiles.length > 1 ? "s" : ""}...`;


  // Create form data
  const formData = new FormData();

  for (const file of selectedFiles) {

    formData.append("photos", file);

  }


  try {

    const response = await fetch(
      "https://agency-amaan.app.n8n.cloud/webhook/391c2f48-6e21-4d40-96fb-837686e13860",
      {
        method: "POST",
        body: formData
      }
    );


    const text = await response.text();

    console.log("Status:", response.status);

    console.log("Response:", text);


    if (!response.ok) {

      throw new Error(
        `HTTP ${response.status}: ${text}`
      );

    }


    const data = JSON.parse(text);

    console.log("Data:", data);


    // Make sure results exist
    if (!data.results || !Array.isArray(data.results)) {

      throw new Error("Invalid response from server.");

    }


    // Display results
    showResults(data.results);


    // Success
    status.textContent =
      `Done! Found ${data.results.length} lead${data.results.length !== 1 ? "s" : ""}.`;


    // Clear selected files
    selectedFiles = [];

    showFiles();


  } catch (error) {

    console.error("Upload failed:", error);

    status.textContent =
      `Something went wrong: ${error.message}`;

  }


  // Hide loader
  loader.classList.add("hidden");


  // Enable buttons again
  submitButton.disabled = false;

  addButton.disabled = false;

  submitButton.textContent = "Submit";
}