var map,
    tile,
    currentLatitude,
    currentLongitude,
    response,
    svgBar,
    svgLine,
    searchMarker;
var markers = [],
    earth = 6378.137,
    pi = Math.PI,
    cos = Math.cos,
    meter = 1 / (((2 * pi) / 360) * earth) / 1000, // meter in map scale
    circles = [],
    yOffset = 5,
    xOffset = 10,
    coords = [],
    opacity = 0.5,
    propertyMarkers = [], // this 
    filterValue = [], // true: display property Marked, False: hidden Property Marked
    property = false, // true: display property Marked, False: hidden Property Marked
    mode = 0; // 0: default, 1: hover

/* Ordinal Data */
const ordinal = [
    {
        index: 1,
        l: 0,
        g: 700000000,
        opacity: 0.1,
        color: "#fcf04f",
    },
    {
        index: 2,
        l: 700000000,
        g: 1000000000,
        opacity: 0.1,
        color: "#9bffed",
    },
    {
        index: 3,
        l: 1000000000,
        g: 1700000000,
        opacity: 0.4,
        color: "#7ff866",
    },
    {
        index: 4,
        l: 1700000000,
        g: 2400000000,
        opacity: 0.5,
        color: "#4270f0",
    },
    {
        index: 5,
        l: 2400000000,
        g: 3500000000,
        opacity: 0.6,
        color: "#f52e2e",
    },
    {
        index: 6,
        l: 3500000000,
        g: 10000000000,
        opacity: 0.7,
        color: "#160101",
    },
];

/* API */
const BASE_URL = "https://api-heatmap-farcapital.fly.dev/v1";
const AREA_ENDPOINT = `${BASE_URL}/api/area`;
const SEARCH_ENDPOINT = `${BASE_URL}/api/search`;
const ADDRESS_ENDPOINT = `${BASE_URL}/api/reverse`;

/**
 * Format number with million, billion etc suffixes
 * @param {number} number - jumlah nominal Price
 * @return {number} formated number
 */
function formatPrice(number) {
    const min = 1e3;
    // Alter numbers larger than 1k
    if (number >= min) {
        var units = ["rb", "jt", "m", "t"];
        var order = Math.floor(Math.log(number) / Math.log(1000));
        var unitname = units[order - 1];
        var num = +(number / 1000 ** order).toFixed(2);
        
        return num + unitname; // output number remainder + unitname
    }
    return number.toLocaleString(); // mengembalikan nomor asli yang diformat
}

/**
 * Show error message indicator
 * @param {boolean} toggle - Error state
 * @returns {void}
 */
function showError(toggle = false) {
    const getErrorId = document.getElementById("error"); // getting element html by id
    if (toggle) return getErrorId.classList.replace("hidden", "flex"); // if toggle is true, then in class will deleted hidden and adding flex
    return getErrorId.classList.replace("flex", "hidden"); // then else in class will deleted flex and adding hidden
}

/**
 * Show loading indicator
 * @param {boolean} toggle - Loading state
 * @returns {void}
 */
function loading(toggle = false) {
    const getLoading = document.getElementById("loading"); // getting element html by id
    const overlayLoading = document.getElementById("overlay-loading"); // getting element html by id
    if (toggle){ // if toggle is true, then class in id loading & overlay-loading will deleted hidden & adding flex, and program will stop   
        getLoading.classList.replace("hidden", "flex"); 
        overlayLoading.classList.replace("hidden", "flex"); 
        return;
    } 
    // then else class in id loading & overlay-loading will deleted flex & adding hidden 
    getLoading.classList.replace("flex", "hidden");
    overlayLoading.classList.replace("flex", "hidden");
}

/**
 * Toggle hide legend information
 * @returns {void}
 */
function animationLegend() {
    const btnLegend = document.querySelector(".btn-legend"); 
    const btnIcon = document.querySelector(".btn-legend i");
    const legend = document.querySelector(".legend");
    btnLegend.classList.toggle("btn-legend-aktif");  
    btnLegend.classList.toggle("btn-legend-nonaktif");
    legend.classList.toggle("left-5");
    legend.classList.toggle("-left-[300px]"); 
    legend.classList.toggle("sm:-left-[400px]");
    btnIcon.classList.toggle("rotate-90");
    btnIcon.classList.toggle("rotate-0");
    // searchOnThisArea.classList.toggle("top-[335px]");
    // searchOnThisArea.classList.toggle("top-[593px]");
}

/* get button by id show marker */
const btnShowMarker = document.getElementById("show-marker");

/** get mode button */
const modeToggleElement = document.getElementById("mode");

/**
 * Toggle mode heatmap
 * @return {void}
 */
