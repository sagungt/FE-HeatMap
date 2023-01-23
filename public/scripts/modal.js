/**
 * Open modal detail handler
 * @param {number} e - Event
 * @param {number}
 * @return {void}
 */
async function modal(latitude, longitude, coords) {
    if (svgBar) svgBar.selectAll("*").remove();
    if (svgLine) svgLine.selectAll("*").remove();

    loading(true);

    const moneyFormatter = new Intl.NumberFormat();

    modalElement.classList.replace("hidden", "flex");
    const addressElement = document.getElementById("address");
    const coordsElement = document.getElementById("coords");
    const closeButton = document.getElementById("close");

    addressElement.innerHTML = '';

    const address = await fetch(
        `${ADDRESS_ENDPOINT}?lat=${latitude}&lon=${longitude}`
    ).then(async (response) => await response.json());

    closeButton.addEventListener("click", function () {
        modalElement.classList.replace("flex", "hidden");
    });

    let dataset = [];

    let htmlString = "";
    let no = 1;
    coords.forEach(({ price, latitude, longitude }, i) => {
        // htmlString += `
        //     <tr class="bg-white border-b">
        //         <th scope="row" class="px-2 py-4">
        //             ${no++}
        //         </th>
        //         <td class="px-6 py-4">
        //         ${latitude}
        //         </td>
        //         <td class="px-6 py-4">
        //             ${longitude}
        //         </td>
        //         <td class="px-6 py-4">
        //             Rp. ${price}
        //         </td>
        //     </tr>
        //     `;
        htmlString += `
            <tr class="bg-white border-b flex justify-between">
                <th scope="col" class="px-8 py-4">
                    ${no++}
                </th>
                <th scope="col" class="px-8 py-4">
                    Rp. ${moneyFormatter.format(price)}
                </th>
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

    const xScaleLine = d3
            .scaleLinear()
            .domain([1, coords.length])
            .range([0, width]),
        yScaleLine = d3
            .scaleLinear()
            .domain([0, Math.max(...coords.map((v) => v.price))])
            .range([height, 0]);

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

    const line = d3
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
    const xScaleBar = d3.scaleBand().range([0, width]).padding(0.5),
        yScaleBar = d3.scaleLinear().range([height, 0]);

    const gBar = svgBar
        .append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");

    xScaleBar.domain(dataset.map((v) => v[1]));
    yScaleBar.domain([0, Math.max(...coords.map((v) => v.price))]);

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
                return "Rp. " + moneyFormatter.format(d);
            })
            .ticks(4)
    );

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

    loading(false);
    coordsElement.innerHTML = htmlString;
    addressElement.innerHTML = address.data.display_name;
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
