@extends('layouts.app')
@section('content')
    <!-- Modal Login -->
    <livewire:components.login />
    <!-- Map container -->
    <div id="map" class="z-10 h-screen min-h-screen"></div>

    <!-- Input data form -->
    <div x-data="modal" class="absolute top-[65px] left-[35px] md:left-[50px] md:top-[35px] lg:left-[20px] lg:top-[20px] z-50" x-init="ceklogin()">
        <button @click='isShow = !isShow' x-show='!isShow' class="border border-gray-500  absolute left-[-20px] lg:left-[15px] top-[15px] w-[200px] h-[40px] bg-white flex items-center justify-center gap-3 rounded-lg" >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Create Property</span>
        </button>
        <form id="handleForm" method="POST" x-show="isShow" x-transition class="rounded-lg gap-3 p-4 w-[330px] md:w-full flex justify-center lg:justify-start flex-col bg-white">
            <div class="flex items-center justify-between">
                <h1 class="font-[800] text-lg">Insert Property</h1>
                <button type="button" @click='isShow = !isShow' class="inline-block">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
            </div>
            <div class="flex flex-col gap-5 md:flex-row p-3 h-[250px] overflow-y-auto md:overflow-y-hidden">
                <div class="flex flex-col gap-3 w-full lg:w-[60%]">
                    <div class="flex flex-col">
                        <label for="price">Price</label>
                        <input type="number" name="price" placeholder="Price" class="py-1.5 px-2 border border-gray-200 rounded-xl transition duration-200" id='price'>
                    </div>
                    <div class="flex flex-col">
                        <label for="">Type</label>
                        <select id='type' class="py-1.5 px-2 border border-gray-200 rounded-xl transition duration-200">
                            <option value="Rumah">Rumah</option>
                            <option value="Tanah">Tanah</option>
                            <option value="Apartemen">Apartemen</option>
                            <option value="Other">lain-lain</option>
                        </select>
                    </div>
                    <div class="flex flex-col">
                        <label for="">Deskripsi</label>
                        <textarea name="desc" id="desc" cols="0" class="py-1.5 px-2 border border-gray-200 rounded-xl transition duration-200" placeholder="Deskripsi"></textarea>
                    </div>
                </div>
                <div class="flex flex-col gap-3 w-full lg:w-[40%]">
                    <div class="flex flex-col">
                        <label for="lat">Latitude</label>
                        <input type="number" name="lat" id="lat" placeholder="Latitude" class="py-1.5 px-2 border border-gray-200 rounded-xl transition duration-200">
                    </div>
                    <div class="flex flex-col">
                        <label for="long">Longitude</label>
                        <input type="text" name="long" id="long" placeholder="Longitude" class="py-1.5 px-2 border border-gray-200 rounded-xl transition duration-200">
                    </div>
                    <div class="flex flex-col">
                        <label for="long">Area</label>
                        <input type="number" name="area" id="area" placeholder="area" class="py-1.5 px-2 border border-gray-200 rounded-xl transition duration-200">
                    </div>
                </div>
            </div>
            <button id="submit" type='submit' class="w-3/4 mx-auto p-2 text-white bg-blue-500 rounded-xl">Submit</button>
        </form>
    {{-- <livewire:components.form/> --}}
    </div>

    <div class="absolute top-5 z-[999999] right-5">
        <a href="{{ url('/') }}" class="px-5 py-2 text-black duration-200 bg-white rounded-md shadow-md hover:bg-green-400 hover:text-white">Home</a>
    </div>

    <div class="absolute z-50 top-3 right-28" x-data="modal" x-show="isShow" x-init="ceklogin()">
        <button class="px-5 py-2 text-white duration-200 bg-red-500 rounded-md shadow-md hover:bg-red-700 hover:text-white"
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
