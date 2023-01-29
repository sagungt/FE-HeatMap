/**
 * Open modal detail handler
 * @param {number} e - Event
 * @param {number}
 * @return {void}
 */
async function modal(latitude, longitude, coords) {
    // remove svg if exist
    if (svgBar) svgBar.selectAll("*").remove();
    if (svgLine) svgLine.selectAll("*").remove();

    loading(true);

    // initialize number formater object
    const moneyFormatter = new Intl.NumberFormat();

    // replace class
    modalElement.classList.replace("hidden", "flex");

    // get id
    const addressElement = document.getElementById("address");
    const coordsElement = document.getElementById("coords");
    const closeButton = document.getElementById("close");
    const popularElement = document.getElementById("popular");

    addressElement.innerHTML = "";

    // fetch address to api
    const address = await fetch(
        `${ADDRESS_ENDPOINT}?lat=${latitude}&lon=${longitude}&radius=5000`
    ).then(async (response) => await response.json());

    // replace class after click button
    closeButton.addEventListener("click", function () {
        modalElement.classList.replace("flex", "hidden");
    });

    let dataset = [];

    let htmlStringProperty = "";
    let htmlStringPopular = "";
    coords.forEach(({ price, type, area }, i) => {
        // create rows table
        htmlStringProperty += `
            <tr class="bg-white border-b text-center">
                <td scope="col" class="px-6 py-4">
                    ${i + 1}
                </td>
                <td scope="col" class="px-6 py-4">
                    ${type}
                </td>
                <td scope="col" class="px-6 py-4">
                    ${area} m²
                </td>
                <td scope="col" class="px-6 py-4">
                    Rp. ${moneyFormatter.format(Math.round(price))}
                </td>
                <td scope="col" class="px-6 py-4">
                    Rp. ${moneyFormatter.format(Math.round(price * area))}
                </td>
            </tr>
            `;

        // push array
        dataset.push([i + 1, price]);
    });
    address.data.popular.results.forEach(
        ({ name, distance, categories }, i) => {
            htmlStringPopular += `
            <tr class="bg-white border-b text-center">
                <td scope="col" class="px-6 py-4">
                    ${i + 1}
                </td>
                <td scope="col" class="px-6 py-4">
                    ${name}
                </td>
                <td scope="col" class="px-6 py-4">
                ~ ${distance / 1000} Km
                </td>
                <td scope="col" class="px-6 py-4">
                    ${category(categories).join("")}
                </td>
             </tr>
            `;
        }
    );

    // create width and height svg
    (svgLine = d3.select("#Line")),
        (margin = 200),
        (width = svgLine.attr("width") - margin),
        (height = svgLine.attr("height") - margin);

    (svgBar = d3.select("#Bar")),
        (margin = 200),
        (width = svgBar.attr("width") - margin),
        (height = svgBar.attr("height") - margin);

    // initialize scale object for x and y value
    const xScaleLine = d3
            .scaleLinear()
            .domain([1, coords.length])
            .range([0, width]),
        yScaleLine = d3
            .scaleLinear()
            .domain([0, Math.max(...coords.map((v) => v.price))])
            .range([height, 0]);

    // initialize group svg element for line chart
    const gLine = svgLine
        .append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");

    // Title
    svgLine
        .append("text")
        .attr("x", width / 2 + 100)
        .attr("y", 50)
        .attr("text-anchor", "middle")
        .style("font-family", "Nunito")
        .style("font-size", 20)
        .text("Property");

    // X label
    svgLine
        .append("text")
        .attr("x", width / 2 + 100)
        .attr("y", height - 15 + 150)
        .attr("text-anchor", "middle")
        .style("font-family", "Nunito")
        .style("font-size", 12)
        .text("Count");

    // Y label
    svgLine
        .append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(10," + height + ")rotate(-90)")
        .style("font-family", "Nunito")
        .style("font-size", 12)
        .text("Price");

    // append x axis into group
    gLine
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScaleLine));

    // append y axis into group
    gLine.append("g").call(d3.axisLeft(yScaleLine));

    // append dot into svg line
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

    // initialize line into svg line
    const line = d3
        .line()
        .x(function (d) {
            return xScaleLine(d[0]);
        })
        .y(function (d) {
            return yScaleLine(d[1]);
        })
        .curve(d3.curveMonotoneX);

    // append line into svg line
    svgLine
        .append("path")
        .datum(dataset)
        .attr("class", "line")
        .attr("transform", "translate(" + 100 + "," + 100 + ")")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "#CC0000")
        .style("stroke-width", "2");

    // initialize scale object for x and y value
    const xScaleBar = d3.scaleBand().range([0, width]).padding(0.5),
        yScaleBar = d3.scaleLinear().range([height, 0]);

    // initialize group svg element for bar chart
    const gBar = svgBar
        .append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");

    // set domain of scale x and y value
    xScaleBar.domain(dataset.map((v) => v[1]));
    yScaleBar.domain([0, Math.max(...coords.map((v) => v.price))]);

    // append x axis into group
    gBar.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(
            d3.axisBottom(xScaleBar).tickFormat(function (d, i) {
                return i + 1;
            })
        );

    // append y axix into group
    gBar.append("g").call(
        d3
            .axisLeft(yScaleBar)
            .tickFormat(function (d) {
                return "Rp. " + moneyFormatter.format(d);
            })
            .ticks(4)
    );

    // append bar into svg bar
    gBar.selectAll(".bar")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return xScaleBar(d[1]);
        })
        .attr("y", function (d) {
            return yScaleBar(d[1]);
        })
        .attr("width", xScaleBar.bandwidth())
        .attr("height", function (d) {
            return height - yScaleBar(d[1]);
        });

    // close loading
    loading(false);

    // replace html with value js
    coordsElement.innerHTML = htmlStringProperty;
    popularElement.innerHTML = htmlStringPopular;
    addressElement.innerHTML = address.data.display_name;
}

function category(categories) {
    if (categories.length != 0) {
        let name = [];
        for (let index = 0; index < categories.length; index++) {
            name.push([
                ` <span class="bg-blue-400 rounded-lg py-1 px-2 text-white">${categories[index].name}</span>`,
            ]);
        }
        return name;
    } else {
        return ["-"];
    }
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
