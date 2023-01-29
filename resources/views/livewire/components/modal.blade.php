<div id="detail-property"
    class="z-[99999999] absolute inset-0 items-center justify-center hidden bg-gray-700 bg-opacity-50 backdrop-blur-sm">
    <div id="detail-property-info"
        class="mx-3 px-7 py-7 overflow-x-auto bg-white rounded-lg relative md:w-[1000px] md:px-6" x-data='modal'>
        <div id="close" class="absolute top-7 right-7">
            <button><i class="fa-solid fa-xmark text-2xl text-slate-400 hover:text-slate-800"></i></button>
        </div>

        <div class="mb-1">
            <p class="text-slate-800 text-2xl font-bold md:text-2xl">Detail Area</p>
        </div>

        <div class="h-[65vh] custom-scrollbar overflow-y-scroll pt-2">
            <div class="flex-wrap items-center text-black text-[10px] mb-3 sm:flex md:text-sm">
                <p class="mr-1">Address : </p>
                <p id="address"></p>
            </div>

            <div class="flex gap-4 justify-center">
                <button x-on:click='barChart = true, lineChart = false, tagChart = false'
                    x-bind:class="barChart ? 'border-red-600 font-bold' : 'border-transparent'"
                    class="border-b-2 px-2 py-2 duration-200">Graph</button>
                <button x-on:click='barChart = false, lineChart = true, tagChart = false'
                    x-bind:class="lineChart ? 'border-red-600 font-bold' : 'border-transparent'"
                    class="border-b-2 px-2 py-2 duration-200">Line</button>
            </div>

            <div class="w-full sm:my-5 mb-5 mt-16  rotate-90 md:rotate-0">
                <svg width="900" height="350" id="Line" x-show='lineChart'></svg>
                <svg width="900" height="350" id="Bar" x-show='barChart'></svg>
            </div>
            <p class="mb-6 text-center text-black md:text-xl text-xl md:mt-0 mt-[500px]">List Property</p>
            <div class="relative md:px-5 lg:px-10">
                <table class="w-full text-sm text-left text-gray-500 rounded-lg overflow-hidden">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-300 ">
                        <tr class="flex flex-wrap">
                            <th scope="col" class="w-[20%] md:w-[6%] text-center py-3">
                                No
                            </th>

                            <th scope="col" class="w-[15%] text-center py-3 hidden md:flex md:justify-center">
                                Type
                            </th>

                            <th scope="col" class="w-[15%] text-center py-3 hidden md:flex md:justify-center ">
                                Area
                            </th>

                            <th scope="col"
                                class="w-[80%] md:w-[calc(64%/2)] text-center py-3  md:flex md:justify-center">
                                Price
                            </th>
                            <th scope="col"
                                class="w-[80%] md:w-[calc(64%/2)] text-center py-3 hidden md:flex md:justify-center">
                                Total
                            </th>
                        </tr>
                    </thead>

                    <tbody id="coords">
                    </tbody>
                </table>
            </div>
            <p class="mb-6 text-center my-5 text-black md:text-xl text-xl">List Popular Places</p>
            <div class="relative md:px-5 lg:px-10">
                <table class="w-full text-sm text-left text-gray-500 rounded-lg overflow-hidden">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-300 ">
                        <tr class="flex flex-wrap">
                            <th scope="col" class="w-[20%] md:w-[6%] hidden md:flex justify-center text-center py-3">
                                No
                            </th>

                            <th scope="col"
                                class="md:w-[calc(94%/2)] w-[100%] text-center py-3 md:flex md:justify-center">
                                Name
                            </th>

                            <th scope="col"
                                class="w-[calc(94%/2)] text-center py-3 hidden md:flex md:justify-center ">
                                Distance
                            </th>
                        </tr>
                    </thead>

                    <tbody id="popular">
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