modeToggleElement.addEventListener("click", () => { // if toggle mode clicked
    modeToggleElement.classList.toggle("bg-blue-700"); // class in modeToggleElement will delete bg-blue-700
    modeToggleElement.classList.toggle("hover:bg-blue-700/80"); // class in modeToggleElement will delete bg-blue-700
    modeToggleElement.classList.toggle("focus:ring-blue-300"); // class in modeToggleElement will delete focus:bg-purple-700
    modeToggleElement.classList.toggle("bg-purple-700"); // class in modeToggleElement will delete bg-purple-700
    modeToggleElement.classList.toggle("hover:bg-purple-700/80"); // class in modeToggleElement will delete hover:bg-purple-700/80
    modeToggleElement.classList.toggle("focus:ring-purple-300"); // class in modeToggleElement will delete focus:ring-purple-700
    if (modeToggleElement.innerHTML === "Default mode"){ // if content in modeToggleElement is Default mode will change content in modeToggleElement from Default mode to Hover mode
        modeToggleElement.innerHTML = "Hover mode"; // if in modeToggleElement content is Default
        mode = 0; // if in modeToggleElement content is Default
    } else { // then else will change content in modeToggleElement from Default mode to Hover mode
        modeToggleElement.innerHTML = "Default mode"; // else will content in modeToggleElement change from Hover mode to Default mode   
        mode = 1; // else will content in modeToggleElement change from Hover mode to Default mode
    }
    showHeatmap(); // show heat map
});

/**
 * Show property markers
 * @returns {void}
 */
async function showProperty() {
    loading(true); // call loading function for display loading before property displayed

    // class in btnShowMarker exists in argument toggle it will deleted, else value in argumen will add in class

    // by default this is not exists in the class, this is for hidden property marker mode
    btnShowMarker.classList.toggle("bg-red-600"); 
    btnShowMarker.classList.toggle("hover:bg-red-600/80"); 
    
    // by default this is exists in the class, this is for show property marker mode
    btnShowMarker.classList.toggle("bg-slate-600");
    btnShowMarker.classList.toggle("hover:bg-slate-600/80");

    if (btnShowMarker.innerHTML === "Hide markers") {  
        btnShowMarker.innerHTML = "Show markers"; // change content in btnShowMarker from Hide markers to Show markers
    } else {
        btnShowMarker.innerHTML = "Hide markers"; // else change content in btnShowMarker from Show markers to Hide markers
    }

    property = !property; // change status property 

    if (property) {
        await fetchPropertyApi(`${BASE_URL}/api/allheatmap`); // call a fetchPropertyApi for 
    } else {
        for (i = 0; i < propertyMarkers.length; i++) { 
            propertyMarkers[i].remove(); // it will delete all data in array propertyMarkers
        }

        propertyMarkers = []; // it will delete 
    }
    loading(false);
}

/**
 * for fetching data in api
 * @param {string} link - link of api
 * @returns {void}
 */
async function fetchPropertyApi(link) {
    let object = await fetch(link); // fetching api and get data
    let value = await object.json(); // change from array to json 

    // if an errors occurs when fetching data, it will display error message  
    if (!value.status) {
        loading(false);
        return showError(true);
    }

    // if fetching is successful, all data in api will added to array in propertyMarkers and will show marker in map
    value.data.forEach((data) => {
        const propertyMarker = new L.Marker([data.latitude, data.longitude])
            .bindPopup("Price : " + formatPrice(data.price))
            .addTo(map);
        propertyMarkers.push(propertyMarker);
    });
}

/* Elements */
const modalElement = document.getElementById("detail-property");
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
    loading(true);
    if (!map) {
        map = L.map("map", { zoomControl: false }).setView(
            [currentLatitude, currentLongitude],
            13
        );
    }
    coords = [];
    map.eachLayer(function (layer) {
        if (layer.type !== 'tile') map.removeLayer(layer);
    });
    tile = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    })
    tile['type'] = 'tile';
    tile.addTo(map);

    map.on("move", function () {
        const { lat, lng } = this.getCenter();
        const searchOnThisAreaElement = document.querySelector(
            "#search-on-this-area"
        );
        if (!(currentLatitude === lat && currentLongitude === lng)) {
            setTimeout(() => {
                searchOnThisAreaElement.classList.replace(
                    "opacity-0",
                    "opacity-100"
                );
            }, 300);
        }
    });
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
    })
        .then(async (res) => await res.json())
        .catch(() => {
            loading(false);
            showError(true);
        });
    response = data;
    showHeatmap();
    loading(false);
}

/**
 * Determine whether a point is in a circle
 * @param {number | null} filter - Range index
 * @return {void}
 */
