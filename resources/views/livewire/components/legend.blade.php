<!-- Legend Information -->
<div x-data="dataOrdinal" class="legend absolute bottom-10 left-5 z-[9999] w-[230px] h-[410px] sm:w-[380px] sm:h-[160px] md:w-[350px] md:h-[160px] lg:w-[300px] lg:h-[384px] duration-700 bg-green-500">
    
    <div class="information-legend bottom-0 gap-4 flex flex-col justify-center rounded-lg duration-700 md:duration-500 bg-white absolute w-full py-4 lg:py-5 z-[999] lg:px-5 lg:gap-4 shadow-lg">
        <button x-on:click="animationLegend()" class="btn-legend btn-legend-aktif shadow-lg flex justify-center items-center duration-700 md:duration-500 absolute z-[9999] w-[40px] h-[40px] rounded-[14px] bg-[#ffffff] sm:w-[40px] sm:duration-[0.8s] sm:h-[40px] lg:w-[50px] lg:h-[50px]">
            <i class="fa-solid fa-chevron-right rotate-90 text-slate-600 text-lg duration-500"></i>
        </button>
        <div class="flex flex-col sm:flex-row sm:flex-wrap gap-2 mx-5 lg:mx-0">
            <div class="flex flex-col">
                <label class="block mb-2 text-sm font-medium text-gray-900">Filter</label>
                <div class="py-2">
                    <template x-if="filter.length === 0">
                        <p class="text-xs">None</p>
                    </template>
                    <div class="flex flex-row gap-x-2" id="colors">
                    </div>
                </div>
            </div>
            <template x-for="value in ordinal">
                <div
                    x-on:click="setFilter(showHeatmap(value.index))"
                    x-bind:class="'bg-range-' + value.index + (filter.includes(value.index) ? ' border-black font-extrabold' : ' border-transparent')"
                    {{-- x-on:mouseover="setFilter(showHeatmap(value.index))" --}}
                    {{-- x-on:mouseout="setFilter(showHeatmap())" --}}
                    class="flex items-center gap-4 transition cursor-pointer px-4 py-1 justify-center rounded-lg hover:scale-[102%] w-full sm:w-[calc(50%-8px)] lg:w-full duration-300 lg:py-2 border-2 shadow-sm">
                    {{-- <div x-bind:class="'bg-range-' + value.index" class="w-[40px] h-[20px] border border-slate-700 lg:w-[50px] lg:h-[30px]"></div> --}}
                    <p x-bind:class="value.index > 3 ? 'text-white' : 'text-slate-800'" class="text-xs lg:text-sm" x-text="'Rp. ' + formatPrice(value.l) + ' - ' + 'Rp. ' + formatPrice(value.g)"></p>
                </div>
            </template>
        </div>

        {{-- <div class="flex gap-2 flex-wrap mx-5 lg:mx-0">
            <template x-for="value in ordinal">
                <div x-on:click="showHeatmap(value.index)" class="h-[20px] w-[calc(100%/3-8px)] rounded-xl border border-[#000000]"></div>
            </template>
        </div> --}}

        <div class="flex gap-2 mx-4 lg:gap-2 lg:mx-0  lg:flex-col">
            <button x-on:click="showProperty()" id="show-marker"
            class="text-xs py-1 px-3 text-white duration-300 sm:w-[calc(50%-8px)] lg:w-auto rounded-lg bg-slate-600 hover:bg-slate-600/80 lg:py-2">Show markers</button>
            <button
                x-show="filter.length > 0"
                x-transition x-on:click="setFilter(showHeatmap())"
                {{-- x-bind:class="filter.length === 0 ? 'invisible opacity-0' : 'visible opacity-100'" --}}
                class="text-xs py-1 px-3 sm:w-[calc(50%-8px)] lg:w-auto text-white duration-300 rounded-lg bg-slate-600 hover:bg-slate-600/80 lg:py-2">Reset
                filter</button>
        </div>

        <div class="w-full px-4 md:px-5 lg:px-0">
            <label for="large-range" class="block mb-2 text-sm font-medium text-gray-900" x-text="'Opacity ' + Math.round(opacity * 100) + '%'"></label>
            <input x-on:input="changeOpacity($el); opacity = $el.value / 100" id="large-range" type="range" min="10" max="100" class="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg">
        </div>
    </div>
</div>