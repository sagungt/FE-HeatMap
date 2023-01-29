// Global variable
var map,
    tile,
    currentLatitude,
    currentLongitude,
    response,
    svgBar,
    svgLine,
    searchMarker;
var earth = 6378.137, // earth equatorial radius
    pi = Math.PI, // pi value
    cos = Math.cos, // cos function
    meter = 1 / (((2 * pi) / 360) * earth) / 1000, // meter in map scale
    circles = [], // array for circle overlay
    yOffset = 5, // how many circle row from center
    xOffset = 10, // how many circle row from center
    coords = [], // array for circle
    opacity = 0.5, // default opacity
    propertyMarkers = [], // array for property markers
    filterValue = [], // array for filter
    property = false, // show property marker default value
    mode = 0; // 0: default, 1: hover

/* Ordinal Data for range category property price per meter^2 */
const ordinal = [
    {
        index: 1,
        l: 0,
        g: 2500000,
        color: "#fcf04f",
    },
    {
        index: 2,
        l: 2500000,
        g: 4500000,
        color: "#9bffed",
    },
    {
        index: 3,
        l: 4500000,
        g: 6500000,
        color: "#7ff866",
    },
    {
        index: 4,
        l: 6500000,
        g: 8500000,
        color: "#4270f0",
    },
    {
        index: 5,
        l: 8500000,
        g: 1050000,
        color: "#f52e2e",
    },
    {
        index: 6,
        l: 10500000,
        g: 12500000,
        color: "#160101",
    },
];

/* API endpoints */
const BASE_URL = "https://api-heatmap-farcapital.fly.dev/v1";
const AREA_ENDPOINT = `${BASE_URL}/api/area`;
const SEARCH_ENDPOINT = `${BASE_URL}/api/search`;
const ADDRESS_ENDPOINT = `${BASE_URL}/api/reverseArea`;

/**
 * Format number with million, billion etc suffixes
 * @param {number} number - jumlah nominal Price
 * @return {number} formated number
 */
function formatPrice(number) {
    const min = 1e3;
    // Alter numbers larger than 1k
    if (number >= min) {
        var units = ["rb", "jt", "m", "t"]; // define numeric format name
        var order = Math.floor(Math.log(number) / Math.log(1000)); // getting nearest integer that is less than or equal to a number.
        var unitname = units[order - 1]; // getting the numeric format
        // console.log(unitname)
        var num = +(number / 1000 ** order).toFixed(2); // getting number with decimal
        return num + unitname; // output number remainder + unitname
    }
    return number.toLocaleString(); // else return number with format price
}

/**
 * Show error message indicator
 * @param {boolean} toggle - Error state
 * @returns {void}
 */
function showError(toggle = false) {
    const getErrorId = document.getElementById("error"); // getting element html by id = error
    if (toggle) return getErrorId.classList.replace("hidden", "flex"); // if toggle is true, then in class will deleted hidden and adding flex
    return getErrorId.classList.replace("flex", "hidden"); // else in class will deleted flex and adding hidden
}

/**
 * Show loading indicator
 * @param {boolean} toggle - Loading state
 * @returns {void}
 */
