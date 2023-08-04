конкретные страницы, страницы могут сменать друг друга, подумать над конкретными страницами, которые можно назначить именно страницами

- modules
- pages
-- ArticlePage
--- api
--- components
---- ArticlePage
---- ArticlesPageHeader
--- consts
--- helpers
--- store
- ui

Сама page по сути должна быть пусто (оставаться максимальной тонкой)
const ArticlesPage = () => {
    return (
        return (
            <div>
                <ArticleDetails />
                <ArticleStarRating />
                <ArticleAuthor />
                <ArticleRecommendations />
                <ArticleComments />
            </div>
        )
    )
}

Страница - это перечисление виджетов и фичей

pages 
ShopProductPage 

features/widget 
features/widget: ShopProductDetails (entities: ProductDescription ProductCharacteristic) 
features/widget: ProductComments (entities: CommentList CommentForm (shared: input Button))
features/widget: ProductReccomendations (entities: ProductList)
shared: input Button
