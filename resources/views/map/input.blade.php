@extends('layouts.app')

@section('content')
  <div id="map" class="z-10 h-screen min-h-screen"></div>

  <div class="absolute top-[100px] left-[50px] z-50 ">
    <form id="handleForm" method="POST" class=" rounded gap-3 p-4 w-[200px] flex flex-col bg-white">
      <label for="">Harga</label>
      <input type="number" placeholder="Harga" name="price" class="p-2 border-2 border-gray-500 rounded-xl" id='price'
        x-model="formData.price">
      <label for="">lat</label>
      <input type="text" name="lat" id="lat" class="p-2 border-2 border-gray-500 rounded-xl" x-model="formData.lat">
      <label for="">long</label>
      <input type="text" name="long" id="long" class="p-2 border-2 border-gray-500 rounded-xl"
        x-model="formData.long">
      <button id="submit" type='submit' class="p-2 text-white bg-blue-500 rounded-xl">Submit</button>
    </form>
  </div>
@endsection

@push('scripts')
  <script>
    var map = L.map('map').setView([-6.917008029115489, 107.61900716418606], 12)
    var markers = []
    var link = 'https://fbca-113-11-180-120.ap.ngrok.io/api/'

    var loc = []
    async function fetchApi(link) {
      let object = await fetch(link)
      let value = await object.json()
      loc = value.data.map((d) => [d.latitude, d.longitude, d.price]);
      for (i = 0; i < loc.length; i++) {
        L.marker([loc[i][0], loc[i][1]]).bindPopup('Price : ' + loc[i][2]).addTo(map)
      }
    }

    function onClickMap(e) {
      if (markers.length > 0) {
        markers[0].remove();
        markers = [];
      }

      var lat = document.getElementById('lat')
      var long = document.getElementById('long')

      lat.value = e.latlng.lat
      long.value = e.latlng.lng

      const newMarker = new L.Marker([e.latlng.lat, e.latlng.lng]);
      newMarker.addTo(map);
      markers.push(newMarker);
    }

    const btn = document.querySelector('#submit')
    const form = document.querySelector('#handleForm')

    btn.addEventListener('click', (e) => {
      e.preventDefault()
      const formData = new FormData(form)
      formData.append('harga', document.querySelector('#price').value)
      formData.append('lat', document.querySelector('#lat').value)
      formData.append('long', document.querySelector('#long').value)

      fetch(link + 'create', {
        method: 'POST',
        body: formData,
      }).then(res => res.json()).then(data => console.log(data))
    })

    map.on('click', onClickMap)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map)
    fetchApi(link + 'allheatmap')
  </script>
@endpush