function loading(toggle = false) {
    const getLoading = document.getElementById("loading"); // getting element html by id
    const overlayLoading = document.getElementById("overlay-loading"); // getting element html by id
    if (toggle) {
        // if toggle is true, then class in id loading & overlay-loading will deleted hidden & adding flex, and program will stop
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
    // retrieve html elements based on the class name listed in the legend.blade.php file
    const btnLegend = document.querySelector(".btn-legend");
    const btnIcon = document.querySelector(".btn-legend i");
    const legend = document.querySelector(".legend");

    // const searchOnThisArea = document.querySelector(".search-on-this-area");

    // Set classes to be added or removed
    // default is not active
    // if not active
    btnLegend.classList.toggle("btn-legend-nonaktif");
    legend.classList.toggle("-left-[300px]");
    legend.classList.toggle("sm:-left-[400px]");
    btnIcon.classList.toggle("rotate-0");

    // if active
    btnLegend.classList.toggle("btn-legend-aktif");
    legend.classList.toggle("left-5");
    btnIcon.classList.toggle("rotate-180");

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
modeToggleElement.addEventListener("click", () => {
    // if toggle mode clicked
    modeToggleElement.classList.toggle("bg-blue-700"); // class in modeToggleElement will delete bg-blue-700
    modeToggleElement.classList.toggle("hover:bg-blue-700/80"); // class in modeToggleElement will delete bg-blue-700
    modeToggleElement.classList.toggle("focus:ring-blue-300"); // class in modeToggleElement will delete focus:bg-purple-700
    modeToggleElement.classList.toggle("bg-purple-700"); // class in modeToggleElement will delete bg-purple-700
    modeToggleElement.classList.toggle("hover:bg-purple-700/80"); // class in modeToggleElement will delete hover:bg-purple-700/80
    modeToggleElement.classList.toggle("focus:ring-purple-300"); // class in modeToggleElement will delete focus:ring-purple-700
    if (modeToggleElement.innerHTML === "Default mode") {
        // if content in modeToggleElement is Default mode will change content in modeToggleElement from Default mode to Hover mode
        modeToggleElement.innerHTML = "Hover mode"; // if in modeToggleElement content is Default
        mode = 0; // if in modeToggleElement content is Default
    } else {
        // then else will change content in modeToggleElement from Default mode to Hover mode
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

    // if an errors occurs when fetching data, it will display error message hidden loading
    if (!value.status) {
        loading(false);
        return showError(true);
    }

    // if fetching is successful, all data in api will stored to array in propertyMarkers and will show marker in map
    value.data.forEach((data) => {
        let icon;
        if (data.type === "Tanah") {
            icon = L.icon({
                iconUrl: `${window.location.href}leaflet/images/marker-icon-land.png`,
                shadowUrl: `${window.location.href}leaflet/images/marker-shadow.png`,
                iconSize: [25, 36],
                iconAnchor: [12, 36],
                popupAnchor: [1, -34],
                shadowSize: [36, 36],
            });
        } else if (data.type === "Rumah") {
            icon = L.icon({
                iconUrl: `${window.location.href}leaflet/images/marker-icon-house.png`,
                shadowUrl: `${window.location.href}leaflet/images/marker-shadow.png`,
                iconSize: [25, 36],
                iconAnchor: [12, 36],
                popupAnchor: [1, -34],
                shadowSize: [36, 36],
            });
        } else {
            icon = L.icon({
                iconUrl: `${window.location.href}leaflet/images/marker-icon.png`,
                shadowUrl: `${window.location.href}leaflet/images/marker-shadow.png`,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
            });
        }
        const propertyMarker = new L.Marker([data.latitude, data.longitude], {
            icon,
        }).bindPopup("Price : " + formatPrice(data.price));
        propertyMarker.addTo(map);
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
    const distPoints = (x1 - x2) ** 2 + (y1 - y2) ** 2;
    r = r / (((2 * pi) / 360) * earth) / 1000;
    r *= r;
    return distPoints < r;
}

/**
 * Initialize map layers
 * @return {void}
 */
async function init() {
    // show loading overlay
    loading(true);

    // if map not exist it'll initialize map with leaflet map object
    if (!map) {
        map = L.map("map", { zoomControl: false }).setView(
            [currentLatitude, currentLongitude],
            13
        );

        // initialize tile layer and add to map object with openstreetmap
        tile = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution:
                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        });
        tile["type"] = "tile";
        tile.addTo(map);
    }

    // empty all grid coordinates
    coords = [];

    // remove all map layers
    map.eachLayer(function (layer) {
        // do not remove tile layer
        if (layer.type !== "tile") map.removeLayer(layer);
    });

    // add event handler when moving map
    map.on("move", function () {
        // get current center coordinate of the map
        const { lat, lng } = this.getCenter();

        // find search on this area element
        const searchOnThisAreaElement = document.querySelector(
            "#search-on-this-area"
        );

        // show search on this area button
        if (!(currentLatitude === lat && currentLongitude === lng)) {
            setTimeout(() => {
                searchOnThisAreaElement.classList.replace(
                    "opacity-0",
                    "opacity-100"
                );
            }, 300);
        }
    });
    // map.touchZoom.disable();
    // map.doubleClickZoom.disable();
    // map.scrollWheelZoom.disable();
    // map.boxZoom.disable();
    // map.keyboard.disable();

    // additional distance in actual meter
    const diff = 1575;

    // loop to right of the center
    for (let j = 0; j < xOffset; j += 1) {
        // loop loop to the bottom
        for (let i = 0; i < yOffset; i += 1) {
            // append coordinate to coords array
            // with computed distance in map scale
            coords.push({
                latitude: latitudePlusMeters(currentLatitude, i * diff),
                longitude: longitudePlusMeters(
                    currentLatitude,
                    currentLongitude,
                    j * diff + (i % 2 === 0 ? 775 : 0) // shift with additional distance if index is even
                ),
            });
        }

        // loop to the top
        for (let i = 1; i < yOffset; i += 1) {
            // append coordinate to coords array
            // with computed distance in map scale
            coords.push({
                latitude: latitudePlusMeters(currentLatitude, -(i * diff)),
                longitude: longitudePlusMeters(
                    currentLatitude,
                    currentLongitude,
                    j * diff + (i % 2 === 0 ? 775 : 0) // shift with additional distance if index is even
                ),
            });
        }
    }

    // loop to left of the center
    for (let j = 1; j < xOffset; j += 1) {
        // loop to the bottom
        for (let i = 0; i < yOffset; i += 1) {
            // append coordinate to coords array
            // with computed distance in map scale
            coords.push({
                latitude: latitudePlusMeters(currentLatitude, i * diff),
                longitude: longitudePlusMeters(
                    currentLatitude,
                    currentLongitude,
                    -(j * diff - (i % 2 === 0 ? 775 : 0)) // shift with additional distance if index is even
                ),
            });
        }
        for (let i = 1; i < yOffset; i += 1) {
            // append coordinate to coords array
            // with computed distance in map scale
            coords.push({
                latitude: latitudePlusMeters(currentLatitude, -(i * diff)),
                longitude: longitudePlusMeters(
                    currentLatitude,
                    currentLongitude,
                    -(j * diff - (i % 2 === 0 ? 775 : 0)) // shift with additional distance if index is even
                ),
            });
        }
    }

    // get area data to server
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
        // if failed to fetch
        .catch(() => {
            loading(false); // hide show overlay
            showError(true); // show error message
        });
    response = data;
    showHeatmap(); // show heatmap grid overlay
    loading(false); // hodden show overlay
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
        // remove filter if already exist in array
        if (filterValue.includes(filter)) {
            filterValue = filterValue.filter((f) => f !== filter);
        } else {
            // otherwise append to array
            filterValue.push(filter);
        }
    }

    // remove all layer except tile
    map.eachLayer(function (layer) {
        if (layer.type !== "tile") map.removeLayer(layer);
    });

    // build filter color elements
    const colorsElement = document.querySelector("#colors");
    let colorItem = "";
    filterValue.forEach((f) => {
        colorItem += `
        <div class="text-xs w-6 h-3 rounded-full bg-range-${f}"></div>`;
    });
    colorsElement.innerHTML = colorItem;

    if (property) showProperty();
    const { data } = response;

    data.forEach(({ average, center, coords }) => {
        // show heatmap overlay only if average price exist
        if (average !== 0) {
            const ordinal = determineRange(average); // determine the category of the area
            let result;

            if (filter) {
                // set true if area included in filter
                result = filterValue.includes(ordinal.index);
            } else {
                result = true;
            }

            // show all if no filter
            if (filterValue.length === 0) {
                result = true;
            }

            if (result) {
                const landIcon = L.icon({
                    iconUrl: `${window.location.href}leaflet/images/marker-icon-land.png`,
                    shadowUrl: `${window.location.href}leaflet/images/marker-shadow.png`,
                    iconSize: [25, 36],
                    iconAnchor: [12, 36],
                    popupAnchor: [1, -34],
                    shadowSize: [36, 36],
                });
                const houseIcon = L.icon({
                    iconUrl: `${window.location.href}leaflet/images/marker-icon-house.png`,
                    shadowUrl: `${window.location.href}leaflet/images/marker-shadow.png`,
                    iconSize: [25, 36],
                    iconAnchor: [12, 36],
                    popupAnchor: [1, -34],
                    shadowSize: [36, 36],
                });
                const defaultIcon = L.icon({
                    iconUrl: `${window.location.href}leaflet/images/marker-icon.png`,
                    shadowUrl: `${window.location.href}leaflet/images/marker-shadow.png`,
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41],
                });
                const areaMarkers = []; // array for all marker in area

                // initialize circle object of area's center coordinate and with radius += 1km
                const circle = L.circle([center.latitude, center.longitude], {
                    radius: 1000 - 8,
                })
                    // add click handler to circle and show modal
                    .on("click", function () {
                        modal(center.latitude, center.longitude, coords);
                    });

                // default mode
                if (mode === 0) {
                    // bind tooltip to show average price of the area
                    circle.bindTooltip(`Rp. ${formatPrice(average)}<br>/m²`, {
                        permanent: true,
                        direction: "center",
                        opacity: 0.8,
                        className: "text-center leading-none",
                    });

                    // add mouse over event listener to circle
                    // to change the circle opacity
                    // and show all the marker in the area
                    circle.on("mouseover", function () {
                        // append all marker on that area to the map
                        coords.forEach((coord) => {
                            let icon;
                            if (coord.type === "Tanah") icon = landIcon;
                            else if (coord.type === "Rumah") icon = houseIcon;
                            else icon = defaultIcon;
                            const areaMarker = new L.Marker(
                                [coord.latitude, coord.longitude],
                                { interactive: false, icon }
                            );
                            areaMarker.addTo(map);
                            areaMarkers.push(areaMarker);
                        });

                        // change the opacity of the circle
                        this.setStyle({
                            color: ordinal.color,
                            opacity: 0.9,
                            stroke: false,
                            fill: true,
                            fillColor: ordinal.color,
                            fillOpacity: 0.9,
                        });

                        // change the opacity of the tooltip
                        circle.bindTooltip(
                            `Rp. ${formatPrice(average)}<br>/m²`,
                            {
                                permanent: true,
                                direction: "center",
                                opacity: 0.9,
                                className: "text-center leading-none",
                            }
                        );
                    });

                    // add mouse over event listener to circle
                    // to change the circle opacity to previous value
                    // and hide all the marker in the area
                    circle.on("mouseout", function () {
                        // remove all markers
                        areaMarkers.forEach((marker) => {
                            marker.remove();
                        });

                        // restore circle style
                        circle.setStyle({
                            color: ordinal.color,
                            opacity,
                            stroke: false,
                            fill: true,
                            fillColor: ordinal.color,
                            fillOpacity: opacity,
                        });

                        // restore tooltip style
                        circle.bindTooltip(
                            `Rp. ${formatPrice(average)}<br>/m²`,
                            {
                                permanent: true,
                                direction: "center",
                                opacity: 0.8,
                                className: "text-center leading-none",
                            }
                        );
                    });

                    // set circle default style
                    circle.setStyle({
                        color: ordinal.color,
                        opacity,
                        stroke: false,
                        fill: true,
                        fillColor: ordinal.color,
                        fillOpacity: opacity,
                    });

                    // hover mode
                } else {
                    // add mouse over event listener to circle
                    // to show the circle overlay
                    circle.on("mouseover", function () {
                        this.setStyle({
                            color: ordinal.color,
                            opacity,
                            stroke: false,
                            fill: true,
                            fillColor: ordinal.color,
                            fillOpacity: opacity,
                        }).bindTooltip(`Rp. ${formatPrice(average)}<br>/m²`, {
                            permanent: true,
                            direction: "center",
                            className: "text-center leading-none",
                        });
                    });

                    // add mouse out event listener to circle
                    // to hide the circle overlay
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

                    // set default circle style to transparent
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
    // if client device support geolocation
    if (navigator.geolocation) {
        // retrieve current client device location
        navigator.geolocation.getCurrentPosition(
            // if allowed
            (position) => {
                currentLatitude = position.coords.latitude;
                currentLongitude = position.coords.longitude;
                init();
            },
            // if rejected
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
 * Reset heatmap and initialize with map center location
 * @return {void}
 */
function resetHeatmap() {
    // get map center coordinate
    const { lat, lng } = map.getCenter();
    currentLatitude = lat;
    currentLongitude = lng;
    if (property) showProperty(); // hide all property marker if showing

    // re-initialize all map and heatmap
    map.setZoom(13);
    init();

    // hide search on this area button
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
    map.setView([latitude, longitude], 13); // set map view to specified location

    // remove marker if exist
    if (searchMarker) {
        searchMarker.remove();
    }

    // add new marker to map
    searchMarker = new L.Marker([latitude, longitude]).addTo(map);
}

/**
 * Get client location
 * @returns {void}
 */
function myLocation() {
    // if client device support geolocation
    if (navigator.geolocation) {
        // retrieve current client device location
        navigator.geolocation.getCurrentPosition(
            // if allowed
            (position) => {
                const { latitude, longitude } = position.coords;
                goToLocation(latitude, longitude);
            },
            // if rejected
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
    // change opacity to scale 0 to 1
    opacity = el.value / 100;
    circles.forEach((circle) => {
        // change circle with new opacity
        circle.setStyle({
            opacity,
            fillOpacity: opacity,
        });
    });
}

getCurrentLocation();
