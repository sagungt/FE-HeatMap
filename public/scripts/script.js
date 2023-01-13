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
    meter = 1 / (((2 * pi) / 360) * earth) / 1000,
    circles = [],
    yOffset = 5,
    xOffset = 10,
    coords = [],
    propertyMarkers = [],
    property = false;

/* Ordinal Data */
const ordinal = [
    {
        index: 1,
        l: 0,
        g: 700000000,
        opacity: 0.3,
        color: "#f3f2e3",
    },
    {
        index: 2,
        l: 700000000,
        g: 1000000000,
        opacity: 0.3,
        color: "#d6e6e3",
    },
    {
        index: 3,
        l: 1000000000,
        g: 1700000000,
        opacity: 0.4,
        color: "#b6eeab",
    },
    {
        index: 4,
        l: 1700000000,
        g: 2400000000,
        opacity: 0.5,
        color: "#9ab3f5",
    },
    {
        index: 5,
        l: 2400000000,
        g: 3500000000,
        opacity: 0.6,
        color: "#c90202",
    },
    {
        index: 6,
        l: 3500000000,
        g: 10000000000,
        opacity: 0.7,
        color: "#380101",
    },
];

/* API */
const BASE_URL = "https://api-heatmap-farcapital.fly.dev";
const AREA_ENDPOINT = `${BASE_URL}/api/area`;
const SEARCH_ENDPOINT = `${BASE_URL}/api/search`;
let isLoading = false;

/**
 * Show error message indicator
 * @param {boolean} toggle - Error state
 * @returns {void}
 */
function showError(toggle = false) {
    const getErrorId = document.getElementById("error");
    if (!toggle) {
        getErrorId.classList.add("hidden");
        getErrorId.classList.remove("flex");
    } else {
        getErrorId.classList.add("flex");
        getErrorId.classList.remove("hidden");
    }
}

/**
 * Show loading indicator
 * @param {boolean} toggle - Loading state
 * @returns {void}
 */
function loading(toggle = false) {
    const getLoading = document.getElementById("loading");
    if (!toggle) {
        getLoading.classList.add("hidden");
        getLoading.classList.remove("flex");
    } else {
        getLoading.classList.add("flex");
        getLoading.classList.remove("hidden");
    }
}

// Function untuk toggle legend
function animationLegend() {
    const btnLegend = document.querySelector(".btn-legend");
    const btnIcon = document.querySelector(".btn-legend i");
    const informationLegend = document.querySelector(".legend");
    btnLegend.classList.toggle("btn-legend-aktif");
    btnLegend.classList.toggle("btn-legend-nonaktif");
    btnIcon.classList.toggle("rotate-90");
    btnIcon.classList.toggle("rotate-0");
    informationLegend.classList.toggle("information-legend-aktif");
    informationLegend.classList.toggle("information-legend-nonaktif");
}

/**
 * Show propertiy markers
 * @returns {void}
 */
async function showProperty() {
    loading(true);
    property = !property;

    if (property == true) {
        await fetchPropertyApi(`${BASE_URL}/api/allheatmap`);
    } else {
        for (i = 0; i < propertyMarkers.length; i++) {
            propertyMarkers[i].remove();
        }

        propertyMarkers = [];
    }
    loading(false);
}

