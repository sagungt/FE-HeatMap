var map = L.map("map", { zoomControl: false }).setView([-6.917008029115489, 107.61900716418606], 12);
var markers = [],
    loc = [];


/* API */
const BASE_URL = "https://api-heatmap-farcapital.fly.dev/v1";
const ALLHEATMAP = `${BASE_URL}/api/allheatmap`;
const CREATE = `${BASE_URL}/api/create`;

/* Elements */
const btn = document.querySelector("#submit"); // untuk mengambil element dari halaman web dengan id = submit
const form = document.querySelector("#handleForm"); // untuk mengambil element dari halaman web dengan id = handleForm

/**
 * Fetch api to load and show markers
 * @param {string} link - URL target
 * @returns {void}
 */
async function fetchApi(link) {
    let object = await fetch(link); // fetching api and get data
    let value = await object.json(); // change from array to json 

    loc = value.data.map((d) => [d.latitude, d.longitude, d.price]); // all data fetching from api akan ditampilkan dimap  
    for (i = 0; i < loc.length; i++) {
        L.marker([loc[i][0], loc[i][1]])
            .bindPopup("Price : " + loc[i][2])
            .addTo(map); // untuk menampilkan marker dan popup akan  
    }
}

/**
 * Click map handler to show marker and get coordinate values
 * @param {any} e - Event
 * @returns {void}
 */
function onClickMap(e) {
    if (markers.length > 0) {
        markers[0].remove();
        markers = [];
    }

    const latitudeElement = document.getElementById("lat");
    const longitudeElement = document.getElementById("long");

    latitudeElement.value = e.latlng.lat;
    longitudeElement.value = e.latlng.lng;

    const newMarker = new L.Marker([e.latlng.lat, e.latlng.lng]);
    newMarker.addTo(map);
    markers.push(newMarker);
}

/**
 * Show flash message
 * @param {boolean} show - Show state
 * @param {string} message - HTML Element in string
 * @returns {void}
 */
function toggleMessage(show, message) {
    const messageContainer = document.querySelector("#message"); //
    messageContainer.innerHTML = message; //
    if (show) { 
        messageContainer.classList.remove("hidden");
        messageContainer.classList.add("flex");
    } else {
        messageContainer.classList.add("hidden");
        messageContainer.classList.remove("flex");
    }
}

/**
 * Show loading indicator
 * @param {boolean} toggle - Loading state
 * @returns {void}
 */
function loading(toggle = false) {
    const loadingContainer = document.getElementById("loading");
    if (!toggle) {
        loadingContainer.classList.add("hidden");
        loadingContainer.classList.remove("flex");
    } else {
        loadingContainer.classList.add("flex");
        loadingContainer.classList.remove("hidden");
    }
}

/**
 * Form button click handler
 * @param {any} e - Event
 * @returns {void}
 */
btn.addEventListener("click", (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    formData.append("harga", document.querySelector("#price").value);
    formData.append("lat", document.querySelector("#lat").value);
    formData.append("long", document.querySelector("#long").value);

    fetch(CREATE, {
        method: "POST",
        body: formData,
        headers: {
            Authorization: localStorage.getItem("token"),
            "d-app-authorization": localStorage.getItem("app_key"),
        },
    })
        .then((res) => res.json())
        .then(async (data) => {
            if (data.status) {
                toggleMessage(
                    true,
                    '<span class="text-xs italic font-bold text-blue-700">Data inserted</span>'
                );
            } else {
                toggleMessage(
                    true,
                    '<span class="text-xs italic font-bold text-red-700">Failed</span>'
                );
            }
            await init();
            setTimeout(() => {
                toggleMessage(false);
            }, 3000);
        })
        .catch((err) => {
            toggleMessage(
                true,
                '<span class="text-xs italic font-bold text-red-700">Failed to insert data</span>'
            );
            setTimeout(() => {
                toggleMessage(false);
            }, 3000);
        });
});

/**
 * Initialize map and fetch data to api
 * @returns {void}
 */
async function init() {
    if (!localStorage.getItem("app_key"))
        localStorage.setItem(
            "app_key",
            Math.random().toString(36) + Math.random().toString(36).substring(2)
        );
    loading(true);
    map.on("click", onClickMap);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    await fetchApi(ALLHEATMAP);
    loading(false);
}

init();