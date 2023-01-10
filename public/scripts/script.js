var map, tile, currentLatitude, currentLongitude, response;
var markers = [],
    earth = 6378.137,
    pi = Math.PI,
    cos = Math.cos,
    meter = 1 / (((2 * pi) / 360) * earth) / 1000,
    circles = [],
    yOffset = 5,
    xOffset = 10,
    coords = [];

/* Ordinal Data */
const ordinal = [
    {
        index: 1,
        l: 0,
        g: 700000000,
        opacity: 0.4,
        color: "#fad4d4",
    },
    {
        index: 2,
        l: 700000000,
        g: 1000000000,
        opacity: 0.5,
        color: "#f78686",
    },
    {
        index: 3,
        l: 1000000000,
        g: 1700000000,
        opacity: 0.6,
        color: "#fa5c5c",
    },
    {
        index: 4,
        l: 1700000000,
        g: 2400000000,
        opacity: 0.7,
        color: "#f21f1f",
    },
    {
        index: 5,
        l: 2400000000,
        g: 3500000000,
        opacity: 0.8,
        color: "#c90202",
    },
    {
        index: 6,
        l: 3500000000,
        g: 10000000000,
        opacity: 0.9,
        color: "#380101",
    },
];

/* API */
const BASE_URL = "https://f632-113-11-180-58.ap.ngrok.io";
const AREA_ENDPOINT = `${BASE_URL}/api/area`;

/* Elements */
const element = document.getElementById("detail-property");
const button = document.getElementById("detail-property-info");

/**
 * Calculate latitude with addition by meters
 * @param {number} latitude - Latitude coordinate
 * @param {number} meters - Addition in meter
 * @return {number} - return latitude
 */
function latitudePlusMeters(latitude, meters) {
    return latitude + meters * meter;
}

/**
 * Calculate latitude with addition by meters
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @param {number} meters - Addition in meter
 * @return {number} - return longitude
 */
function longitudePlusMeters(latitude, longitude, meters) {
    return longitude + (meters * meter) / cos(latitude * (pi / 180));
}

/**
 * Determine whether a point is in a circle
 * @param {number} x1 - Latitude coordinate
 * @param {number} y1 - Longitude coordinate
 * @param {number} x2 - Circle center latitude
 * @param {number} y2 - Circle center longitude
 * @param {number} r - Radius in meter
 * @return {boolean}
 */
function checkPointInCircle(x1, y1, x2, y2, r) {
    const distPoints = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
    r = r / (((2 * pi) / 360) * earth) / 1000;
    r *= r;
    return distPoints < r;
}

/**
 * Initialize map layers
 * @return {void}
 */
async function init() {
    if (!map) {
        map = L.map("map", { zoomControl: false }).setView(
            [currentLatitude, currentLongitude],
            13
        );
    }
    coords = [];
    map.eachLayer(function (layer) {
        map.removeLayer(layer);
    });

    tile = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // map.on("click", addMarker);
    // map.touchZoom.disable();
    // map.doubleClickZoom.disable();
    // map.scrollWheelZoom.disable();
    // map.boxZoom.disable();
    // map.keyboard.disable();
    const diff = 1575;
    for (let j = 0; j < xOffset; j += 1) {
        for (let i = 0; i < yOffset; i += 1) {
            coords.push({
                latitude: latitudePlusMeters(currentLatitude, i * diff),
                longitude: longitudePlusMeters(
                    currentLatitude,
                    currentLongitude,
                    j * diff + (i % 2 === 0 ? 775 : 0)
                ),
            });
        }
        for (let i = 1; i < yOffset; i += 1) {
            coords.push({
                latitude: latitudePlusMeters(currentLatitude, -(i * diff)),
                longitude: longitudePlusMeters(
                    currentLatitude,
                    currentLongitude,
                    j * diff + (i % 2 === 0 ? 775 : 0)
                ),
            });
        }
    }
    for (let j = 1; j < xOffset; j += 1) {
        for (let i = 0; i < yOffset; i += 1) {
            coords.push({
                latitude: latitudePlusMeters(currentLatitude, i * diff),
                longitude: longitudePlusMeters(
                    currentLatitude,
                    currentLongitude,
                    -(j * diff - (i % 2 === 0 ? 775 : 0))
                ),
            });
        }
        for (let i = 1; i < yOffset; i += 1) {
            coords.push({
                latitude: latitudePlusMeters(currentLatitude, -(i * diff)),
                longitude: longitudePlusMeters(
                    currentLatitude,
                    currentLongitude,
                    -(j * diff - (i % 2 === 0 ? 775 : 0))
                ),
            });
        }
    }
    const data = await fetch(AREA_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            coords,
        }),
    }).then(async (res) => await res.json());
    response = data;
    showHeatmap();
}

