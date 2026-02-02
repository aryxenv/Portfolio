var bxHome = document.querySelectorAll(".nav-item");
var demo = document.querySelector(".demo")
var downloadQuickNav = document.querySelectorAll(".downloadQuickNav")
var typeActivityText = document.querySelector(".typeActivityText")
var randomActivityBtn = document.querySelector(".randomButton")
var downloadBtn = document.querySelector(".downloadButton")
var homePage = document.querySelector(".homePage")
var demoPage = document.querySelector(".demoPage")
var aboutPage = document.querySelector(".aboutPage")
var contactPage = document.querySelector(".contactPage")
var downloadPage = document.querySelector(".downloadPage")
var homeNav = document.querySelector(".home")
var demoNav = document.querySelector(".demoNav")
var aboutNav = document.querySelector(".about")
var contactNav = document.querySelector(".contact")
var downloadNav = document.querySelector(".download")
var hereToContact = document.querySelector(".hereToContact")
var mailCard = document.querySelector(".mailCard")
var githubCard = document.querySelector(".githubCard")
var instagramCard = document.querySelector(".instagramCard")
var buttonClickable = true

function handleEnterKeyPress(event) {
    if (event.key === 'Enter') {
        if (!demoPage.classList.contains('hidden') && buttonClickable) {
            buttonClickable = false
            randomActivityBtn.click();

            setTimeout(function() {
                buttonClickable = true;
            }, 2000)
        }
    }
}

document.addEventListener('keydown', handleEnterKeyPress);

mailCard.addEventListener("click", function() {
    window.open("mailto:business@l145.be", "_blank")
})

githubCard.addEventListener("click", function() {
    window.open("https://github.com/legelff/ProjectActifuse", "_blank")
})

instagramCard.addEventListener("click", function() {
    window.open("https://www.instagram.com/l.egelf/", "_blank")
})

hereToContact.addEventListener("click", function() {
    homePage.classList.add("hidden")
    demoPage.classList.add("hidden")
    aboutPage.classList.add("hidden")
    contactPage.classList.remove("hidden")
    downloadPage.classList.add("hidden")
})

demo.addEventListener("click", function() {
    homePage.classList.add("hidden")
    demoPage.classList.remove("hidden")
    aboutPage.classList.add("hidden")
    contactPage.classList.add("hidden")
    downloadPage.classList.add("hidden")
})

downloadQuickNav.forEach(function(element) {
    element.addEventListener("click", function() {
        homePage.classList.add("hidden");
        demoPage.classList.add("hidden");
        aboutPage.classList.add("hidden");
        contactPage.classList.add("hidden");
        downloadPage.classList.remove("hidden");
    });
});

homeNav.addEventListener("click", function() {
    homePage.classList.remove("hidden")
    demoPage.classList.add("hidden")
    aboutPage.classList.add("hidden")
    contactPage.classList.add("hidden")
    downloadPage.classList.add("hidden")
})

demoNav.addEventListener("click", function() {
    homePage.classList.add("hidden")
    demoPage.classList.remove("hidden")
    aboutPage.classList.add("hidden")
    contactPage.classList.add("hidden")
    downloadPage.classList.add("hidden")
})

aboutNav.addEventListener("click", function() {
    homePage.classList.add("hidden")
    demoPage.classList.add("hidden")
    aboutPage.classList.remove("hidden")
    contactPage.classList.add("hidden")
    downloadPage.classList.add("hidden")
})

contactNav.addEventListener("click", function() {
    homePage.classList.add("hidden")
    demoPage.classList.add("hidden")
    aboutPage.classList.add("hidden")
    contactPage.classList.remove("hidden")
    downloadPage.classList.add("hidden")
})

downloadNav.addEventListener("click", function() {
    homePage.classList.add("hidden")
    demoPage.classList.add("hidden")
    aboutPage.classList.add("hidden")
    contactPage.classList.add("hidden")
    downloadPage.classList.remove("hidden")
})

downloadBtn.addEventListener("click", function() {
    window.open("https://github.com/legelff/ProjectActifuse/releases/tag/Pre-release", "_blank")
})

randomActivityBtn.addEventListener("click", function() {
    var outputActivity = document.querySelector(".outputActivity")
    outputActivity.innerHTML = ""

    var apiUrl = 'https://bored.api.lewagon.com/api/activity/';

    fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // for (var key in data) {
        //     outputActivity.innerHTML += `${key}: ${data[key]} <br>`;
        // }

        var activity = data["activity"]
        var type = data["type"]
        var participants = data["participants"]
        var link = data["link"]
        var priceRaw = data["price"]
        var accessibilityRaw = parseFloat(data["accessibility"])

        var price = ""
        if (priceRaw == 1) {
            price = "No"
        }

        else {
            price = "Yes"
        }

        var accessibility = ""

        switch (true) {
            case accessibilityRaw <= 0.10:
                accessibility = "Most accessible";
                break;
            case accessibilityRaw <= 0.20:
                accessibility = "Extremely accessible";
                break;
            case accessibilityRaw <= 0.30:
                accessibility = "Highly accessible";
                break;
            case accessibilityRaw <= 0.40:
                accessibility = "Very accessible";
                break;
            case accessibilityRaw <= 0.50:
                accessibility = "Quite accessible";
                break;
            case accessibilityRaw <= 0.60:
                accessibility = "Fairly accessible";
                break;
            case accessibilityRaw <= 0.70:
                accessibility = "Somewhat accessible";
                break;
            case accessibilityRaw <= 0.80:
                accessibility = "Moderately accessible";
                break;
            case accessibilityRaw <= 0.90:
                accessibility = "Slightly accessible";
                break;
            case accessibilityRaw <= 1.00:
                accessibility = "Least accessible";
                break;
            default:
                accessibility = "Invalid accessibility value";
                break;
        }

        type = capitalizeFirstLetter(type)

        if (link == "") {
            outputActivity.innerHTML += `
            <div class="typeActivity">
            <h2 class="typeActivityText">${type}</h2>
            </div>
            <div class="line"></div>
            <p class="descriptionActivity"> <b>Activity</b>: ${activity} <br>
            <b>Participants</b>: ${participants} <br> 
            <b>Free</b>: ${price} <br> 
            <b>Accessibility</b>: ${accessibility} </p>`
        }

        else {
            outputActivity.innerHTML += `
            <div class="typeActivity">
            <h2 class="typeActivityText">${type}</h2>
            </div>
            <div class="line"></div>
            <p class="descriptionActivity"><b>Activity</b>: ${activity} <br>
            <b>Participants</b>: ${participants} <br>
            <b>Free</b>: ${price} <br>
            <b>Accessibility</b>: ${accessibility} <br>
            <b>Link</b>: <a href=${link} target="_blank" class="demo">${link}</a></p>`;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
})

bxHome.forEach(function(bxHomeEl) {
    var icon = bxHomeEl.querySelector("i");

    bxHomeEl.addEventListener("mouseover", function() {
        icon.classList.add("bx-tada");
    });

    bxHomeEl.addEventListener("mouseout", function() {
        icon.classList.remove("bx-tada");
    });
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}