<div x-data="modal" x-init="ceklogin()">
    <div x-show="modalLogin"
        class="z-[99999] absolute inset-0 items-center justify-center bg-gray-700 bg-opacity-50 backdrop-blur-sm">
        <div
            class="bg-white rounded-md sm:mx-auto mx-5 max-w-lg sm:mt-40 mt-20 p-6 shadow-lg hover:shadow-2xl transition-shadow">
            <div class="-mt-12 text-center mb-8">
                <i class="fa-solid fa-user rounded-full bg-blue-700 p-5 text-4xl"></i>
            </div>
            <div class="text-end -mt-14 mb-5">
                <button><i class="fa-solid fa-xmark text-2xl" @click="modalLogin = false"></i></button>
            </div>
            <section>
                <p class="text-center text-2xl text-black">Login Admin</p>
            </section>
            <section>
                <form action="" method="post">
                    <input type="email" name="email"
                        class="w-full border-none bg-slate-200 mt-5 focus:outline-none rounded-md" autocomplete="off"
                        placeholder="Silahkan Isi Email Anda" autofocus>
                    <input type="password" name="password"
                        class="w-full border-none bg-slate-200 mt-5 focus:outline-none rounded-md"
                        placeholder="Silahkan Isi Password Anda">

                    <button type="submit"
                        class="w-full rounded-md bg-green-400 mt-10 py-2 hover:bg-green-500 duration-200 text-black hover:font-bold">Submit</button>
                </form>
            </section>
        </div>
    </div>
</div>
