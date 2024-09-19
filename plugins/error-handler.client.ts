export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('vue:error', (error, context) => {
        console.error('Ошибка Vue:', error);
        console.error('Контекст:', context);

        // Дополнительная обработка, например, отправка данных об ошибке на сервер
    });

    nuxtApp.hook('app:error', (error) => {
        console.error('Ошибка Nuxt:', error);

        // Дополнительная обработка, например, показ сообщения пользователю
    });
});
