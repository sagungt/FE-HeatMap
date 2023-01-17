@extends('layouts.app')

@section('content')
    <livewire:components.modal />
    <div id="map" class="h-screen min-h-screen" x-on:click="$ref.inputForm.blur()"></div>

    <div class="absolute hidden lg:flex items-center gap-5 top-20 right-5 z-[9999]">
        <button id='mode' class="text-white transition duration-200 bg-purple-700 hover:bg-purple-700/80 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 ">Hover mode</button>
    </div>
    <!-- Form Search -->
    <livewire:components.search />

    <!-- Information Legend -->
    <livewire:components.legend />

    <!-- Loading indicator -->
    <livewire:components.loading />

    <!-- Error indicator -->
    <livewire:components.error />

    <!-- To my location button -->
    <livewire:components.my-location />
@endsection

@push('scripts')
    <script src="https://d3js.org/d3.v7.min.js"></script>
    <script src="{{ url(asset('scripts/script.js')) }}"></script>
    <script src="{{ url(asset('scripts/alpine.js')) }}"></script>
@endpush