/**
 * Determine whether a point is in a circle
 * @param {number | null} filter - Range index
 * @return {void}
 */
function showHeatmap(filter = null) {
    map.eachLayer(function (layer) {
        map.removeLayer(layer);
    });
    map.addLayer(tile);
    const { data } = response;
    data.forEach(({ average, center, coords }) => {
        if (average !== 0) {
            const ordinal = determineRange(average);
            let result;
            if (filter) {
                result = filter === ordinal.index;
            } else {
                result = true;
            }
            if (result) {
                const areaMarkers = [];
                const c1 = L.circle([center.latitude, center.longitude], {
                    radius: 1000 - 8,
                })
                    .addTo(map)
                    .bindTooltip(`${Number(average).toFixed()}`, {
                        permanent: true,
                        direction: "center",
                    })
                    .on("click", function () {
                        modal(center.latitude, center.longitude);
                    })
                    .on("mouseover", function () {
                        coords.forEach((coord) => {
                            const areaMarker = new L.Marker([coord.latitude, coord.longitude]);
                            areaMarker.addTo(map);
                            areaMarkers.push(areaMarker);
                        });
                    })
                    .on("mouseout", function () {
                        areaMarkers.forEach((marker) => {
                            marker.remove();
                        });
                    });

                c1.setStyle({
                    color: ordinal.color,
                    opacity: 0.8,
                    stroke: false,
                    fill: true,
                    fillColor: ordinal.color,
                    fillOpacity: 0.8,
                });
            }
        }
    });
}

/**
 * Determine whether a point is in a circle
 * @param {number} price - Price
 * @return {any}
 */
function determineRange(price) {
    let result = 0;
    for (let i = ordinal.length - 1; i >= 0; i -= 1) {
        if (price >= ordinal[i].l) {
            result = i;
            break;
        }
    }

    return ordinal[result];
}

/**
 * Get initial coordinate with client current location or manually defined
 * @return {void}
 */
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                currentLatitude = position.coords.latitude;
                currentLongitude = position.coords.longitude;
                init();
            },
            () => {
                currentLatitude = -6.9344694;
                currentLongitude = 107.6049539;
                init();
            }
        );
    } else {
        alert("Geolocation not supported");
    }
}

/**
 * Map click event handler to add marker on map
 * @param {any} e - Event
 * @return {void}
 */
function addMarker(e) {
    if (markers.length > 0) {
        markers[0].remove();
        markers = [];
    }
    const newMarker = new L.Marker([e.latlng.lat, e.latlng.lng]);
    newMarker.addTo(map);
    markers.push(newMarker);
}

/**
 * Open modal detail handler
 * @param {number} e - Event
 * @param {number}
 * @return {void}
 */
function modal(latitude, longitude) {
    element.classList.replace("hidden", "flex");
    const longitudeElement = document.getElementById("long");
    const latitudeElement = document.getElementById("lat");
    const priceElement = document.getElementById("harga");

    longitudeElement.innerHTML = longitude;
    latitudeElement.innerHTML = latitude;
}

/**
 * Click outside modal handler listener
 * @param {number} event - Click event
 * @return {void}
 */
window.addEventListener("click", (event) => {
    if (
        event.target != button &&
        !button.contains(event.target) &&
        event.target == element
    ) {
        element.classList.replace("flex", "hidden");
    }
});

/**
 * Reset heatmap and initialize with map center location
 * @return {void}
 */
function resetHeatmap() {
    const { lat, lng } = map.getCenter();
    currentLatitude = lat;
    currentLongitude = lng;
    init();
}

getCurrentLocation();
