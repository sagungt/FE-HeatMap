<div id="detail-property"
    class="z-[99999999] absolute inset-0 items-center justify-center hidden bg-gray-700 bg-opacity-50 backdrop-blur-sm">
    <div id="detail-property-info"
        class="md:w-[1000px] mx-3 md:px-6 px-3 py-3 overflow-x-auto bg-white rounded-lg relative" x-data='modal'>
        <div id="close" class="absolute top-5 right-5">
            <button><i class="fa-solid fa-xmark text-2xl"></i></button>
        </div>

        <div class="mt-4">
            <p class="mb-6 text-center text-black md:text-2xl text-xl font-bold">Detail Area</p>
        </div>

        <div class="h-[65vh] overflow-y-scroll pt-2">
            <div class="gap-y-2 sm:flex flex-wrap items-center justify-between md:mb-0 sm:mb-[160px]">
                <div class="sm:flex flex-wrap items-center text-black md:text-sm text-[10px]">
                    <p class="mr-1">Address : </p>
                    <p id="address"></p>
                </div>

                <div class="flex-col relative">
                    <button
                        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center mr-5 sm:my-0 my-3"
                        type="button" x-on:click='tagChart = !tagChart'>Charts
                        <svg class="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7">
                            </path>
                        </svg>
                    </button>

                    <!-- Dropdown menu -->
                    <div class="z-10 bg-white divide-y divide-gray-100 rounded shadow w-24 absolute" x-show='tagChart'
                        @click.away='tagChart = false'>
                        <ul class="py-1 text-sm text-gray-700">

                            <li>
                                <button class="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                                    x-on:click='barChart = true, lineChart = false, tagChart = false'>Bar</button>
                            </li>

                            <li>
                                <button class="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                                    x-on:click='barChart = false, lineChart = true, tagChart = false'>Line</button>
                            </li>

                        </ul>
                    </div>
                </div>
            </div>

            <div class="w-full sm:my-5 mb-5 mt-16  rotate-90 md:rotate-0">
                <svg width="900" height="350" id="Line" x-show='lineChart'></svg>
                <svg width="900" height="350" id="Bar" x-show='barChart'></svg>
            </div>
            <p class="mb-6 text-center text-black md:text-xl text-xl md:mt-0 mt-[500px]">List Property</p>
            <div class="relative overflow-x-auto">
                <table class="w-full text-sm text-left text-gray-500">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 ">
                        <tr class="text-center">
                            <th scope="col" class="px-6 py-3">
                                No
                            </th>

                            <th scope="col" class="px-6 py-3">
                                Type
                            </th>

                            <th scope="col" class="px-6 py-3">
                                M²
                            </th>

                            <th scope="col" class="px-6 py-3">
                                Price/M²
                            </th>

                            <th scope="col" class="px-6 py-3">
                                Total
                            </th>
                        </tr>
                    </thead>

                    <tbody id="coords">
                    </tbody>
                </table>
            </div>
            <p class="mb-6 text-center my-5 text-black md:text-xl text-xl">List Popular Places</p>
            <table class="w-full text-sm text-left text-gray-500">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 ">
                    <tr class="text-center">
                        <th scope="col" class="px-6 py-3">
                            No
                        </th>

                        <th scope="col" class="px-6 py-3">
                            Name
                        </th>

                        <th scope="col" class="px-6 py-3">
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
