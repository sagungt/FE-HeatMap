<div class="absolute z-[999999] top-5 left-[50%] -translate-x-[50%] flex justify-center items-center w-[316px] md:top-5 md:right-5 md:translate-x-0 md:w-auto md:justify-end">
    <div x-data="search">
        <div x-data="{ location: '', resultLocations: resultLocations, focus: false }" class="bg-white rounded-lg w-[316px]">
            <div class="flex items-center w-full py-1 pl-4 pr-2 bg-white rounded-lg shadow-md">

                <div class="w-[6%] h-[40px] flex justify-start items-center">
                    <i class="fa-solid fa-magnifying-glass"></i>
                </div>

                <input type="text" x-model="location" x-on:input="findLocation"
                    class="rounded-xl h-[40px] w-[84%] border-none text-sm focus:ring-transparent" x-on:click="focus = true"
                    placeholder="Search location ..." x-ref="inputForm" x-on:blur="setTimeout(() => { focus = false }, 300)">

            </div>
            <div class="location max-h-[350px] md:max-h-[450px] overflow-y-scroll">
                <template x-if="loading">
                    <div class="py-3 px-4 flex items-center overflow-x-hidden  max-w-[316px] cursor-pointer hover:bg-slate-100">
                        <p class="ml-[11px] text-sm w-full overflow-y-hidden italic">
                            Loading...
                        </p>
                    </div>
                </template>

                <template x-if="location.length > 0 && focus === true">
                    <template x-for="value in resultLocations">
                        <div class="py-3 px-4 flex items-center overflow-x-hidden  max-w-[316px] cursor-pointer hover:bg-slate-100" x-on:click="goToLocation(value.lat, value.lon); focus = false">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                            <p x-text="value.display_name"
                                class="nameLocation ml-[11px] text-sm w-full overflow-y-hidden"></p>
                        </div>
                    </template>
                </template>
            </div>
        </div>
    </div>
</div>