<!-- Legend Information -->
<div x-data="dataOrdinal" class="legend relative bottom-[320px] left-5 z-[9999] w-[230px] h-[310px] sm:w-[380px] sm:h-[175px] sm:bottom-[175px] md:w-[350px] md:h-[175px] md:bottom-[175px] lg:w-[300px] lg:bottom-[410px] lg:h-[400px] duration-700">
    <button x-on:click="animationLegend()" class="btn-legend btn-legend-aktif shadow-lg flex justify-center items-center duration-700 md:duration-500 absolute z-[9999] w-[40px] h-[40px] rounded-[14px] bg-[#ffffff] sm:-top-2 sm:w-[40px] sm:duration-[0.8s] sm:h-[40px] lg:bottom-[520px] lg:w-[50px] lg:h-[50px]">
        <i class="fa-solid fa-chevron-right rotate-90 text-slate-600 text-lg duration-500"></i>
    </button>

    <div class="information-legend bottom-5 gap-4 flex flex-col justify-center rounded-lg duration-700 md:duration-500 bg-white absolute w-full py-4 sm:translate-x-0 lg:py-5 z-[999] lg:px-5 lg:gap-4 shadow-lg">
        <div class="flex flex-col sm:flex-row sm:flex-wrap gap-2 mx-5 lg:mx-0">
            <template x-for="value in ordinal">
                <div x-on:click="showHeatmap(value.index)" x-bind:class="'bg-range-' + value.index" class="flex items-center gap-4 transition cursor-pointer px-5 py-1 justify-center rounded-lg hover:scale-[105%] w-full sm:w-[calc(50%-8px)] lg:w-full duration-300 lg:py-2">
                    {{-- <div x-bind:class="'bg-range-' + value.index" class="w-[40px] h-[20px] border border-slate-700 lg:w-[50px] lg:h-[30px]"></div> --}}
                    <p x-bind:class="value.index > 3 ? 'text-white' : 'text-slate-800'" class="text-xs lg:text-sm" x-text="'Rp. ' + formatPrice(value.l) + ' - ' + 'Rp. ' + formatPrice(value.g) "></p>
                </div>
            </template>
        </div>

        <div class="flex gap-2 mx-4 lg:gap-2 lg:mx-0  lg:flex-col">
            <button x-on:click="showHeatmap()"
                class="text-xs py-1 px-3 sm:w-[calc(50%-8px)] lg:w-auto text-white duration-300 rounded-lg bg-slate-600 hover:bg-slate-600/80 lg:py-2">Reset
                filter</button>
            <button x-on:click="showProperty()" id="show-marker"
                class="text-xs py-1 px-3 text-white duration-300 sm:w-[calc(50%-8px)] lg:w-auto rounded-lg bg-slate-600 hover:bg-slate-600/80 lg:py-2">Show markers</button>
        </div>
    </div>
</div>