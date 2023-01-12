@extends('layouts.app')

@section('content')
    @livewire('components.modal')
    <div id="map" class="h-screen min-h-screen" x-on:click="$ref.inputForm.blur()"></div>

    <!-- Form Search -->
    <div class="absolute z-[9999] top-5 left-0 flex justify-center items-center w-full md:top-5 md:right-5 md:w-auto md:justify-end">
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
                <div class="location max-h-[550px] overflow-y-scroll">
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

    <!-- Legend Information -->
    <div x-data="dataOrdinal" class="relative bottom-[310px] left-[50%] -translate-x-[50%] sm:w-[420px] h-[310px] sm:left-56 bg-green-400 z-[9999] w-[90%]">
            <button x-on:click="animationLegend()" class="btn-legend left-0 -top-5 shadow-lg flex justify-center items-center duration-500 absolute z-[9999] w-[50px] h-[50px] rounded-[14px] bg-[#ffffff] sm:w-[40px] sm:h-[40px] sm:top-2 lg:bottom-[520px] lg:w-[50px] lg:h-[50px]">
                <i class="fa-solid fa-chevron-right rotate-90 text-slate-600 text-lg duration-500"></i>
            </button>

            <div class="legend bottom-5 left-[50%] gap-1 flex flex-col justify-center rounded-lg duration-500 -translate-x-[50%] bg-white absolute w-full py-4 sm:left-0 sm:translate-x-0 lg:py-5 z-[999] lg:px-5 lg:gap-4 lg:bottom-[10%] lg:left-5">
                <div class="flex flex-col gap-2 mx-5 lg:mx-0">
                    <template x-for="value in ordinal">
                        <div x-on:click="showHeatmap(value.index)" class="flex items-center gap-4 transition delay-700 cursor-pointer">
                            <div x-bind:class="'bg-range-' + value.index" class="w-[40px] h-[20px] border border-slate-700 lg:w-[50px] lg:h-[30px]"></div>
                            <p class="text-xs" x-text="value.l + ' - ' + value.g "></p>
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
                    <button x-on:click="showProperty()"
                        class="text-xs py-2 px-3 text-white duration-300 rounded-lg bg-slate-600 hover:bg-slate-600/80">Show markers</button>
                </div>
            </div>
    </div>

    <!-- Loading indicator -->
    <div id='loading' class="absolute top-5 left-5 hidden items-center justify-center z-[999] bg-white px-2 py-1.5 rounded">
        <svg aria-hidden="true" class="w-6 h-6 mr-2 text-gray-700 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span class="text-xs font-light italic">Loading</span>
    </div>

    <!-- Error indicator -->
    <div id='error' class="absolute z-[999] top-5 left-5 px-2 py-1.5 bg-red-600 hidden items-center rounded">
        <h1 class="text-xs italic font-bold text-white">!! Something went wrong</h1>
    </div>
@endsection

@push('scripts')
    <script src="https://d3js.org/d3.v7.min.js"></script>
    <script src="{{ url(asset('scripts/script.js')) }}"></script>
    <script src="{{ url(asset('scripts/alpine.js')) }}"></script>
@endpush
