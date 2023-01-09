document.addEventListener("livewire:load", function () {
    Alpine.data("dataOrdinal", () => ({
        ordinal: [
            {
                index: 1,
                l: 0,
                g: 700000000,
                opacity: 0.4,
                color: "#fad4d4",
            },
            {
                index: 2,
                l: 700000000,
                g: 1000000000,
                opacity: 0.5,
                color: "#f78686",
            },
            {
                index: 3,
                l: 1000000000,
                g: 1700000000,
                opacity: 0.6,
                color: "#fa5c5c",
            },
            {
                index: 4,
                l: 1700000000,
                g: 2400000000,
                opacity: 0.7,
                color: "#f21f1f",
            },
            {
                index: 5,
                l: 2400000000,
                g: 3500000000,
                opacity: 0.8,
                color: "#c90202",
            },
            {
                index: 6,
                l: 3500000000,
                g: 10000000000,
                opacity: 0.9,
                color: "#380101",
            },
        ],
        MapDetails: false,
        long: 0,
        lat: 0,
        harga: 0,

        modal(lat, long, harga) {
            this.long = long;
            this.lat = lat;
            this.harga = harga;
            this.MapDetails = true;
        },
    }));
});
