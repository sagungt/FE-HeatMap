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
            <tr x-data="{isDetail: false}" x-on:click="isDetail = !isDetail" class="relative cursor-pointer bg-white border-b flex flex-wrap text-gray-500">
                <td scope="col" class="text-center w-[20%] md:w-[6%] h-[60px] flex justify-center items-center">
                    ${no++}
                </td>
                <td scope="col" class="hidden text-center w-[calc(94%/3)] h-[60px] md:flex justify-center items-center">
                    ${type}
                </td>
                <td scope="col" class="hidden text-center w-[calc(94%/3)] h-[60px]  md:flex justify-center items-center">
                    ${area} m²
                </td>
                <td scope="col" class="hidden text-center w-[calc(94%/3)] h-[60px]  md:flex justify-center items-center">
                    Rp. ${moneyFormatter.format(Math.round(price * area))}
                </td>
                <td scope="col" class="text-center relative w-[80%] md:w-[calc(94%/3)] h-[60px] flex gap-3 items-center justify-center">
                    <p>Rp. ${moneyFormatter.format(price)}</p>
                    <div x-bind:class="isDetail ? '-rotate-90' : 'rotate-90'" class="btn-detail cursor-pointer w-6 h-6 right-5 top-[50%] -translate-y-[50%] border absolute border-slate-500 flex justify-center items-center rounded-full duration-500">
                        <i class="fa-solid fa-chevron-right"></i>
                    </div>
                </td>
                <td x-bind:class="isDetail ? 'h-auto' : 'h-0'" scope="col" class="detail-element w-full p-0 inline-block transition-[height] duration-300 border-l border-red-600">
                    <h3 class="text-gray-700 font-bold mt-3 ml-3 duration-300">Price per meter: <span class="font-normal text-gray-500 text-sm">Rp.300.000.000.</span></h3>
                    <h3 class="text-gray-700 font-bold mt-3 ml-3 duration-300">Total price : <span class="font-normal text-gray-500 text-sm">Rp.1.000.000.000</span></h3>
                    <h3 class="text-gray-700 font-bold mt-3 ml-3 duration-300 md:hidden">Type : <span class="font-normal text-gray-500 text-sm">Rumah</span></h3>
                    <h3 class="text-gray-700 font-bold mt-3 ml-3 duration-300 md:hidden">Wide : <span class="font-normal text-gray-500 text-sm">23m</span></h3>
                    <h3 class="text-gray-700 font-bold mt-3 ml-3 duration-300">Description :</h3>
                    <p class="w-[90%] ml-3 mb-3 mt-2 duration-300">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptate, sapiente ipsum maxime ducimus, accusamus quos consequuntur natus obcaecati necessitatibus, deserunt tenetur fuga? Voluptates quidem illo eveniet unde iusto possimus ex facilis beatae laudantium voluptatem quae reprehenderit libero.</p>
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
        yScaleBar = d3.scaleLinear().range([0, height]);

    const color = d3
        .scaleLinear()
        .domain([0, coords.length])
        .range(["rgb(107,114,128)", "rgb(239, 68, 68)"]);

    // initialize group svg element for bar chart
    const gBar = svgBar
        .append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");

    // set domain of scale x and y value
    xScaleBar.domain(dataset.map((v) => v[1]));
    yScaleBar.domain([Math.max(...coords.map((v) => v.price)), 0]);

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

    const rect = gBar
        .selectAll(".bar")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return xScaleBar(d[1]);
        })
        .attr("y", height)
        .attr("fill", function (d, i) {
            console.log(coords.length - 1);
            let sortPrice = [];
            for (let j = 0; j < coords.length; j++) {
                sortPrice.push(coords[j].price);
            }

            sortPrice = sortPrice.sort(function (a, b) {
                return a - b;
            });

            for (let j = 0; j < coords.length; j++) {
                if (d[1] == sortPrice[j]) {
                    return color(j + 1);
                }
            }
        })
        .attr("width", xScaleBar.bandwidth())
        .attr("height", 0);

    rect.transition()
        .attr("height", function (d) {
            return height - yScaleBar(d[1]);
        })
        .attr("y", function (d) {
            return yScaleBar(d[1]);
        })
        .duration(500)
        .delay(function (d, i) {
            return i * 50;
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