function showHeatmap(filter = null) {
    if (filter === null) {
        filterValue = [];
    } else {
        if (filterValue.includes(filter)) {
            filterValue = filterValue.filter((f) => f !== filter);
        } else {
            filterValue.push(filter);
        }
    }
    map.eachLayer(function (layer) {
        if (layer.type !== 'tile') map.removeLayer(layer);
    });

    const colorsElement = document.querySelector('#colors');
    let colorItem = '';
    filterValue.forEach((f) => {
        colorItem += `
        <div class="text-xs w-6 h-3 rounded-full bg-range-${f}"></div>`;
    });
    colorsElement.innerHTML = colorItem;

    if (property) showProperty();
    const { data } = response;
    data.forEach(({ average, center, coords }) => {
        if (average !== 0) {
            const ordinal = determineRange(average);
            let result;

            if (filter) {
                // result = filter === ordinal.index;
                result = filterValue.includes(ordinal.index);
            } else {
                result = true;
            }

            if (filterValue.length === 0) {
                result = true;
            }

            if (result) {
                const areaMarkers = [];
                const circle = L.circle([center.latitude, center.longitude], {
                    radius: 1000 - 8,
                }).on("click", function () {
                    modal(center.latitude, center.longitude, coords);
                });
                if (mode === 0) {
                    circle.bindTooltip(`Rp. ${formatPrice(average)}`, {
                        permanent: true,
                        direction: "center",
                        opacity: 0.8,
                    });
                    circle.on("mouseover", function () {
                        coords.forEach((coord) => {
                            const areaMarker = new L.Marker([
                                coord.latitude,
                                coord.longitude,
                            ], { interactive: false });
                            areaMarker.addTo(map);
                            areaMarkers.push(areaMarker);
                        });
                        this.setStyle({
                            color: ordinal.color,
                            opacity: 0.9,
                            stroke: false,
                            fill: true,
                            fillColor: ordinal.color,
                            fillOpacity: 0.9,
                        });
                        circle.bindTooltip(`Rp. ${formatPrice(average)}`, {
                            permanent: true,
                            direction: "center",
                            opacity: 0.9,
                        });
                    });
                    circle.on("mouseout", function () {
                        areaMarkers.forEach((marker) => {
                            marker.remove();
                        });
                        circle.setStyle({
                            color: ordinal.color,
                            opacity,
                            stroke: false,
                            fill: true,
                            fillColor: ordinal.color,
                            fillOpacity: opacity,
                        });
                        circle.bindTooltip(`Rp. ${formatPrice(average)}`, {
                            permanent: true,
                            direction: "center",
                            opacity: 0.8,
                        });
                    });
                    circle.setStyle({
                        color: ordinal.color,
                        opacity,
                        stroke: false,
                        fill: true,
                        fillColor: ordinal.color,
                        fillOpacity: opacity,
                    });
                } else {
                    coords.forEach((coord) => {
                        const areaMarker = new L.Marker([
                            coord.latitude,
                            coord.longitude,
                        ], { interactive: false });
                        areaMarker.addTo(map);
                        areaMarkers.push(areaMarker);
                    });

                    circle.on("mouseover", function () {
                        this.setStyle({
                            color: ordinal.color,
                            opacity,
                            stroke: false,
                            fill: true,
                            fillColor: ordinal.color,
                            fillOpacity: opacity,
                        }).bindTooltip(`Rp. ${formatPrice(average)}`, {
                            permanent: true,
                            direction: "center",
                        });
                    });
                    circle.on("mouseout", function () {
                        this.setStyle({
                            color: "transparent",
                            opacity: 0.8,
                            stroke: false,
                            fill: true,
                            fillColor: "transparent",
                            fillOpacity: 0.8,
                        }).unbindTooltip();
                    });

                    circle.setStyle({
                        color: "transparent",
                        opacity: 0.8,
                        stroke: false,
                        fill: true,
                        fillColor: "transparent",
                        fillOpacity: 0.8,
                    });
                }
                circle.addTo(map);
                circles.push(circle);
            }
        }
    });
    
    return filterValue;
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
 * Reset heatmap and initialize with map center location
 * @return {void}
 */
function resetHeatmap() {
    const { lat, lng } = map.getCenter();
    currentLatitude = lat;
    currentLongitude = lng;
    if(property) showProperty();
    init();
    document
        .querySelector("#search-on-this-area")
        .classList.replace("opacity-100", "opacity-0");
}

/**
 * Go to location with determined coordinate
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @return {void}
 */
function goToLocation(latitude, longitude) {
    map.setView([latitude, longitude]);
    if (searchMarker) {
        searchMarker.remove();
    }
    searchMarker = new L.Marker([latitude, longitude]).addTo(map);
}

/**
 * Get client location
 * @returns {void}
 */
function myLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                goToLocation(latitude, longitude);
            },
            () => {
                alert("Couldn't access your location. Permission denied.");
            }
        );
    } else {
        alert("Geolocation not supported");
    }
}

/**
 * Change all circle opacity
 * @param {any} el - Input range element
 */
function changeOpacity(el) {
    opacity = el.value / 100;
    circles.forEach((circle) => {
        circle.setStyle({
            opacity,
            fillOpacity: opacity,
        });
    });
}

getCurrentLocation();
