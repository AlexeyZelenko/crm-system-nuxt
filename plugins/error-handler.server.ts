export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('app:error', (error) => {
        console.error('Ошибка Nuxt (сервер):', error);

        // Дополнительная обработка, например, логирование на сервере
    });
});
