<template :key="componentKey">
    <div>
        <!-- Спиннер как имитация загрузки -->
        <Spinner v-if="spinner"/>

        <!-- page header -->
        <ViewHeader 
            style="background-color: white;"
        />

        <!-- page-content -->
        <ion-content
            :scroll-events="true"
            class="ion-page ion-margin-top" 
            id="main"
            type="push" 
            forceOverscroll="false"
        >
            <br>
            <br>
            <!-- page-content -->
            <!-- No data -->
            <div>
                <!-- Если !data -->
                <!-- Data is not available -->
            </div>

            <!-- Data -->
            <div class="ion-text-left">

                <!-- Название рецепта -->
                <ion-item-group class="ion-padding-horizontal">
                    <!-- Заголовок -->
                    <ion-text>
                        <h4>Название</h4>
                    </ion-text>
                    <!--  -->
                    <ion-item class="ion-no-padding" lines="none">
                        <ion-input color="medium" v-model="recipeName" autocapitalize="on" maxlength="40"></ion-input>
                    </ion-item>
                </ion-item-group>

                <!-- Категории рецепта -->
                <ion-item-group class="ion-padding-horizontal">
                    <!-- Заголовок -->
                    <ion-text>
                        <h4>Категории</h4>
                    </ion-text>
                    <!--  -->
                    <ion-grid class="ion-no-padding">
                        <!-- Категория -->
                        <ion-chip v-for="(category, index) in currentRecipe.categories" :key="index" class="ion-no-margin ion-margin-vertical ion-margin-end" color="primary" style="position: relative; overflow: visible">
                            {{ category }}
                            <!-- Кнопка удалить выбранную категорию у рецепта -->
                            <ion-icon :icon="closeCircleOutline" style="position: absolute; right: -0.2rem; top: 0;" color="medium" @click.stop="openDeleteCategoryModal(category)"></ion-icon>
                        </ion-chip>

                        <!-- Кнопка добавления категории -->
                        <ion-chip v-if="currentRecipe.categories.length < 3" class="ion-no-margin ion-margin-vertical ion-margin-end" color="primary" outline="true" @click.stop="searchRecipesCategoriesMenu = true">
                            Добавить
                        </ion-chip>
                    </ion-grid>

                    <!-- Всплывашка подтверждение удаления категории предмета -->
                    <ion-action-sheet
                    :isOpen="deleteCategory"
                    header="Удалить категорию"
                    :buttons="deleteCategoryButtons"
                    @didDismiss="deleteCategory = false"
                    ></ion-action-sheet>
                </ion-item-group>

                <!-- Свайпер с фотками -->
                <swiper 
                    :modules="[Virtual]" 
                    :slides-per-view="1" 
                    :space-between="0"
                    :loop="true"
                    >
                    <swiper-slide
                        v-for="(slideContent, index) in slides"
                        :key="index"
                        :virtualIndex="index"
                        :style="setStyleProperties(index)"
                    >
                        {{slideContent}}
                    </swiper-slide>
                    <!-- <swiper-slide>
                        Фото 2
                    </swiper-slide>
                    <swiper-slide>
                        Фото 3
                    </swiper-slide> -->
                </swiper>

                <!-- Описание рецепта -->
                <ion-item-group class="ion-margin-bottom ion-padding-horizontal">
                    <!-- Заголовок -->
                    <ion-text>
                        <h4>Описание</h4>
                    </ion-text>

                    <!--style="border-bottom: 1px solid var(--ion-color-light); padding-bottom: 0.8rem;"  -->
                    <ion-textarea
                        color="medium"
                        class="ion-no-padding ion-margin-top" 
                        placeholder="Не указано"
                        autoGrow="true" 
                        autocapitalize="on"
                        v-model="recipeDescription"
                    ></ion-textarea>
                </ion-item-group>

                <!-- Индикатор достатка ингредиентов на складе -->
                <ion-item-group class="ion-padding-horizontal">
                    <!-- ДОСТАТОЧНО ингредиентов -->
                    <!-- <ion-chip color="success" class="ion-no-margin">
                        <ion-label>
                            Все ингредиенты в наличии
                        </ion-label>
                        <ion-icon :icon="checkmark"></ion-icon>
                    </ion-chip> -->

                    <!-- НЕДОСТАТОЧНО ингредиентов -->
                    <ion-chip color="danger" class="ion-no-margin">
                        <ion-label>
                            Недостаточно ингредиентов
                        </ion-label>
                        <ion-icon :icon="alertOutline"></ion-icon>
                    </ion-chip>
                </ion-item-group>
                
                <!-- СОСТАВ -->
                <ion-item-group class="ion-padding-horizontal">
                    <!-- Заголовок -->
                    <ion-grid class="ion-no-padding">
                        <ion-row class="ion-justify-content-between ion-align-items-center ion-margin-vertical">
                            <!--  -->
                                <h4 class="ion-no-margin">Состав</h4>
                            <!--  -->
                            <ion-icon v-if="!editComposition" :icon="createOutline" color="primary" style="font-size: 1.4rem;" @click.stop="editComposition = true"></ion-icon>
                            <!--  -->
                            <ion-icon v-else :icon="createOutline" color="warning" style="font-size: 1.4rem;" @click.stop="editCompositionFunc()"></ion-icon>
                        </ion-row>
                    </ion-grid>

                    <!--  -->
                    <div>
                        <!-- 
                            Чайная ложка – 5 мл это примерно 5 грамм
                            Десертная ложка — 10 мл жидкости — 10 грамм
                            Столовая ложка — 15 мл жидкости — 15 грамм
                            Щепотка – 2-4 грамма
                        -->
                        <!-- Элементы состава -->
                        <div v-for="(element, n) in currentRecipe.composition" :key="n" >
    
                            <!-- Названия элемента состава -->
                            <ion-item class="ion-no-padding">
                                <ion-icon v-if="editComposition" :icon="closeCircleOutline" style="margin-right: 0.4rem; min-width: 17px;" color="danger" @click.stop="openDeleteCompositionItemMenu(n)"></ion-icon>
                                <ion-text color="primary" @click.stop="expendList(`ri + ${n}`)">
                                    {{(n + 1)}}. {{element.name}}
                                </ion-text>
                            </ion-item>
    
                            <!-- Ингредиенты элемента -->
                            <div :id="`ri + ${n}`" style="display: none">
                                <!-- перебор массива ингредиентов -->
                                <div v-for="(ingredient, idx) in element.ingredients" :key="idx" lines="none" class="ion-no-padding" style="margin-top: 1rem;">
                                    <!-- в режиме редактирования -->
                                    <ion-item-sliding v-if="editComposition">
                                        <ion-item lines="none" style="--inner-padding-end: none">
                                            <ion-grid class="ion-no-padding">
                                                <ion-row class="ion-justify-content-between ion-align-items-center" style="flex-wrap: nowrap;">
                                                    <div style="display: flex; flex-direction: column;">
                                                        <ion-text>{{ingredient.name}} ({{setMeasure(ingredient.costEstimation)}})</ion-text>
                                                        <div style="display: flex; align-items: center; margin-top: 0.5rem;">
                                                            <ion-text color="medium" class="ion-margin-end" style="font-size: 1rem;">Укажите кол-во:</ion-text>
                                                            <ion-input style="font-size: 1.3rem; font-weight: bold;" v-model="ingredient.value" @ionBlur="updateComposition()" class="ion-no-padding" color="primary"></ion-input>
                                                        </div>
                                                    </div>
                                                    <ion-thumbnail class="thumbnail_deal-subject" style="background-color: var(--ion-color-light); border: 1px solid var(--ion-color-danger)">
                                                        <ion-img :src="setImgSrc(ingredient.name, ingredient.costEstimation)"></ion-img>
                                                    </ion-thumbnail>
                                                </ion-row>
                                            </ion-grid>
                                        </ion-item>
                                        <ion-item-options side="end">
                                            <ion-item-option class="ion-margin-start" color="danger">
                                                <ion-icon slot="icon-only" :icon="trash"></ion-icon>
                                            </ion-item-option>
                                        </ion-item-options>
                                    </ion-item-sliding>
                                    <!-- без режима редактирования -->
                                    <ion-grid v-else class="ion-no-padding">
                                        <ion-row class="ion-justify-content-between ion-align-items-center" style="flex-wrap: nowrap;">
                                            <div style="display: flex; flex-direction: column;" class="ion-padding-start">
                                                <ion-text>{{ingredient.name}}</ion-text>
                                                <ion-text color="medium" style="margin-top: 0.5rem">
                                                    <span style="font-size: 1.3rem; font-weight: bold">{{ingredient.value}} </span> / 250 {{setMeasure(ingredient.costEstimation)}}
                                                </ion-text>
                                            </div>
                                            <ion-thumbnail class="thumbnail_deal-subject" style="background-color: var(--ion-color-light); border: 1px solid var(--ion-color-danger)">
                                                <ion-img :src="setImgSrc(ingredient.name, ingredient.costEstimation)"></ion-img>
                                            </ion-thumbnail>
                                        </ion-row>
                                    </ion-grid>
                                </div>
                                <!-- кнопка добавления нового ингредеиента к определенному элементу состава -->
                                <!-- <ion-chip v-if="editComposition" class="ion-no-margin ion-margin-top" color="primary">Добавить</ion-chip> -->
                                <div v-if="editComposition" class="ion-margin-vertical" @click.stop="addCompositionItemIngredient()">
                                    <ion-text color="primary" class="ion-margin-start button-add-ingredient">Добавить ингредиент</ion-text>
                                </div>
                            </div>

                        </div>

                        <!-- Кнопка ДОБАВИТЬ Элемент к составу -->
                        <ion-grid class="ion-no-padding" v-if="editComposition">
                            <ion-row class="ion-justify-content-end">
                                <ion-chip class="ion-no-margin ion-margin-top" color="primary" @click.stop="addCompositionItem()">Добавить</ion-chip>
                            </ion-row>
                        </ion-grid>
                    </div>

                    <!-- всплывашка подтверждения удаления composition item -->
                    <ion-action-sheet
                        :isOpen="deleteCompositionItem"
                        header="Удалить позицию из состава"
                        :buttons="deleteCopmositionItemButtons"
                        @didDismiss="deleteCompositionItem = false"
                    ></ion-action-sheet>
                </ion-item-group>

                <!-- ПРОЦЕСС -->
                <ion-item-group class="ion-padding-vertical">
                    <!-- Заголовок -->
                    <ion-grid class="ion-no-padding">
                        <ion-row class="ion-justify-content-between ion-align-items-center ion-margin-vertical">
                            <h4 class="ion-no-margin ion-margin-start">Процесс приготовления</h4>
                            <!--  -->
                            <ion-icon v-if="!editRecipeProcess" :icon="createOutline" color="primary" style="font-size: 1.4rem;" class="ion-margin-end" @click.stop="editRecipeProcess = true"></ion-icon>
                            <!--  -->
                            <ion-icon v-else :icon="createOutline" color="warning" style="font-size: 1.4rem;" class="ion-margin-end" @click="editRecipeProcessFunc()"></ion-icon>
                        </ion-row>
                    </ion-grid>

                    <!-- Контент -->
                    <ion-list>
                        <ion-reorder-group :disabled="!editRecipeProcess" @ionItemReorder="handleReorderProcess($event)">
                            <ion-item v-for="(step, index) in steps" :key="index" style="position: relative;">
                                <!-- Кнопка удалить current step -->
                                <ion-icon v-if="editRecipeProcess" :icon="closeCircleOutline" color="danger" @click.stop="openDeleteStepsMenu(index)" style="margin: auto 0;"></ion-icon>
                                <!-- В режиме редактирования -->
                                <ion-textarea v-if="editRecipeProcess" v-model="step.text" auto-grow="true" class="ion-padding-start" placeholder="Опишите действие" autocapitalize="on" rows="1" @ionBlur="updateProcess()"></ion-textarea>
                                <!-- Без режима редактирования -->
                                <ion-text v-else class="ion-margin-vertical" color="medium">{{ index + 1 }}. {{step.text}}</ion-text>
                                <!-- ползунок реордера -->
                                <ion-reorder slot="end" style="margin: auto 0;"></ion-reorder>
                            </ion-item>
                        </ion-reorder-group>
                    </ion-list>

                    <!-- Кпнока ДОБАВИТЬ ШАГ -->
                    <ion-grid class="ion-padding-horizontal" v-if="editRecipeProcess">
                        <ion-row class="ion-justify-content-end">
                            <ion-chip class="ion-no-margin ion-margin-top" color="primary" @click.stop="addProcessStep()">Добавить</ion-chip>
                        </ion-row>
                    </ion-grid>

                    <!-- Всплывашка подтверждение удаления item в сборке -->
                    <ion-action-sheet
                        :isOpen="deleteProcessStep"
                        header="Удалить шаг из процесса"
                        :buttons="deleteProcessStepButtons"
                        @didDismiss="deleteProcessStep = false"
                    ></ion-action-sheet>
                </ion-item-group>
                
                <!-- СБОРКА -->
                <ion-item-group class="ion-padding-top">
                    <!-- Заголовок -->
                    <ion-grid class="ion-no-padding">
                        <ion-row class="ion-justify-content-between ion-align-items-center">
                            <div>
                                <h4 class="ion-padding-horizontal ion-no-margin">Сборка</h4>
                                <ion-text class="ion-padding-horizontal" color="medium">Осуществляем сборку по порядку</ion-text>
                            </div>
                            <ion-icon :icon="createOutline" :color="reorderIsDisabled ? 'primary' : 'warning'" style="font-size: 1.4rem;" class="ion-margin-end" @click="toggleReorder()"></ion-icon>
                        </ion-row>
                    </ion-grid>
                    
                    <!-- Контент -->
                    <ion-list class="ion-margin-top">
                        <ion-reorder-group :disabled="reorderIsDisabled" @ionItemReorder="handleReorder($event)">
                            <ion-item v-for="(item, index) in currentRecipe.assembling" :key="index">
                                <ion-label>
                                    <ion-grid class="ion-no-padding">
                                        <ion-row class="ion-align-items-center" style="flex-wrap: nowrap;">
                                            <!-- Кнопка удалить current item -->
                                            <ion-icon v-if="!reorderIsDisabled" :icon="closeCircleOutline" color="danger" style="margin-right: 0.4rem; min-width: 17px;" @click.stop="openDeleteAssemblingItemMenu(index)"></ion-icon>
                                            <!-- current item -->
                                            <ion-text>{{ index + 1 }}. {{ item }}</ion-text>
                                        </ion-row>
                                    </ion-grid>
                                </ion-label>
                                <ion-reorder slot="end"></ion-reorder>
                            </ion-item>
                        </ion-reorder-group>
                    </ion-list>

                    <!-- Кпнока ДОБАВИТЬ ШАГ -->
                    <ion-grid class="ion-no-padding" v-if="!reorderIsDisabled">
                        <ion-row class="ion-justify-content-end">
                            <ion-chip class="ion-no-margin ion-margin-top ion-margin-end" color="primary" @click.stop="addAssemblingElement()">Добавить</ion-chip>
                        </ion-row>
                    </ion-grid>

                    <!-- Всплывашка подтверждение удаления item в сборке -->
                    <ion-action-sheet
                        :isOpen="deleteAssemblingItem"
                        header="Удалить элемент сборки"
                        :buttons="deleteAssemblingItemButtons"
                        @didDismiss="deleteAssemblingItem = false"
                    ></ion-action-sheet>
                </ion-item-group>

                <!-- Модалка добавления item + ingredients к составу -->
                <ion-modal :isOpen="addCompositionItemModalOpened">
                    <!--  -->
                    <ion-header translucent="true">
                        <ion-toolbar>
                            <ion-buttons slot="start">
                                <ion-button @click.stop="addCompositionItemModalOpened = false; newCompositionItem = {}">Отменить</ion-button>
                            </ion-buttons>
                            <ion-title>Добавить к составу</ion-title>
                            <ion-buttons slot="end"></ion-buttons>
                        </ion-toolbar>
                    </ion-header>
                    <!--  -->
                    <ion-content forceOverscroll="false" class="ion-margin-top">
                        {{newCompositionItem}}
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident tempora consequatur fuga nam ipsa nostrum accusantium blanditiis optio libero rerum earum, dolores ex repudiandae dolor suscipit tenetur id quis harum assumenda iusto deserunt reprehenderit natus doloribus molestias. Distinctio rerum a sunt animi totam repellat recusandae consequuntur nobis, aspernatur porro ipsum soluta temporibus ullam ea, dolore fugiat, ipsa est rem dignissimos! Nostrum aliquid sint harum odio sit minus autem exercitationem assumenda voluptate non cupiditate iusto, explicabo nulla neque mollitia, corporis repellendus laudantium quod in eaque dolorum consequatur. Dicta consectetur quisquam repellendus, temporibus dignissimos quo placeat laboriosam esse dolores quia perferendis quidem!
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Neque rerum eveniet culpa quaerat, doloribus eum illo laudantium quia officia sit veritatis, quibusdam nihil, facere laborum iure aliquid reiciendis architecto omnis ipsum beatae iusto saepe. Fugit eius perspiciatis aliquid voluptate asperiores nesciunt itaque, corrupti rem blanditiis, ipsam numquam deleniti dolor dignissimos nostrum illo maiores assumenda in ea obcaecati architecto. Accusantium temporibus dolor perferendis dolorum nostrum nulla perspiciatis dolore libero nesciunt a. Quibusdam eius, maxime, libero illum, repellat nemo nam quasi rem perferendis provident quos? Unde veniam soluta quod temporibus porro optio repudiandae enim placeat repellendus voluptate ratione ut minima quae cum iste architecto, corporis quas dolor? Dolorem laborum vero, optio cum non debitis doloribus corrupti tempore similique? Saepe velit dignissimos facilis pariatur repudiandae illum sequi nemo error iure, qui deleniti iusto, hic ab! Maxime reiciendis iusto repellendus animi similique, esse dolor expedita quidem laborum suscipit magni eveniet labore? Libero, culpa sunt, voluptatibus veniam voluptas in incidunt nisi itaque impedit, quis nesciunt enim? Ratione sapiente, incidunt unde rem, repellat nemo aspernatur numquam ipsum libero odio a fugit magnam facilis dolorem, voluptatem velit eos alias. Dolores at maxime distinctio reprehenderit quasi. Iure praesentium libero debitis autem quod voluptatum inventore nesciunt numquam? Hic, quia sapiente. Quaerat, cumque culpa! Iusto eos velit est totam recusandae maxime ullam consequatur accusamus blanditiis illum molestias quos reprehenderit tenetur inventore soluta accusantium dolorem ipsa odio fugiat repellendus quaerat eum, quae praesentium. Esse sapiente vitae saepe numquam, dignissimos laboriosam voluptas hic consectetur suscipit nam deleniti blanditiis asperiores officiis ea! Voluptate, voluptatibus rem dolorum eum pariatur, temporibus saepe fugit magnam illo veniam quae earum, non id velit nisi beatae enim omnis. Doloribus, voluptates dolorum ducimus in reprehenderit dignissimos sint tempore quod autem beatae accusamus. Doloremque dolores debitis iusto? Doloremque, eveniet sed voluptate, nulla repellat veniam necessitatibus itaque perferendis rerum ut dignissimos modi sunt accusantium commodi sint placeat debitis consequatur voluptates! Odio quod vel, alias eaque magni quasi repellendus impedit possimus a excepturi id consequatur illo quibusdam explicabo culpa ab dolores, aperiam voluptas non, eius nihil enim? Ducimus sunt molestiae impedit minima ab. Vel molestiae perspiciatis minima maiores, incidunt voluptas ducimus quam, officiis ut quaerat doloribus non recusandae sit unde voluptate. Asperiores enim repellat quam consequuntur eaque aperiam explicabo, numquam repudiandae mollitia similique optio sint, totam laboriosam pariatur amet sit, voluptas minima! At est dolore modi assumenda. Veniam ducimus excepturi fugit! Laborum aliquid velit mollitia excepturi, consequatur iure sit ratione quasi sequi nulla corrupti molestiae ab modi minus, dolor, non iusto laudantium? Magnam laudantium deserunt officiis explicabo nemo ullam harum delectus optio maxime dolorem consequatur a ea ad repellendus fugiat porro perspiciatis corporis, molestiae repellat distinctio magni unde. Accusantium ullam ab odio laudantium, nesciunt enim labore ad magnam molestias eos excepturi voluptatem tempora quidem numquam sapiente. In deleniti nobis dolor dignissimos magnam ad harum animi, blanditiis, voluptatum sed odit. Quasi, quisquam aliquid, voluptate fuga odit hic sit mollitia expedita odio voluptatem magnam id deleniti ex error. Eveniet dicta quidem atque voluptate, blanditiis unde possimus, aliquam minima eius laborum debitis tenetur tempora sunt, ipsa alias? Culpa ut, quaerat rerum facere est distinctio labore, pariatur voluptates harum velit voluptatibus blanditiis facilis itaque vitae ratione placeat eaque aut. Fuga laboriosam omnis aliquid voluptas placeat beatae, recusandae, ut doloremque, hic incidunt nemo. Amet, cumque labore consequuntur quis mollitia nulla et. Esse, dolorem nobis delectus voluptas aut distinctio. Accusamus explicabo repudiandae ipsam dolorum ratione unde excepturi eaque. Mollitia totam rerum, excepturi aperiam facilis cupiditate saepe ex ratione ipsam quidem inventore rem distinctio? Obcaecati fugit dolorem commodi facere, tempora laborum rem quibusdam, accusamus iusto ipsa quia voluptatibus ullam iure culpa molestias incidunt ea recusandae velit debitis labore? Repellat, corporis. Magni, omnis veniam exercitationem sunt quas doloremque error at earum, quasi repellat reprehenderit ea illo id corrupti. Temporibus nostrum consectetur earum sit? Tempora magni et eius nesciunt nam illo, obcaecati dicta eligendi optio non repellendus cupiditate quis aliquid consequatur soluta quo cum explicabo voluptate fugit voluptatum modi nobis? Dolore possimus ipsam, cupiditate saepe nam ut illum inventore perferendis sequi earum! Totam cumque obcaecati accusantium modi voluptas magnam nemo tempora nam illo quos, rem impedit, eveniet tenetur aut aliquid dolor earum cupiditate. Nisi mollitia sint excepturi assumenda placeat tempore et illo facilis. Distinctio, dolore! Temporibus quidem cupiditate corporis, autem corrupti ut maiores ea amet optio provident possimus, rerum libero nobis, dignissimos vitae tempora similique! Autem, praesentium veritatis assumenda quasi nisi, beatae quam dicta nesciunt blanditiis non dolorem explicabo molestiae quas dignissimos odit eos earum aut fugiat odio sequi. Quia tenetur amet, consequatur quo iure dolorum perspiciatis exercitationem eligendi deserunt provident autem itaque quod vel facilis vero! Blanditiis quos culpa officia illum dolorem corporis saepe. Veniam ea nesciunt illo quo accusamus amet inventore ratione, perferendis dolorum sunt, magnam, maxime ad consectetur officia repellat esse id culpa? Possimus blanditiis nobis id adipisci? Repellat incidunt eius quod nam ipsam architecto animi, illum non tenetur ipsa alias possimus iste obcaecati! Omnis voluptate distinctio autem, obcaecati accusantium, ratione optio voluptates minima ea magni quaerat esse facere ipsam reprehenderit nam? Earum molestiae dolorem maxime neque repellendus similique, voluptatibus repellat odio placeat nihil distinctio dolore dicta. Autem impedit ab minus iste debitis corrupti, sit sint ipsa modi odit quia aliquam libero nemo ad nostrum aspernatur. Aspernatur iure porro itaque dolore facilis, praesentium ipsam impedit dolorum mollitia quod doloribus commodi harum? Animi officiis quod doloremque earum suscipit ad! Vel, repellat nam! Placeat adipisci atque at nam corrupti vitae, quo dolore, rerum ullam hic pariatur enim sint. Dolorum maxime consequuntur illum exercitationem rerum at natus magnam ipsum, aliquam id pariatur, odit saepe culpa cum provident iure cumque vitae temporibus? Nostrum, maiores dolorem. Ex voluptas repellat neque dignissimos facilis quasi quos ut voluptates vitae. Odio mollitia iste consectetur eaque quis atque praesentium cumque laboriosam quisquam, animi deserunt, explicabo nostrum omnis. Quasi quas eius, recusandae, exercitationem non sapiente iure sed natus id dolorum nisi quam eaque ratione rem. Odio eveniet asperiores, possimus recusandae nobis similique modi debitis placeat error quod saepe rerum? Id corporis, minima numquam, facere omnis aliquam alias voluptatum cum obcaecati totam beatae voluptates, quia corrupti nostrum error ratione!
                        </p>
                        <!--  -->
                        <div style="position: fixed; bottom: 0; left: 0; width: 100%; background-color: #fff; z-index: 999999" class="ion-padding">
                            <ion-button @click.stop="addNewCompositionItem(newCompositionItem)" :color="newCompositionItem.name === '' ? 'light' : 'primary'" expand="block">Добавить</ion-button>
                        </div>
                    </ion-content>
                </ion-modal>

                <!-- Модалка добавления item к сборке -->
                <ion-modal :isOpen="addAssemblingElementModalOpened">
                    <!--  -->
                    <ion-header translucent="true">
                        <ion-toolbar>
                            <ion-buttons slot="start">
                                <ion-button @click="addAssemblingElementModalOpened = false">Отменить</ion-button>
                            </ion-buttons>
                            <ion-title>Добавить к сборке</ion-title>
                            <ion-buttons slot="end"></ion-buttons>
                        </ion-toolbar>
                    </ion-header>
                    <!--  -->
                    <ion-content forceOverscroll="false" class="ion-margin-top">
                        <ion-item v-for="(item, index) in currentRecipe.composition" :key="index" @click.stop="addToAssembling(item.name)">
                            {{item.name}}
                        </ion-item>
                    </ion-content>
                </ion-modal>

                <!-- Вкл / Выкл на продажу в магазин рецептов -->
                <ion-item-group class="ion-padding-vertical ion-padding-horizontal">
                    <!-- Заголовок -->
                    <ion-text>
                        <h4>Продажа рецептов</h4>
                    </ion-text>
                    <!--  -->
                    <ion-grid class="ion-no-padding">
                        <ion-row class="ion-justify-content-between ion-align-items-center">
                            <ion-text color="medium">
                                Выставлен на продажу
                            </ion-text>
                            <ion-toggle color="success"></ion-toggle>
                        </ion-row>
                    </ion-grid>
                </ion-item-group>

                <!-- Модалка выбора категори -->
                <ion-modal :isOpen="searchRecipesCategoriesMenu">

                    <!-- Поиск -->
                    <ion-searchbar
                    class="ion-text-left"
                    placeholder="Поиск..."
                    v-model="searchRecipesCategories"
                    show-cancel-button="always"
                    cancelButtonText="Отменить"
                    @ionCancel="searchRecipesCategoriesMenu = false"
                    ></ion-searchbar>

                    <!-- Контент -->
                    <ion-content style="height: 90vh">
                    <!-- Если есть данные -->
                    <ion-item v-for="(category) in searchedRecipesCategories" :key="category.id" @click="choosenCategory(category)">
                        <ion-grid class="ion-no-padding">
                            <ion-row class="ion-justify-content-between ion-align-items-center">
                                <ion-text>{{ category }}</ion-text>
                            </ion-row>
                        </ion-grid>
                    </ion-item>
                    
                    <!-- Если ничего подходящего нет или нет данных -->
                    <div v-if="searchedRecipesCategories.length <= 0" class="ion-margin-top ion-margin-horizontal">
                    <!-- <div v-if="searchedRecipesCategories.length <= 0" class="ion-margin-top ion-margin-horizontal"> -->
                        <ion-grid class="ion-no-padding">
                        <ion-row class="ion-justify-content-between ion-align-items-center">
                            <ion-text color="medium">Ничего не найдено</ion-text>
                        </ion-row>
                        </ion-grid>
                    </div>
                    
                    </ion-content>
                </ion-modal>

                <!-- Кнопка удалить РЕЦЕПТ -->
                <ion-grid>
                    <ion-row class="ion-justify-content-center">
                        <ion-button fill="clear" color="danger" @click="openDeleteMenu">Удалить рецепт</ion-button>
                    </ion-row>
                </ion-grid>

                <!-- Всплывашка подтверждение удаления рецепта -->
                <ion-action-sheet
                    :is-open="isOpenRef"
                    header="Вы точно хотите удалить рецепт?"
                    @didDismiss="isOpenRef = false"
                    :buttons="deleteCurrentRecipeButtons"
                ></ion-action-sheet>

                <br>
                {{currentRecipe}}
            </div>

        </ion-content>
    </div>
