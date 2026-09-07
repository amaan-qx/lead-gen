function showResults(results) {

  const container = document.getElementById("results");

  container.innerHTML = "";

  results.forEach((brand) => {

    const div = document.createElement("div");

    div.className = "result";


    const name = document.createElement("span");

    name.textContent = brand.brand_name;


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


    const instagramButton = document.createElement("a");

    instagramButton.textContent = "Open Instagram";

    instagramButton.href = brand.instagram_url;

    instagramButton.target = "_blank";

    instagramButton.rel = "noopener noreferrer";


    div.appendChild(name);

    div.appendChild(copyButton);

    div.appendChild(instagramButton);

    container.appendChild(div);

  });

}


async function submitLeads() {

  const status = document.getElementById("status");

  const submitButton = document.getElementById("submitButton");

  const loader = document.getElementById("loader");

  const leadText = document.getElementById("leadText").value.trim();


  // No text

  if (!leadText) {

    status.textContent = "Please paste Instagram usernames.";

    return;

  }


  // Disable button

  submitButton.disabled = true;

  submitButton.textContent = "Processing...";


  // Clear previous results

  document.getElementById("results").innerHTML = "";


  // Show loader

  loader.classList.remove("hidden");

  status.textContent = "Processing your leads...";


  try {

    const response = await fetch(
      "https://agency-amaan.app.n8n.cloud/webhook/391c2f48-6e21-4d40-96fb-837686e13860",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          text: leadText
        })
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


    // Results check

    if (!data.results || !Array.isArray(data.results)) {

      throw new Error("Invalid response from server.");

    }


    showResults(data.results);


    status.textContent =
      `Done! Found ${data.results.length} lead${data.results.length !== 1 ? "s" : ""}.`;


  } catch (error) {

    console.error("Request failed:", error);

    status.textContent =
      `Something went wrong: ${error.message}`;

  }


  // Hide loader

  loader.classList.add("hidden");


  // Enable button

  submitButton.disabled = false;

  submitButton.textContent = "Submit";

}