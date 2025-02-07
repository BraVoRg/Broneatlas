document.addEventListener('DOMContentLoaded', () => {
    // Получаем массив ID изображений из sessionStorage
    const imageIds = JSON.parse(sessionStorage.getItem('imageIds'));

    // Отладка: выводим массив ID изображений
    console.log("Image IDs:", imageIds);

    if (!imageIds || !Array.isArray(imageIds)) {
        console.error('No image IDs found or invalid format.');
        return;
    }

    // Функция для перехода к следующему изображению
    function goToNextImage() {
        const currentUrl = window.location.href;
        const match = currentUrl.match(/post\/view\/(\d+)/);

        if (!match) {
            console.error('URL does not contain a valid post ID.');
            return;
        }

        let currentPostId = parseInt(match[1], 10);

        // Находим индекс текущего изображения в массиве
        const currentIndex = imageIds.indexOf(currentPostId);

        if (currentIndex === -1) {
            console.error('Current post ID not found in the image list.');
            return;
        }

        // Определяем ID следующего изображения
        const nextIndex = currentIndex + 1; // Переход к следующему изображению

        if (nextIndex >= imageIds.length) {
            // Если это последнее изображение, останавливаем навигацию
            console.warn('Last image reached. Navigation stopped.');
            return;
        }

        const nextPostId = imageIds[nextIndex];

        // Формируем новый URL
        const newUrl = currentUrl.replace(/post\/view\/\d+/, `post/view/${nextPostId}`);

        // Перенаправление на новую страницу
        window.location.href = newUrl;
    }

    // Функция для перехода к предыдущему изображению
    function goToPrevImage() {
        const currentUrl = window.location.href;
        const match = currentUrl.match(/post\/view\/(\d+)/);

        if (!match) {
            console.error('URL does not contain a valid post ID.');
            return;
        }

        let currentPostId = parseInt(match[1], 10);

        // Находим индекс текущего изображения в массиве
        const currentIndex = imageIds.indexOf(currentPostId);

        if (currentIndex === -1) {
            console.error('Current post ID not found in the image list.');
            return;
        }

        // Определяем ID предыдущего изображения
        const prevIndex = currentIndex - 1; // Переход к предыдущему изображению

        if (prevIndex < 0) {
            // Если это первое изображение, останавливаем навигацию
            console.warn('First image reached. Navigation stopped.');
            return;
        }

        const prevPostId = imageIds[prevIndex];

        // Формируем новый URL
        const newUrl = currentUrl.replace(/post\/view\/\d+/, `post/view/${prevPostId}`);

        // Перенаправление на новую страницу
        window.location.href = newUrl;
    }

    // Обработчик событий клавиатуры
    document.addEventListener('keydown', (event) => {
        // Стрелка влево: переход к предыдущему изображению
        if (event.key === 'ArrowLeft') {
            goToPrevImage();
        }
        // Стрелка вправо: переход к следующему изображению
        else if (event.key === 'ArrowRight') {
            goToNextImage();
        }
    });

    // Обработчик клика по изображению
    $("img.shm-main-image").click(function(e) {
        // Переход к следующему изображению по клику
        goToNextImage();
    });

    // Изначальный функционал (масштабирование и другие обработчики)
    function zoom(zoom_type, save_cookie) {
        save_cookie = save_cookie === undefined ? true : save_cookie;

        var img = $('.shm-main-image');

        if (zoom_type === "full") {
            img.css('max-width', img.data('width') + 'px');
            img.css('max-height', img.data('height') + 'px');
        }
        if (zoom_type === "width") {
            img.css('max-width', '95%');
            img.css('max-height', img.data('height') + 'px');
        }
        if (zoom_type === "height") {
            img.css('max-width', img.data('width') + 'px');
            img.css('max-height', (window.innerHeight * 0.95) + 'px');
        }
        if (zoom_type === "both") {
            img.css('max-width', '95%');
            img.css('max-height', (window.innerHeight * 0.95) + 'px');
        }

        $(".shm-zoomer").val(zoom_type);

        if (save_cookie) {
            shm_cookie_set("ui-image-zoom", zoom_type);
        }
    }

    $(".shm-zoomer").change(function(e) {
        zoom(this.options[this.selectedIndex].value);
    });

    $(window).resize(function(e) {
        $(".shm-zoomer").each(function (e) {
            zoom(this.options[this.selectedIndex].value, false)
        });
    });

    if (shm_cookie_get("ui-image-zoom")) {
        zoom(shm_cookie_get("ui-image-zoom"));
    } else {
        zoom("both");
    }
});