// поиск конкретного контакта через фильтр
// Оптимизировать для более широкого применения
export const searchFilter = (arrayToFilter, search) => {

  return arrayToFilter.filter((contact) => {

    return (
      contact.contactInfo.name.toLowerCase().indexOf(search.toLowerCase()) != -1 ||
      contact.contactInfo.surname.toLowerCase().indexOf(search.toLowerCase()) != -1 ||
      contact.contactInfo.company.toLowerCase().indexOf(search.toLowerCase()) != -1
      // Из каких col еще стреубется поиск? по номеру телефона? по наличию вайбера? думайте...
    )
  })
  
};