</template>

<script>
    import { defineComponent, ref, watch, onMounted, computed } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { supabase } from '../../supabase/init';
    import store from '../../store/index';
    //
    import { IonContent, IonItemGroup, IonButton, IonActionSheet, IonGrid, IonRow, IonToggle, IonInput, IonText, IonItem, IonChip, IonIcon, IonTextarea, IonLabel, IonThumbnail, IonImg, IonModal, IonSearchbar, IonList, IonReorderGroup, IonReorder, IonItemSliding, IonItemOptions, IonItemOption, IonHeader, IonToolbar, IonButtons, IonTitle } from '@ionic/vue';
    import { closeCircleOutline, checkmark, alertOutline, createOutline, trash } from 'ionicons/icons'
    //
    import 'swiper/css';
    import '@ionic/vue/css/ionic-swiper.css';
    import { Swiper, SwiperSlide } from 'swiper/vue';
    import { Virtual } from 'swiper';
    //
    import Spinner from '../../components/Spinner.vue';
    import ViewHeader from '../../components/headers/HeaderViewCurrent.vue';
    //
    import { searchWarehouseCategoryFilter } from '../../helpers/filterWarehouseCategories';
    import { sortAlphabeticallyWarhouseItem } from "../../helpers/sortDealSubject";

    export default defineComponent({
        name: 'View-recipe',
        components: {
            ViewHeader, Spinner,
            //
            IonContent, IonItemGroup, IonButton, IonActionSheet, IonGrid, IonRow, IonToggle, IonInput, IonText, IonItem, IonChip, IonIcon, IonTextarea, IonLabel, IonThumbnail, IonImg, IonModal, IonSearchbar, IonList, IonReorderGroup, IonReorder, IonItemSliding, IonItemOptions, IonItemOption, IonHeader, IonToolbar, IonButtons, IonTitle,
            //
            Swiper, SwiperSlide
        },
        setup() {
            //
            const route = useRoute();
            const router = useRouter();
            // Get current info of route
            const currentId = route.params.recipeId;
            const info = route.params;
            // console.log(info.recipeId)
            const currentRecipe = ref(JSON.parse(info.recipe))
            // Массив пользователя с вариантам категорий для рецептов
            const userRecipesCategories = ref()
            //
            const spinner = ref(null);
            //
            const isOpenRef = ref(false)
            //
            onMounted(() => {
                userRecipesCategories.value = store.state.recipesCategoriesArray
            })
            //
            const openDeleteMenu = () => {
                isOpenRef.value = true
            }
            const deleteCurrentRecipeButtons = [
                {
                    text: 'Удалить',
                    role: 'destructive',
                    data: {
                        type: 'delete'
                    },
                    handler: () => {
                        deleteCurrentRecipe()
                    }
                },
                {
                    text: 'Отменить',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked')
                    }
                }
            ] 
            const deleteCurrentRecipe = async () => {
                // console.log(currentId)
                try {
                    const { error } = await supabase.from('userRecipes').delete().eq('id', currentId)
                    if(error) throw error
                    //router.push({ name: 'Recipes' })
                    router.go(-1)
                    alert('Wiew Recipe: Рецепт удален из книги')
                } catch (error) {
                    // Удалить если не понадобится
                    // alert(`Error: ${error.message}`)
                }
            }
            //
            const recipeName = ref(currentRecipe.value.name)
            watch(recipeName, async () => {
                // console.log(recipeName.value)
                currentRecipe.value.name = recipeName.value
                currentRecipe.value.value = recipeName.value
                // 
                spinner.value = true;
                try {
                    // Вынести в store?
                    // console.log(`Deal ${currentId} is updated`);
                    //
                    const {error} = await supabase.from('userRecipes').update({
                        name: currentRecipe.value.name,
                        value: currentRecipe.value.value
                    }).eq('id', info.recipeId);
                    if(error) throw error;
                    spinner.value = false;
                    // Дело успешно обновлено
                } catch (error) {
                    // alert(`Error: ${error.message}`)
                }
            })
            // 
            const recipeDescription = ref(currentRecipe.value.recipeDescription)
            watch(recipeDescription, async () => {
                currentRecipe.value.recipeDescription = recipeDescription.value
                // 
                spinner.value = true;
                try {
                    // Вынести в store?
                    // console.log(`Deal ${currentId} is updated`);
                    //
                    const {error} = await supabase.from('userRecipes').update({
                        recipeDescription: currentRecipe.value.recipeDescription
                    }).eq('id', info.recipeId);
                    if(error) throw error;
                    spinner.value = false;
                    // Дело успешно обновлено
                } catch (error) {
                    // alert(`Error: ${error.message}`)
                }
            })
            //
            const steps = ref(currentRecipe.value.process)
            //
            // ============================ Удаление категории у предмета ===============================================
            // Вызываем action sheet уведомление в качестве подтверждения
            const deleteCategory = ref(false);
            // Храним категорию предмета к удалению
            const categoryToDelete = ref();
            //удаляем current category в предмете (обнолвений в БД здесь не производится)
            const openDeleteCategoryModal = (category) => {
                categoryToDelete.value = category;
                deleteCategory.value = true
            }
            const deleteCategoruFunc = async (category) => {
                currentRecipe.value.categories = currentRecipe.value.categories.filter(item => item !== category)
                // 
                spinner.value = true;
                try {
                    const {error} = await supabase.from('userRecipes').update({
                        categories: currentRecipe.value.categories
                    }).eq('id', info.recipeId);
                    if(error) throw error;
                    spinner.value = false;
                    // Рецепт успешно обновлено
                } catch (error) {
                    // alert(`Error: ${error.message}`)
                }
            }
            //
            const deleteCategoryButtons = [
                {
                    text: 'Удалить',
                    role: 'destructive',
                    data: {
                        type: 'delete'
                    },
                    handler: () => {
                        deleteCategoruFunc(categoryToDelete.value)
                    }
                },
                {
                    text: 'Отменить',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked')
                    }
                }
            ]

            //
            const expendList = (el) => {
                let item = document.getElementById(el)
                if(item) {
                    item.style.display == 'none' ? item.style.display = 'block' : item.style.display = 'none'
                }
                // console.log(document.getElementById(el))
            }
            //
            const setImgSrc = (recipeName, costEstimation) => {
                let dealBuySubjectArray = store.state.dealBuySubjectArray
                let ingredientValue;
                dealBuySubjectArray.filter(item => {
                    if(item.name === recipeName && item.costEstimation === costEstimation) {
                        ingredientValue = item.value
                    }
                })
                // console.log(ingredientValue) 
                return `../img/subjects/buy/${ingredientValue}.webp`
            }

            //
            const searchRecipesCategoriesMenu = ref(false);
            const searchRecipesCategories = ref('');
            // ПОЛЬЗОВАТЕЛЬСКИЕ КАТЕГОРИИ
            const searchedRecipesCategories = computed(() => {
                const sortedRecipesCategoriesArray = sortAlphabeticallyWarhouseItem(userRecipesCategories.value)
                return searchWarehouseCategoryFilter(sortedRecipesCategoriesArray, searchRecipesCategories.value)
            })
            // Проверяем добавлена уже категория к предмету или нет
            const isCategoryAlreadyAdded = ref();
            // Переменная для категории к добавлению
            const newCategory = ref()
            const choosenCategory = async (category) => {
            isCategoryAlreadyAdded.value = currentRecipe.value.categories.find(item => item === category)
                if(isCategoryAlreadyAdded.value !== undefined) {
                    alert('NewRecipe-modalCreate: категория уже добавлена к рецепту')
                } else if (currentRecipe.value.categories.length >= 3) {
                    alert('NewRecipe-modalCreate: Вы добавили максимально количество категорий')
                } else {
                    searchRecipesCategories.value = ''
                    searchRecipesCategoriesMenu.value = false
                    newCategory.value = category
                    console.log(newCategory.value)
                    currentRecipe.value.categories.push(newCategory.value)
                }
                // 
                spinner.value = true;
                try {
                    const {error} = await supabase.from('userRecipes').update({
                        categories: currentRecipe.value.categories
                    }).eq('id', info.recipeId);
                    if(error) throw error;
                    spinner.value = false;
                    // Рецепт успешно обновлено
                } catch (error) {
                    // alert(`Error: ${error.message}`)
                }
            }

            //
            const setMeasure = (costEstimation) => {
                if(costEstimation === 'perKilogram') {
                    return 'гр.'
                } else if(costEstimation === 'perUnit') {
                    return 'шт.'
                } else if(costEstimation === 'teaSpoon') {
                    return 'ч.л.'
                } else if (costEstimation === 'pinch') {
                    return 'щепотки'
                } else if (costEstimation === 'stick') {
                    return 'палочки'
                }
            }

            //
            const slides = ref(['slide 1', 'slide 2', 'slide 3'])
            const setStyleProperties = (index) => {
                return `height: 300px; background-color: #${index}${index}${index}; color: white`
            }

            //
            const addProcessStep = () => {
                // alert('ViewRecipe: добавление этапов процесса - в разработке...')
                currentRecipe.value.process.push({
                    text: ''
                })
            }

            //
            const addAssemblingElementModalOpened = ref(false)
            const addAssemblingElement = () => {
                // alert('ViewRecipe: добавление элемента к сборке - в разработке...')
                addAssemblingElementModalOpened.value = true;
            }
            const addToAssembling = async (itemName) => {
                currentRecipe.value.assembling.push(itemName)
                spinner.value = true;
                try {
                    const {error} = await supabase.from('userRecipes').update({
                        assembling: currentRecipe.value.assembling
                    }).eq('id', info.recipeId);
                    if(error) throw error;
                    spinner.value = false;
                    // Рецепт успешно обновлено
                } catch (error) {
                    // alert(`Error: ${error.message}`)
                }
                addAssemblingElementModalOpened.value = false;
            }

            //
            const reorderIsDisabled = ref(true);
            const toggleReorder = () => {
                reorderIsDisabled.value = !reorderIsDisabled.value
            }
            const handleReorder = async (event) => {
                console.log('Dragged from index', event.detail.from, 'to', event.detail.to);
                currentRecipe.value.assembling = event.detail.complete(currentRecipe.value.assembling);
                //
                spinner.value = true;
                try {
                    const {error} = await supabase.from('userRecipes').update({
                        assembling: currentRecipe.value.assembling
                    }).eq('id', info.recipeId);
                    if(error) throw error;
                    spinner.value = false;
                    // Рецепт успешно обновлено
                } catch (error) {
                    // alert(`Error: ${error.message}`)
                }
            }

            // ============================== УДАЛЕНИЕ ЭЛЕМЕНТА В СПИСКЕ СБОРКИ ==================================
            // Вызываем action sheet уведомление в качестве подтверждения
            const deleteAssemblingItem = ref(false);
            // Храним элементы сборки рецепта к удалению
            const assemblingItemToDeleteIndex = ref();
            //Открываем меню подтверждения удаления
            const openDeleteAssemblingItemMenu = (index) => {
                assemblingItemToDeleteIndex.value = index;
                deleteAssemblingItem.value = true;
            }
            // функционал кнопок в меню подветрждения удаления элементы сборки
            const deleteAssemblingItemButtons = [
                {
                    text: 'Удалить',
                    role: 'destructive',
                    data: {
                        type: 'delete'
                    },
                    handler: () => {
                        deleteAssemblingItemFunc(assemblingItemToDeleteIndex.value)
                    }
                },
                {
                    text: 'Отменить',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked')
                    }
                }
            ]            
            // функция удаления элемента
            const deleteAssemblingItemFunc = async (index) => {
                if(index > -1) {
                    currentRecipe.value.assembling.splice(index, 1)
                    //
                    spinner.value = true;
                    try {
                        const {error} = await supabase.from('userRecipes').update({
                            assembling: currentRecipe.value.assembling
                        }).eq('id', info.recipeId);
                        if(error) throw error;
                        spinner.value = false;
                        // Рецепт успешно обновлено
                    } catch (error) {
                        // alert(`Error: ${error.message}`)
                    }
                }
            }

            // =============================== УДАЛЕНИЯ ШАГА В СПИСКЕ ПРОЦЕССА ПРИГОТОВЛЕНИЯ ==========================
            // Вызываем action sheet уведомление в качестве подтверждения
            const deleteProcessStep = ref(false);
            // Храним step из списка шагов процесса приготовления к удалению
            const processStepToDeleteIndex = ref();
            const openDeleteStepsMenu = (index) => {
                processStepToDeleteIndex.value = index;
                deleteProcessStep.value = true;
            }
            // кнопки в меню подтверждения удаления шага из процесса
            const deleteProcessStepButtons = [
                {
                    text: 'Удалить',
                    role: 'destructive',
                    data: {
                        type: 'delete'
                    },
                    handler: () => {
                        deleteProcessStepFunc(processStepToDeleteIndex.value)
                    }
                },
                {
                    text: 'Отменить',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked')
                    }
                }
            ]
            //
            const deleteProcessStepFunc = async (index) => {
                if(index > -1) {
                    currentRecipe.value.process.splice(index, 1)
                    //
                    spinner.value = true;
                    try {
                        const {error} = await supabase.from('userRecipes').update({
                            process: currentRecipe.value.process
                        }).eq('id', info.recipeId);
                        if(error) throw error;
                        spinner.value = false;
                        // Рецепт успешно обновлено
                    } catch (error) {
                        // alert(`Error: ${error.message}`)
                    }
                }
            }

            //
            const editRecipeProcess = ref(false)
            const editRecipeProcessFunc = () => {
                editRecipeProcess.value = !editRecipeProcess.value
                //
                // spinner.value = true;
                // try {
                //     const {error} = await supabase.from('userRecipes').update({
                //         process: currentRecipe.value.process
                //     }).eq('id', info.recipeId);
                //     if(error) throw error;
                //     spinner.value = false;
                // } catch (error) {
                //     // alert(`Error: ${error.message}`)
                // }
            }
            //
            const handleReorderProcess = async (event) => {
                steps.value = event.detail.complete(steps.value);
                //
                spinner.value = true;
                try {
                    const {error} = await supabase.from('userRecipes').update({
                        process: currentRecipe.value.process
                    }).eq('id', info.recipeId);
                    if(error) throw error;
                    spinner.value = false;
                } catch (error) {
                    // alert(`Error: ${error.message}`)
                }
            }

            // ============================================= РАБОТА С СПИСКОМ СОСТАВА =====================================
            const addCompositionItemModalOpened = ref(false);
            const newCompositionItem = ref({})
            const addCompositionItem = () => {
                // alert('ViewRecipe addCompositionItem: добавление элемента к составу - в разработке...')
                addCompositionItemModalOpened.value = true
                newCompositionItem.value = {
                    name: '',
                    ingredients: ['1', '2', '3']
                }
            }
            //
            const addNewCompositionItem = async (item) => {
                if(newCompositionItem.value.name === '') {
                    alert('ViewRecipe: Надо указать название элемента состава')
                } else {
                    currentRecipe.value.composition.push(item)
                    addCompositionItemModalOpened.value = false
                    await updateComposition()
                    newCompositionItem.value = {}
                }
            }
            // режим редактирования
            const editComposition = ref(false);
            const editCompositionFunc = () => {
                editComposition.value = !editComposition.value;
            }
            // ===== удаляем элемент состава ======
            // переменная для action sheet
            const deleteCompositionItem = ref(false);
            // Храним шеуь из списка состава к удалению
            const compositionItemToDeleteIndex = ref();
            //
            const openDeleteCompositionItemMenu = (index) => {
                compositionItemToDeleteIndex.value = index;
                deleteCompositionItem.value = true;
            }
            //
            const deleteCopmositionItemButtons = [
                {
                    text: 'Удалить',
                    role: 'destructive',
                    data: {
                        type: 'delete'
                    },
                    handler: () => {
                        deleteCompositionItemFunc(compositionItemToDeleteIndex.value)
                    }
                },
                {
                    text: 'Отменить',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked')
                    }
                }
            ]
            //
            const deleteCompositionItemFunc = async (index) => {
                if(index > -1){
                    currentRecipe.value.composition.splice(index, 1)
                    //
                    spinner.value = true;
                    try {
                        const {error} = await supabase.from('userRecipes').update({
                            composition: currentRecipe.value.composition
                        }).eq('id', info.recipeId);
                        if(error) throw error;
                        spinner.value = false;
                        // Рецепт успешно обновлено
                    } catch (error) {
                        // alert(`Error: ${error.message}`)
                    }
                }
            }
            //
            const addCompositionItemIngredient = () => {
                // Надор принимать данные типа к какому элементу состава доябвляем сие ингредиент...
                alert('ViewRecipe: Добавляение ингредиента - в разработке')
            }
            //
            const updateComposition = async () => {
                spinner.value = true;
                try {
                    const {error} = await supabase.from('userRecipes').update({
                        composition: currentRecipe.value.composition
                    }).eq('id', info.recipeId);
                    if(error) throw error;
                    spinner.value = false;
                    // Рецепт успешно обновлено
                } catch (error) {
                    // alert(`Error: ${error.message}`)
                }
            }
            //
            const updateProcess = async () => {
                spinner.value = true;
                try {
                    const {error} = await supabase.from('userRecipes').update({
                        process: currentRecipe.value.process
                    }).eq('id', info.recipeId);
                    if(error) throw error;
                    spinner.value = false;
                    // Рецепт успешно обновлено
                } catch (error) {
                    // alert(`Error: ${error.message}`)
                }
            }

            return {
                route, router, spinner, currentRecipe, currentId, info, openDeleteMenu, isOpenRef, deleteCurrentRecipeButtons, deleteCurrentRecipe, recipeName, closeCircleOutline, openDeleteCategoryModal, deleteCategory, categoryToDelete, deleteCategoryButtons, recipeDescription, expendList, checkmark, alertOutline, setImgSrc, searchRecipesCategoriesMenu, searchRecipesCategories, userRecipesCategories, searchedRecipesCategories, isCategoryAlreadyAdded, choosenCategory, setMeasure, Virtual, slides, setStyleProperties, steps, addProcessStep, addAssemblingElement, handleReorder, deleteAssemblingItem, assemblingItemToDeleteIndex, openDeleteAssemblingItemMenu, deleteAssemblingItemButtons, deleteAssemblingItemFunc, createOutline, reorderIsDisabled, toggleReorder, editRecipeProcess, editRecipeProcessFunc, handleReorderProcess, deleteProcessStep, processStepToDeleteIndex, openDeleteStepsMenu, deleteProcessStepButtons, deleteProcessStepFunc, addCompositionItem, editComposition, editCompositionFunc, openDeleteCompositionItemMenu, deleteCompositionItem, compositionItemToDeleteIndex, deleteCopmositionItemButtons, deleteCompositionItemFunc, addCompositionItemIngredient, trash, updateComposition, addAssemblingElementModalOpened, addToAssembling, updateProcess, addCompositionItemModalOpened, newCompositionItem, addNewCompositionItem
            }
        }
    })
</script>

<style scoped>
    .thumbnail_deal-subject {
        height: 64px;
        min-width: 64px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        padding: 0.5rem;
    }
    .button-add-ingredient {
        border-bottom: 1px dashed var(--ion-color-primary);
    }
</style>