// Поиск конкретного item категории через фильтр

export const searchWarehouseItemFilter = (arrayToFilter, search) => {
  return arrayToFilter.filter((item) => {
    // console.log(item.name)
      return (item.name.toLowerCase().indexOf(search.toLowerCase()) != -1);
  });
};