document.addEventListener("livewire:load", function () {
    Alpine.data("dataOrdinal", () => ({
        ordinal,
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
        email: "",
        password: "",

        ceklogin() {
            const token = localStorage.getItem("token");
            if (token) {
                this.modalLogin = true;
            } else {
                this.modalLogin = false;
            }
        },

        login() {
            const data = new FormData();
            data.append("email", this.email);
            data.append("password", this.password);
            const respon = fetch(
                "https://api-heatmap-farcapital.fly.dev/v1/api/login",
                {
                    method: "POST",
                    body: data,
                }
            ).then(async (response) => {
                this.users = await response.json();
                if (users.status) {
                    localStorage.setItem("token", true);
                    toggleMessage(
                        true,
                        '<span class="text-xs italic font-bold text-blue-700">Login Successful</span>'
                    );
                    setTimeout(() => {
                        window.location.href = "";
                    }, 3000);
                } else {
                    toggleMessage(
                        true,
                        '<span class="text-xs italic font-bold text-red-700">Login Failed</span>'
                    );
                }
            });
        },
    }));
});
