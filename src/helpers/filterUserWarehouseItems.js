// Поиск конкретного item категории через фильтр

export const searchWarehouseItemFilter = (arrayToFilter, search) => {
  return arrayToFilter.filter((recipe) => {
    // console.log(item.name)
      return (recipe.name.toLowerCase().indexOf(search.toLowerCase()) != -1);
  });
};

export const searchWarehouseCategoryFilter = (arrayToFilter, search) => {
  return arrayToFilter.filter((category) => {
    // console.log(category);
    return (category.toLowerCase().indexOf(search.toLowerCase()) != -1);
  });
};