@extends('layouts.app')

@section('content')
    <!-- Modal Login -->
    <livewire:components.login />
    <!-- Map container -->
    <div id="map" class="z-10 h-screen min-h-screen"></div>

    <!-- Input data form -->
    <div x-data="modal" class="absolute top-[25px] left-[35px] md:left-[50px] lg:left-[20px] lg:top-[20px] z-50" x-init="ceklogin()">
        <button @click='isShow = !isShow' x-show='!isShow' class="border border-gray-500  absolute left-[-20px] lg:left-[15px] top-[15px] w-[40px] h-[40px] bg-white flex items-center justify-center rounded-lg" >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>          
        </button>
        <form id="handleForm" method="POST" x-show="isShow" x-transition class="rounded-lg gap-3 p-4 w-[330px] md:w-[350px] flex justify-center lg:justify-start flex-col bg-white">
            <div class="flex items-center justify-between">
                <h1 class="font-[800] text-lg">Insert Property</h1>
                <button type="button" @click='isShow = !isShow' class="inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                </button>
            </div>
            <label for="price">Price</label>
            <input type="number" name="price" placeholder="Price" class="p-2 border-2 border-gray-500 rounded-xl transition duration-200"
                id='price'>

            <label for="lat">Latitude</label>
            <input type="text" name="lat" id="lat" placeholder="Latitude" class="p-2 border-2 border-gray-500 rounded-xl transition duration-200">

            <label for="long">Longitude</label>
            <input type="text" name="long" id="long" placeholder="Longitude" class="p-2 border-2 border-gray-500 rounded-xl transition duration-200">

            <button id="submit" type='submit' class="p-2 text-white bg-blue-500 rounded-xl">Submit</button>
        </form>
    {{-- <livewire:components.form/> --}}
    </div>

    <div class="absolute top-5 z-[999999] right-5">
        <a href="{{ url('/') }}" class="bg-white shadow-md px-5 py-2 rounded-md text-black hover:bg-green-400 hover:text-white duration-200">Home</button>
    </div>

    <div class="absolute top-3 z-50 right-28" x-data="modal" x-show="isShow" x-init="ceklogin()">
        <button class="bg-red-500 shadow-md px-5 py-2 rounded-md text-black hover:bg-red-700 hover:text-white duration-200"
            @click="logout()">Logout</button>
    </div>

    <!-- Loading indicator -->
    <livewire:components.loading/>

    <!-- Message info container -->
    <div id='message'
        class="absolute top-1/2 left-1/2 hidden items-center justify-center z-[999999] -translate-x-1/2 -translate-y-1/2 bg-white w-[200px] h-10 px-2 py-1.5 rounded">
    </div>
@endsection

@push('scripts')
    <script src="{{ url(asset('scripts/input.js')) }}"></script>
    <script src="{{ url(asset('scripts/alpine.js')) }}"></script>
@endpush
