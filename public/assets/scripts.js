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
            if (typeof data.apiKey === "string") {
                document.getElementById("apikeyhide").value = data.apiKey.replace(/./g, "*");
                document.getElementById("apikeyshow").value = data.apiKey;
                alert("Successfully Generated API Key");
            } else {
                alert("Failed to generate API Key");
                console.error(data);
            }
        })
        .catch((error) => {
            alert("Failed to generate API Key");
            console.error(error);
        });
}

function showApiKey() {
    var spoiler = document.getElementById("apikeyhide");
    var showSpoiler = document.getElementById("apikeyshow");

    var showButton = document.querySelector("#showBtn > span");
    var showIcon = document.querySelector("#showBtn > i");

    if (spoiler.style.display == "block") {
        spoiler.style.display = "none";
        showSpoiler.style.display = "block";
        showButton.innerHTML = "Hide";

        showIcon.classList.remove("fa-eye");
        showIcon.classList.add("fa-eye-slash");
    } else {
        spoiler.style.display = "block";
        showSpoiler.style.display = "none";
        showButton.innerHTML = "Show";

        showIcon.classList.remove("fa-eye-slash");
        showIcon.classList.add("fa-eye");
    }
}