async function fetchPropertyApi(link) {
    let object = await fetch(link);
    let value = await object.json();

    if (!value.status) {
        loading(false);
        return showError(true);
    }

    value.data.forEach((data) => {
        const propertyMarker = new L.Marker([data.latitude, data.longitude])
            .bindPopup("Price : " + data.price)
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
    })
        .then(async (res) => await res.json())
        .catch((err) => {
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
                        modal(center.latitude, center.longitude, coords);
                    })
                    .on("mouseover", function () {
                        coords.forEach((coord) => {
                            const areaMarker = new L.Marker([
                                coord.latitude,
                                coord.longitude,
                            ]);
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
function modal(latitude, longitude, coords) {
    if (svgBar) svgBar.selectAll("*").remove();
    if (svgLine) svgLine.selectAll("*").remove();

    modalElement.classList.replace("hidden", "flex");
    const longitudeElement = document.getElementById("long");
    const latitudeElement = document.getElementById("lat");
    const coordsElement = document.getElementById("coords");
    const closeButton = document.getElementById("close");

    closeButton.addEventListener("click", function () {
        modalElement.classList.replace("flex", "hidden");
    });

    let dataset = [];

    let htmlString = "";
    let no = 1;
    coords.forEach(({ price, latitude, longitude }, i) => {
        htmlString += `
            <tr class="bg-white border-b">
                <th scope="row" class="px-2 py-4">
                    ${no++}
                </th>
                <td class="px-6 py-4">
                ${latitude}
                </td>
                <td class="px-6 py-4">
                    ${longitude}
                </td>
                <td class="px-6 py-4">
                    Rp. ${price}
                </td>
            </tr>
            `;

        dataset.push([i + 1, price]);
    });
    (svgLine = d3.select("#Line")),
        (margin = 200),
        (width = svgLine.attr("width") - margin),
        (height = svgLine.attr("height") - margin);

    (svgBar = d3.select("#Bar")),
        (margin = 200),
        (width = svgBar.attr("width") - margin),
        (height = svgBar.attr("height") - margin);

    var xScaleLine = d3
            .scaleLinear()
            .domain([1, coords.length])
            .range([0, width]),
        yScaleLine = d3
            .scaleLinear()
            .domain([0, Math.max(...coords.map((v) => v.price))])
            .range([height, 0]);

    var gLine = svgLine
        .append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");

    // Title
    svgLine
        .append("text")
        .attr("x", width / 2 + 100)
        .attr("y", 50)
        .attr("text-anchor", "middle")
        .style("font-family", "Helvetica")
        .style("font-size", 20)
        .text("Property");

    // X label
    svgLine
        .append("text")
        .attr("x", width / 2 + 100)
        .attr("y", height - 15 + 150)
        .attr("text-anchor", "middle")
        .style("font-family", "Helvetica")
        .style("font-size", 12)
        .text("Count");

    // Y label
    svgLine
        .append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(10," + height + ")rotate(-90)")
        .style("font-family", "Helvetica")
        .style("font-size", 12)
        .text("Price");

    gLine
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScaleLine));

    gLine.append("g").call(d3.axisLeft(yScaleLine));

    svgLine
        .append("g")
        .selectAll("dot")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return xScaleLine(d[0]);
        })
        .attr("cy", function (d) {
            return yScaleLine(d[1]);
        })
        .attr("r", 3)
        .attr("transform", "translate(" + 100 + "," + 100 + ")")
        .style("fill", "#CC0000");

    var line = d3
        .line()
        .x(function (d) {
            return xScaleLine(d[0]);
        })
        .y(function (d) {
            return yScaleLine(d[1]);
        })
        .curve(d3.curveMonotoneX);

    svgLine
        .append("path")
        .datum(dataset)
        .attr("class", "line")
        .attr("transform", "translate(" + 100 + "," + 100 + ")")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "#CC0000")
        .style("stroke-width", "2");

    // contoh bar
    var xScaleBar = d3.scaleBand().range([0, width]).padding(0.5),
        yScaleBar = d3.scaleLinear().range([height, 0]);

    var gBar = svgBar
        .append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");

    xScaleBar.domain(dataset.map((v) => v[1]));
    yScaleBar.domain([0, Math.max(...coords.map((v) => v.price))]);
    console.log(height);

    gBar.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(
            d3.axisBottom(xScaleBar).tickFormat(function (d, i) {
                return i + 1;
            })
        );

    gBar.append("g").call(
        d3
            .axisLeft(yScaleBar)
            .tickFormat(function (d) {
                return "Rp. " + d;
            })
            .ticks(4)
    );

    gBar.selectAll(".bar")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            console.log("xScaleBar : " + d);
            return xScaleBar(d[1]);
        })
        .attr("y", function (d) {
            console.log("yScaleBar : " + d[1]);
            return yScaleBar(d[1]);
        })
        .attr("width", xScaleBar.bandwidth())
        .attr("height", function (d) {
            console.log("bandwidth : " + d);
            return height - yScaleBar(d[1]);
        });

    coordsElement.innerHTML = htmlString;
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
        event.target == modalElement
    ) {
        modalElement.classList.replace("flex", "hidden");
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
    property = false;
    propertyMarkers = [];
    init();
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

getCurrentLocation();
