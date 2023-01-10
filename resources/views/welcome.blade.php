@extends('layouts.app')

@section('content')
    @livewire('components.modal')
    <div id="map" class="min-h-screen h-screen"></div>

    <!-- Form Search -->
    <form action="" method="POST" class="absolute z-[9999] top-5 right-5">
        <div x-data="{location: ''}" class="bg-white rounded-lg w-[316px]">
            <div class="flex items-center bg-white rounded-lg shadow-md w-full pl-4 pr-2 py-1">
                <div class="w-[6%] h-[40px] flex justify-start items-center">
                    <i class="fa-solid fa-magnifying-glass"></i>
                </div>
                <input type="text" x-model="location" x-on:input="findLocation" class="rounded-xl h-[40px] w-[84%] border-none text-sm focus:ring-transparent" placeholder="Search location ...">
                <button class="bg-slate-500 w-8 h-8 rounded-lg shadow-xl duration-300 hover:bg-slate-500/80">
                    <i class="fa-solid fa-arrow-right text-white"></i>
                </button>
            </div>
            <div>
                <template x-if="location.length > 0">
                    <div class="py-3 px-4 flex items-center overflow-x-hidden  max-w-[316px]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>                  
                        <p x-text="location" class="nameLocation ml-[11px] text-sm w-full overflow-y-hidden"></p>
                    </div>
                </template>
            </div>
        </div>
    </form>

    <!-- Informasi Legend -->
    <div x-data="dataOrdinal">
        <div
            class="legend bottom-[10%] left-5 bg-white fixed w-[300px] h-[300px] z-[999] flex flex-col justify-center gap-1 pl-5 rounded-lg">
            <template x-for="value in ordinal">
                <div x-on:click="showHeatmap(value.index)" class="flex items-center gap-4 cursor-pointer">
                    <div x-bind:class="'bg-range-' + value.index" class="w-[50px] h-[30px] border border-slate-700"></div>
                    <p class="text-sm" x-text="value.l + ' - ' + value.g "></p>
                </div>
            </template>
            <button x-on:click="showHeatmap()" class="mt-3 mr-5 text-white duration-300 rounded-lg bg-slate-600 hover:bg-slate-600/80">Reset filter</button>
            <button x-on:click="resetHeatmap()" class="mt-3 mr-5 text-white duration-300 rounded-lg bg-slate-600 hover:bg-slate-600/80">Reset heatmap</button>
        </div>
    </div>
@endsection

@push('scripts')
    <script src="{{ url(asset('scripts/script.js')) }}"></script>
    <script src="{{ url(asset('scripts/alpine.js')) }}"></script>
@endpush
