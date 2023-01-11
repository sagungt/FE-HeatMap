<div id="detail-property"
    class="z-[99999] absolute inset-0 items-center justify-center hidden bg-gray-700 bg-opacity-50 backdrop-blur-sm">
    <div id="detail-property-info" class="lg:min-w-[800px] md:px-6 px-3 py-3  bg-white rounded-lg">
        <div class="mt-4">
            <p class="mb-6 text-center text-black md:text-2xl text-xl font-bold">Detail Property</p>
        </div>
        <div class="h-96 overflow-y-scroll">
            <div class="flex items-center text-black md:text-sm text-[10px]">
                <p class="mr-1">Coordinate : </p>
                <p class="mr-2"><span id="long"></span>, </p>
                <p id="lat"></p>
            </div>
            <div class="w-full my-5">
                <div class="flex items-center gap-3">
                    <button
                        class="bg-blue-400 px-3 py-2 rounded-md hover:bg-blue-700 hover:text-white duration-200">Line</button>
                    <button
                        class="bg-blue-400 px-3 py-2 rounded-md hover:bg-blue-700 hover:text-white duration-200">Bar</button>
                </div>
                <svg width="900" height="350" id="svg"></svg>
            </div>
            <p class="mb-6 text-center text-black md:text-xl text-xl">List Property</p>
            <div class="relative overflow-x-auto">
                <table class="w-full text-sm text-left text-gray-500">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 ">
                        <tr>
                            <th scope="col" class="px-2 py-3">
                                No
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Latitude
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Longitude
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Price
                            </th>
                        </tr>
                    </thead>
                    <tbody id="coords">
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
