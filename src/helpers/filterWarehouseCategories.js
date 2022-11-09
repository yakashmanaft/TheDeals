// Поиск конкретной категории через фильтр
export const searchWarehouseCategoryFilter = (arrayToFilter, search) => {
    return arrayToFilter.filter((category) => {
  
        return (category.name.toLowerCase().indexOf(search.toLowerCase()) != -1);
    });
};