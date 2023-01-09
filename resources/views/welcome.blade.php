@extends('layouts.app')

@section('content')
    <div id="map" class="min-h-screen h-screen"></div>

    <div x-data="dataOrdinal">
        <div class="legend bottom-[10%] left-5 bg-white fixed w-[300px] h-[270px] z-[999] flex flex-col justify-center gap-1 pl-5 rounded-lg">
            <template x-for="value in ordinal">
                <div x-on:click="showHeatmap(value.index)" class="flex items-center gap-4 cursor-pointer">
                    <div x-bind:class="'bg-range-'+ value.index" class="w-[50px] h-[30px] border border-slate-700"></div>
                    <p class="text-sm" x-text="value.l + ' - ' + value.g "></p>
                </div>
            </template>
            <button x-on:click="showHeatmap()" class="bg-slate-600 text-white rounded-lg mt-3 mr-5 hover:bg-slate-600/80 duration-300">Reset</button>
        </div>
    </div>

@endsection

@push('scripts')
    <script src="{{ url(asset('scripts/script.js')) }}"></script>
    <script src="{{ url(asset('scripts/alpine.js')) }}"></script>
@endpush
