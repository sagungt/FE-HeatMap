<div x-data='{ isShow: false }' class="absolute top-[25px] lg:top-[100px] left-[50px] z-50 ">
    <button @click='isShow = !isShow' x-show='!isShow' class="border border-gray-500 absolute left-[-20px] top-[100px] w-[40px] h-[40px] bg-white flex items-center justify-center rounded-lg" >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>          
    </button>
    <form id="handleForm" method="POST" x-show="isShow" x-transition class="rounded-lg gap-3 p-4 w-[300px] flex justify-center lg:justify-start flex-col bg-white">
        <div class="flex items-center justify-between">
            <h1 class="font-[800] text-lg">Insert Property</h1>
            <button type="button" @click='isShow = !isShow' class="inline-block lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
        </div>
        <label for="price">Price</label>
        <input type="number" placeholder="Price" name="price" class="p-2 border-2 border-gray-500 rounded-xl transition duration-200"
            id='price'>
            {{-- x-model="formData.price" --}}

        <label for="lat">Latitude</label>
        <input type="text" name="lat" id="lat" class="p-2 border-2 border-gray-500 rounded-xl transition duration-200" placeholder="Latitude">
            {{-- x-model="formData.lat" --}}
        <label for="long">Longitude</label>
        <input type="text" name="long" id="long" class="p-2 border-2 border-gray-500 rounded-xl transition duration-200" placeholder="Longitude">

            {{-- x-model="formData.long" --}}
        <button id="submit" type='submit' class="p-2 text-white bg-blue-500 rounded-xl focus:ring-2 focus:ring-blue-300">Submit</button>
    </form>
</div>