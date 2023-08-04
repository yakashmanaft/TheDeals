различные компоненты со всеми их настройками, функциями... в ответ выдаем только public api
InfiniteUsersList, ArticleComments, RegistartionForm, RegionsGeoTree, OrderFeedbackForm

Если надо объединить несколько модулей - объединяем на уровне pages 

- modules 
-- RegistartionFrom
--- api
----- fetchDataRegistration.ts
----- registrationRequest.ts
--- components (folders)
----- AgreementCheckbox
----- RegistartionButton
----- RegistartionForm
------- RegistartionForm.tsx
----- RegistrationPhoneNumber
--- constatns
--- helpers
----- concatUserFormInfoToString.ts 
----- prepareDataForRequest.ts
----- validateForm.ts
--- store
----- actions.ts
----- reducer.ts
----- selectors.ts
----- thunks.ts
index.ts (public api, по сути export компонентов или изоляция, с выдачей только необходимого, чтобы можно было с легкостью удалить)