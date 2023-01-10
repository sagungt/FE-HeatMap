var map, tile, currentLatitude, currentLongitude, response, svg;
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
    map = L.map("map", { zoomControl: false }).setView(
        [currentLatitude, currentLongitude],
        13
    );

    tile = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    map.on("click", addMarker);
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
            // const rand = Math.random();
            // const c1 = L.circle(
            //   [
            //     latitudePlusMeters(currentLatitude, i * diff),
            //     longitudePlusMeters(currentLatitude, currentLongitude, (j * diff) + (i % 2 === 0 ? 775 : 0)),
            //   ], {
            //     radius: 1000 - 8,
            //   }
            // )
            //   .addTo(map)
            //   .bindTooltip(`${Number(rand*100000000).toFixed(0)}`, {
            //     permanent: true,
            //     direction: 'center'
            //   });

            // c1
            //   .setStyle({
            //     color:'red',
            //     opacity: rand,
            //     stroke: false,
            //     fill: true,
            //     fillColor: 'red',
            //     fillOpacity: rand
            //   });
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
            // const rand = Math.random();
            // const c1 = L.circle(
            //   [
            //     latitudePlusMeters(currentLatitude, -(i * diff)),
            //     longitudePlusMeters(currentLatitude, currentLongitude, (j * diff) + (i % 2 === 0 ? 775 : 0)),
            //   ], {
            //     radius: 1000 - 8,
            //   }
            // )
            //   .addTo(map)
            //   .bindTooltip(`${Number(rand*100000000).toFixed(0)}`, {
            //     permanent: true,
            //     direction: 'center'
            //   });

            // c1
            //   .setStyle({
            //     color:'red',
            //     opacity: rand,
            //     stroke: false,
            //     fill: true,
            //     fillColor: 'red',
            //     fillOpacity: rand
            //   });
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
            // const rand = Math.random();
            // const c1 = L.circle(
            //   [
            //     latitudePlusMeters(currentLatitude, i * diff),
            //     longitudePlusMeters(currentLatitude, currentLongitude, -((j * diff) - (i % 2 === 0 ? 775 : 0))),
            //   ], {
            //     radius: 1000 - 8,
            //   }
            // )
            //   .addTo(map)
            //   .bindTooltip(`${Number(rand*100000000).toFixed(0)}`, {
            //     permanent: true,
            //     direction: 'center'
            //   });

            // c1.setStyle({
            //   color:'red',
            //   opacity: rand,
            //   stroke: false,
            //   fill: true,
            //   fillColor: 'red',
            //   fillOpacity: rand
            // });
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
            // const rand = Math.random();
            // const c1 = L.circle(
            //   [
            //     latitudePlusMeters(currentLatitude, -(i * diff)),
            //     longitudePlusMeters(currentLatitude, currentLongitude, -((j * diff) - (i % 2 === 0 ? 775 : 0))),
            //   ], {
            //     radius: 1000 - 8,
            //   }
            // )
            //   .addTo(map)
            //   .bindTooltip(`${Number(rand*100000000).toFixed(0)}`, {
            //     permanent: true,
            //     direction: 'center'
            //   });

            // c1.setStyle({
            //   color:'red',
            //   opacity: rand,
            //   stroke: false,
            //   fill: true,
            //   fillColor: 'red',
            //   fillOpacity: rand
            // });
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
        navigator.geolocation.getCurrentPosition((position) => {
            currentLatitude = position.coords.latitude;
            currentLongitude = position.coords.longitude;
            init();
        });
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
    console.log(e.latlng.lat);
    newMarker.addTo(map);
    markers.push(newMarker);
    // if (
    //     checkPointInCircle(
    //         currentLatitude,
    //         currentLongitude,
    //         e.latlng.lat,
    //         e.latlng.lng,
    //         1000
    //     ) == true
    // ) {
    //     modal(e.latlng.lat, e.latlng.lng);
    // }

    // alert(
    //     checkPointInCircle(
    //         currentLatitude,
    //         currentLongitude,
    //         e.latlng.lat,
    //         e.latlng.lng,
    //         1000
    //     )
    // );
}

/**
 * Open modal detail handler
 * @param {number} e - Event
 * @param {number}
 * @return {void}
 */
function modal(latitude, longitude, coords) {
    if (svg) svg.selectAll("*").remove();
    element.classList.replace("hidden", "flex");
    const longitudeElement = document.getElementById("long");
    const latitudeElement = document.getElementById("lat");
    const coordsElement = document.getElementById("coords");

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

        dataset.push([i, price]);
    });
    console.log(dataset);
    (svg = d3.select("svg")),
        (margin = 200),
        (width = svg.attr("width") - margin), //300
        (height = svg.attr("height") - margin); //200

    // Step 4
    var xScale = d3.scaleLinear().domain([0, coords.length]).range([0, width]),
        yScale = d3
            .scaleLinear()
            .domain([0, Math.max(...coords.map((v) => v.price))])
            .range([height, 0]);

    var g = svg
        .append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");

    // Step 5
    // Title
    svg.append("text")
        .attr("x", width / 2 + 100)
        .attr("y", 100)
        .attr("text-anchor", "middle")
        .style("font-family", "Helvetica")
        .style("font-size", 20)
        .text("Line Chart");

    // X label
    svg.append("text")
        .attr("x", width / 2 + 100)
        .attr("y", height - 15 + 150)
        .attr("text-anchor", "middle")
        .style("font-family", "Helvetica")
        .style("font-size", 12)
        .text("Independant");

    // Y label
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(60," + height + ")rotate(-90)")
        .style("font-family", "Helvetica")
        .style("font-size", 12)
        .text("Dependant");

    // Step 6
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

    g.append("g").call(d3.axisLeft(yScale));

    // Step 7
    svg.append("g")
        .selectAll("dot")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return xScale(d[0]);
        })
        .attr("cy", function (d) {
            return yScale(d[1]);
        })
        .attr("r", 3)
        .attr("transform", "translate(" + 100 + "," + 100 + ")")
        .style("fill", "#CC0000");

    // Step 8
    var line = d3
        .line()
        .x(function (d) {
            return xScale(d[0]);
        })
        .y(function (d) {
            return yScale(d[1]);
        })
        .curve(d3.curveMonotoneX);

    svg.append("path")
        .datum(dataset)
        .attr("class", "line")
        .attr("transform", "translate(" + 100 + "," + 100 + ")")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "#CC0000")
        .style("stroke-width", "2");

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
        event.target == element
    ) {
        element.classList.replace("flex", "hidden");
    }
});

getCurrentLocation();
