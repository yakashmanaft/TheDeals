// поиск конкретного контакта через фильтр
// Оптимизировать для более широкого применения
export const searchDealSubjectFilter = (arrayToFilter, search) => {

    return arrayToFilter.filter((subject) => {
  
      return (subject.name.toLowerCase().indexOf(search.toLowerCase()) != -1);
    });
  };