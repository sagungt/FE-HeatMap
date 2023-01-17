<!-- Legend Information -->
<div x-data="dataOrdinal" class="relative bottom-[310px] left-[50%] -translate-x-[50%] sm:w-[350px] h-[310px] sm:h-[250px] sm:bottom-[240px] sm:left-48 z-[9999] w-[90%] lg:w-[380px] lg:left-52 lg:bottom-[400px] lg:h-[400px]">
    <button x-on:click="animationLegend()" class="btn-legend left-0 btn-legend-aktif shadow-lg flex justify-center items-center duration-500 absolute z-[9999] w-[50px] h-[50px] rounded-[14px] bg-[#ffffff] sm:-top-2 sm:w-[40px] sm:duration-[0.8s] sm:h-[40px] lg:bottom-[520px] lg:w-[50px] lg:h-[50px]">
        <i class="fa-solid fa-chevron-right rotate-90 text-slate-600 text-lg duration-500"></i>
    </button>

    <div class="legend bottom-5 information-legend-aktif gap-4 flex flex-col justify-center rounded-lg duration-500 bg-white absolute w-full py-4 sm:translate-x-0 lg:py-5 z-[999] lg:px-5 lg:gap-4 shadow-lg">
        <div class="flex flex-col gap-2 mx-5 lg:mx-0">
            <template x-for="value in ordinal">
                <div x-on:click="showHeatmap(value.index)" class="flex items-center gap-4 transition delay-700 cursor-pointer">
                    <div x-bind:class="'bg-range-' + value.index" class="w-[40px] h-[20px] border border-slate-700 lg:w-[50px] lg:h-[30px]"></div>
                    <p class="text-xs lg:text-sm" x-text="'Rp. ' + formatPrice(value.l) + ' - ' + 'Rp. ' + formatPrice(value.g) "></p>
                </div>
            </template>
        </div>

        <div class="flex gap-2 justify-between mx-4 lg:gap-2 lg:mx-0  lg:flex-col">
            <button x-on:click="showHeatmap()"
                class="text-xs py-2 px-3 text-white duration-300 rounded-lg bg-slate-600 hover:bg-slate-600/80">Reset
                filter</button>
            <button x-on:click="resetHeatmap()"
                class="text-xs py-2 px-3 text-white duration-300 rounded-lg bg-slate-600 hover:bg-slate-600/80">Reset
                heatmap</button>
            <button id="show-marker"
                class="text-xs py-2 px-3 text-white duration-300 rounded-lg bg-slate-600 hover:bg-slate-600/80">Show markers</button>
        </div>
    </div>
</div>