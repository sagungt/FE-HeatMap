@extends('layouts.app')

@section('content')
    <livewire:components.modal />
    <div id="map" class="h-screen min-h-screen" x-on:click="$ref.inputForm.blur()"></div>
    
    <!-- Button form -->
    <livewire:components.mode/>

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
