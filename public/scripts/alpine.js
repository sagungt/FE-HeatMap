document.addEventListener("livewire:load", function () {
    Alpine.data("dataOrdinal", () => ({
        ordinal,
        filter: null,
    }));

    Alpine.data("search", () => ({
        resultLocations: [],
        timeout: null,
        loading: false,

        /**
         * Debouce function
         * @param {function} func - Callback function
         * @param {number} delay - Delay in milliseconds
         * @return {void}
         */
        debouce(func, delay) {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(func, delay);
        },

        /**
         * Find location form handler
         * @param {any} event - Event
         * @return {void}
         */
        findLocation(event) {
            this.loading = true;
            const { value } = event.target;
            this.debouce(async () => {
                const query = new URLSearchParams(value);
                const res = await fetch(`${SEARCH_ENDPOINT}?q=${query}`);
                const { data } = await res.json();
                this.resultLocations = data;
                this.loading = false;
            }, 1000);
        },
    }));
    Alpine.data("modal", () => ({
        tagChart: false,
        lineChart: false,
        barChart: true,
        modalLogin: false,

        ceklogin() {
            const token = localStorage.getItem("token");
            this.islogin = token
                ? (this.modalLogin = false)
                : (this.modalLogin = true);
        },
    }));
});
