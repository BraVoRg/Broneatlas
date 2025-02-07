<?php

declare(strict_types=1);

namespace Shimmie2;

class CustomIndexTheme extends IndexTheme
{
    /**
     * @param Image[] $images
     */
    public function display_page(Page $page, array $images): void
    {
        $this->display_shortwiki($page);

        $this->display_page_header($page, $images);

        $nav = $this->build_navigation($this->page_number, $this->total_pages, $this->search_terms);
        $page->add_block(new Block("Поиск", $nav, "left", 0));

        if (count($images) > 0) {
            $this->display_page_images($page, $images);
        } else {
            $this->display_error(404, "Посты не найдеры", "Вы ищете шушпанцер который танковая промышленность еще не изобрела. А может, Вы просто указали неправильные теги, попробуйте еще раз...");
        }
    }

    /**
     * @param string[] $search_terms
     */
    protected function build_navigation(int $page_number, int $total_pages, array $search_terms): string
    {
        $h_search_string = count($search_terms) == 0 ? "" : html_escape(implode(" ", $search_terms));
        $h_search_link = search_link();
        return "
			<p><form action='$h_search_link' method='GET'>
				<input name='search' type='text' value='$h_search_string' class='autocomplete_tags' placeholder=''  style='width:100%'/>
				<input type='submit' value='Найти' style='width:100%'>
				<input type='hidden' name='q' value='post/list'>
			</form>
			<div id='search_completions'></div>";
    }

    /**
     * @param Image[] $images
     */
protected function build_table(array $images, ?string $query): string
{
    $h_query = html_escape($query);
    $table = "<div class='shm-image-list' data-query='$h_query'>";
    
    // Массив для хранения ID изображений
    $imageIds = [];
    
    foreach ($images as $image) {
        // Добавляем ID изображения в массив
        $imageIds[] = $image->id; // Предполагаем, что ID доступен через $image->id
        // Генерируем HTML для миниатюры
        $table .= $this->build_thumb_html($image) . "\n";
    }
    
    $table .= "</div>";
    
    // Сохраняем массив ID изображений в sessionStorage
    $table .= "<script>sessionStorage.setItem('imageIds', JSON.stringify(" . json_encode($imageIds) . "));</script>";
    
    return $table;
}
}
