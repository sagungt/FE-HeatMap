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
        message: false,
        isShow: false,
        ceklogin() {
            const token = localStorage.getItem("token");
            if (token) {
                this.modalLogin = false;
                this.isShow = true;
            } else {
                this.modalLogin = true;
                this.isShow = false;
            }
        },

        async login() {
            const data = new FormData();
            data.append("email", this.email);
            data.append("password", this.password);
            const respon = await fetch(
                "https://api-heatmap-farcapital.fly.dev/v1/api/login",
                {
                    method: "POST",
                    body: data,
                }
            )
                .then((res) => res.json())
                .then(async (response) => {
                    if (response.status == "success") {
                        localStorage.setItem("token", true);

                        toggleMessage(
                            true,
                            '<span class="text-xs italic font-bold text-blue-700">Login Successful</span>'
                        );
                        setTimeout(() => {
                            window.location.href = "";
                        }, 3000);
                    } else {
                        this.message = true;
                        console.log(await response.status);
                    }
                });
        },

        async logout() {
            const respon = await fetch(
                "https://api-heatmap-farcapital.fly.dev/v1/api/logout"
            ).then(async (response) => await response.json());

            console.log(respon);
            if ((respon.status = "success")) {
                localStorage.removeItem("token");
                toggleMessage(
                    true,
                    '<span class="text-xs italic font-bold text-blue-700">Logout Successful</span>'
                );
                setTimeout(() => {
                    window.location.href = "";
                }, 3000);
            } else {
                toggleMessage(
                    true,
                    '<span class="text-xs italic font-bold text-red-700">Logout Failed</span>'
                );
                setTimeout(() => {
                    window.location.href = "";
                }, 3000);
            }
        },
    }));
});
