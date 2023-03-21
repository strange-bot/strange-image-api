function copyApiKey() {
    var apiKeyCopy = document.getElementById("apikeyshow");

    apiKeyCopy.select();
    apiKeyCopy.setSelectionRange(0, 99999);

    navigator.clipboard.writeText(apiKeyCopy.value);

    alert("Copied API Key");
}

function generateApiKey() {
    fetch("/generate-key")
        .then((response) => response.json())
        .then((data) => {
            alert("Generated API Key");
            document.getElementById("apikeyhide").value = data.apiKey;
            document.getElementById("apikeyshow").value = data.apiKey;
        })
        .catch((error) => {
            alert("Failed to generate API Key");
            console.error(error);
        });
}

function showApiKey() {
    var spolier = document.getElementById("apikeyhide");
    var showspoiler = document.getElementById("apikeyshow");

    if (spolier.style.display == "none") {
        spolier.style.display = "block";
        showspoiler.style.display = "none";
    } else {
        spolier.style.display = "none";
        showspoiler.style.display = "block";
    }
}
