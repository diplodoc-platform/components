"use strict";(self.webpackChunk_diplodoc_components_demo=self.webpackChunk_diplodoc_components_demo||[]).push([[556],{"../../../node_modules/@gravity-ui/uikit/build/esm/components/Loader/Loader.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{a:()=>Loader_Loader_Loader});var react=__webpack_require__("./node_modules/react/index.js"),cn=__webpack_require__("../../../node_modules/@gravity-ui/uikit/build/esm/components/utils/cn.js"),injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),Loader=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[8].use[1]!../../../node_modules/@gravity-ui/uikit/build/esm/components/Loader/Loader.css"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(Loader.Z,options);Loader.Z&&Loader.Z.locals&&Loader.Z.locals;const b=(0,cn.Ge)("loader");function Loader_Loader_Loader({size="s",className,qa}){return react.createElement("div",{className:b({size},className),"data-qa":qa},react.createElement("div",{className:b("left")}),react.createElement("div",{className:b("center")}),react.createElement("div",{className:b("right")}))}},"./src/Components/SearchPage/index.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Search:()=>Search,__namedExportsOrder:()=>__namedExportsOrder,default:()=>index_stories});var react=__webpack_require__("./node_modules/react/index.js"),Loader=__webpack_require__("../../../node_modules/@gravity-ui/uikit/build/esm/components/Loader/Loader.js"),TextInput=__webpack_require__("../../../node_modules/@gravity-ui/uikit/build/esm/components/controls/TextInput/TextInput.js"),Button=__webpack_require__("../../../node_modules/@gravity-ui/uikit/build/esm/components/Button/Button.js"),lib=__webpack_require__("../../../node_modules/bem-cn-lite/lib/index.js"),useTranslation=__webpack_require__("../build/esm/hooks/useTranslation.js"),Paginator=__webpack_require__("../build/esm/components/Paginator/Paginator.js"),SearchItem=__webpack_require__("../build/esm/components/SearchItem/SearchItem.js"),injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),SearchPage=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[8].use[1]!../build/esm/components/SearchPage/SearchPage.css"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(SearchPage.Z,options);SearchPage.Z&&SearchPage.Z.locals&&SearchPage.Z.locals;var __defProp=Object.defineProperty,__getOwnPropSymbols=Object.getOwnPropertySymbols,__hasOwnProp=Object.prototype.hasOwnProperty,__propIsEnum=Object.prototype.propertyIsEnumerable,__defNormalProp=(obj,key,value)=>key in obj?__defProp(obj,key,{enumerable:!0,configurable:!0,writable:!0,value}):obj[key]=value,__spreadValues=(a,b2)=>{for(var prop in b2||(b2={}))__hasOwnProp.call(b2,prop)&&__defNormalProp(a,prop,b2[prop]);if(__getOwnPropSymbols)for(var prop of __getOwnPropSymbols(b2))__propIsEnum.call(b2,prop)&&__defNormalProp(a,prop,b2[prop]);return a},b=(0,lib.Z)("dc-search-page"),FoundBlock=({items,itemOnClick,irrelevantOnClick,relevantOnClick,page,totalItems=0,maxPages,onPageChange,itemsPerPage,isMobile})=>{const{t}=(0,useTranslation.$)("search");return react.createElement("div",{className:b("search-result")},react.createElement("h3",{className:b("subtitle")},t("search_request-query")),react.createElement("div",{className:b("search-list")},items.map((item=>react.createElement(SearchItem.Z,{key:item.url,item,className:b("search-item"),itemOnClick,irrelevantOnClick,relevantOnClick})))),react.createElement("div",{className:b("paginator")},react.createElement(Paginator.Z,{page,totalItems,maxPages,onPageChange,itemsPerPage,isMobile})))},WithoutContentBlock=({loading})=>{const{t}=(0,useTranslation.$)("search");return loading?react.createElement(Loader.a,null):react.createElement("div",{className:b("search-empty")},react.createElement("h3",null,t("search_not-found-title")),react.createElement("div",null,t("search_not-found-text")))},InputBlock=({query,onQueryUpdate,onSubmit,inputRef})=>{const{t}=(0,useTranslation.$)("search");return react.createElement("div",{className:b("search-field")},react.createElement("form",{onSubmit:event=>{event.preventDefault(),onSubmit(query)}},react.createElement("div",{className:b("search-field-wrapper")},react.createElement(TextInput.o,{controlRef:inputRef,size:"l",value:query,autoFocus:!0,placeholder:t("search_placeholder"),onUpdate:onQueryUpdate,hasClear:!0}),react.createElement(Button.z,{className:b("search-button"),view:"action",size:"l",onClick:event=>{event.preventDefault(),onSubmit(query)}},t("search_action")))))},SearchPage_SearchPage_SearchPage=({query="",items=[],page=1,isMobile,totalItems,maxPages,itemsPerPage,onPageChange,onSubmit,itemOnClick,irrelevantOnClick,relevantOnClick,loading})=>{const inputRef=(0,react.useRef)(null),[currentQuery,setCurrentQuery]=(0,react.useState)(query);return react.createElement("div",{className:b("layout")},react.createElement("div",{className:b("search-input")},react.createElement(InputBlock,__spreadValues({},{query:currentQuery,onQueryUpdate:setCurrentQuery,onSubmit,inputRef}))),react.createElement("div",{className:b("content")},(null==items?void 0:items.length)&&query?react.createElement(FoundBlock,__spreadValues({},{items,page,isMobile,totalItems,maxPages,itemsPerPage,itemOnClick,onPageChange,irrelevantOnClick,relevantOnClick})):react.createElement(WithoutContentBlock,{loading})))},SearchPage_default=SearchPage_SearchPage_SearchPage;SearchPage_SearchPage_SearchPage.__docgenInfo={description:"",methods:[],displayName:"SearchPage",props:{query:{defaultValue:{value:'""',computed:!1},required:!1},items:{defaultValue:{value:"[]",computed:!1},required:!1},page:{defaultValue:{value:"1",computed:!1},required:!1}}};const data=[{title:"Lorem ipsum dolor sit amet",url:"/en/data-visualization/step-by-step/charts/add-chart",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean nec nisi eget tellus pharetra pharetra sit amet in metus. Fusce eu consequat nisl. Sed dictum porta scelerisque. Fusce auctor enim ligula, at rhoncus ligula placerat id. Aliquam venenatis cursus ante, quis feugiat tortor mattis et. Donec sed justo eu est egestas malesuada."},{title:"Vivamus scelerisque dictum blandit",url:"/en/data-visualization/step-by-step/charts/add-chart",description:"Vivamus scelerisque dictum blandit. Curabitur metus odio, lobortis eu est id, iaculis accumsan massa. Ut et euismod nisl. Donec mollis odio at elementum sagittis. Quisque dapibus eros purus, eu vulputate nisl pellentesque et. Ut vehicula mattis euismod. Vestibulum ornare nulla vel nisi consectetur accumsan. Quisque id felis tempus, porttitor ex et, pellentesque ligula."},{title:"Integer tincidunt rhoncus purus",url:"/en/data-visualization/step-by-step/charts/add-chart",description:"Integer tincidunt rhoncus purus, nec laoreet arcu. Ut fermentum nulla sit amet arcu tristique vulputate. Vestibulum et tempor arcu. Cras laoreet ipsum ac mi rutrum, in sagittis metus pharetra. In mi nibh, lobortis sed tempor quis, fermentu"},{title:"Cras aliquam et eros ut",url:"/en/data-visualization/step-by-step/charts/add-chart",description:"Cras aliquam et eros ut lobortis. Quisque malesuada, nunc vitae placerat varius, ante nulla pharetra libero, at fringilla magna sem non velit. Curabitur finibus mauris vitae est pellentesque, vitae molestie tortor condimentum. "}];var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const SearchPageDemo=args=>{const isMobile=args.Mobile,[page,setPage]=(0,react.useState)(1),[items,setItems]=(0,react.useState)(getItems(page,data));function getItems(newPage,data){return 1===newPage?data.slice(0,2):data.slice(2)}return(0,jsx_runtime.jsx)("div",{className:"true"===isMobile?"mobile":"desktop",children:(0,jsx_runtime.jsx)(SearchPage_default,{query:"test",items,page,onPageChange:newPage=>{setPage(newPage),setItems(getItems(newPage,data))},onSubmit:()=>setItems(getItems(page,data)),itemOnClick:item=>console.log("Click on search result",item),irrelevantOnClick:item=>console.log("Click on dislike button",item),relevantOnClick:item=>console.log("Click on like  button",item),itemsPerPage:2,totalItems:data.length})})};SearchPageDemo.displayName="SearchPageDemo";const index_stories={title:"Pages/Search",component:SearchPageDemo,argTypes:{Mobile:{control:"boolean"}}},Search={args:{Mobile:!1}};Search.parameters={...Search.parameters,docs:{...Search.parameters?.docs,source:{originalSource:"{\n  args: {\n    Mobile: false\n  }\n}",...Search.parameters?.docs?.source}}};const __namedExportsOrder=["Search"]},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[8].use[1]!../../../node_modules/@gravity-ui/uikit/build/esm/components/Loader/Loader.css":(module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _packages_components_demo_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_packages_components_demo_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_packages_components_demo_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_packages_components_demo_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_packages_components_demo_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_packages_components_demo_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,"@keyframes g-pulse {\n  50% {\n    opacity: 15%;\n  }\n}\n.g-loader {\n  display: inline-flex;\n  align-items: center;\n}\n.g-loader__left, .g-loader__center, .g-loader__right {\n  background: var(--g-color-base-brand);\n  animation: g-pulse ease 800ms infinite;\n}\n.g-loader__left {\n  animation-delay: 200ms;\n}\n.g-loader__center {\n  animation-delay: 400ms;\n}\n.g-loader__right {\n  animation-delay: 600ms;\n}\n.g-loader_size_s .g-loader__left {\n  height: calc(20px / 1.5);\n  width: 5px;\n}\n.g-loader_size_s .g-loader__center {\n  width: 5px;\n  height: 20px;\n  margin-inline-start: 5px;\n}\n.g-loader_size_s .g-loader__right {\n  height: calc(20px / 1.5);\n  width: 5px;\n  margin-inline-start: 5px;\n}\n.g-loader_size_m .g-loader__left {\n  height: calc(28px / 1.5);\n  width: 7px;\n}\n.g-loader_size_m .g-loader__center {\n  width: 7px;\n  height: 28px;\n  margin-inline-start: 7px;\n}\n.g-loader_size_m .g-loader__right {\n  height: calc(28px / 1.5);\n  width: 7px;\n  margin-inline-start: 7px;\n}\n.g-loader_size_l .g-loader__left {\n  height: calc(36px / 1.5);\n  width: 9px;\n}\n.g-loader_size_l .g-loader__center {\n  width: 9px;\n  height: 36px;\n  margin-inline-start: 9px;\n}\n.g-loader_size_l .g-loader__right {\n  height: calc(36px / 1.5);\n  width: 9px;\n  margin-inline-start: 9px;\n}","",{version:3,sources:["webpack://./../../../node_modules/@gravity-ui/uikit/build/esm/components/Loader/Loader.css"],names:[],mappings:"AAAA;EACE;IACE,YAAY;EACd;AACF;AACA;EACE,oBAAoB;EACpB,mBAAmB;AACrB;AACA;EACE,qCAAqC;EACrC,sCAAsC;AACxC;AACA;EACE,sBAAsB;AACxB;AACA;EACE,sBAAsB;AACxB;AACA;EACE,sBAAsB;AACxB;AACA;EACE,wBAAwB;EACxB,UAAU;AACZ;AACA;EACE,UAAU;EACV,YAAY;EACZ,wBAAwB;AAC1B;AACA;EACE,wBAAwB;EACxB,UAAU;EACV,wBAAwB;AAC1B;AACA;EACE,wBAAwB;EACxB,UAAU;AACZ;AACA;EACE,UAAU;EACV,YAAY;EACZ,wBAAwB;AAC1B;AACA;EACE,wBAAwB;EACxB,UAAU;EACV,wBAAwB;AAC1B;AACA;EACE,wBAAwB;EACxB,UAAU;AACZ;AACA;EACE,UAAU;EACV,YAAY;EACZ,wBAAwB;AAC1B;AACA;EACE,wBAAwB;EACxB,UAAU;EACV,wBAAwB;AAC1B",sourcesContent:["@keyframes g-pulse {\n  50% {\n    opacity: 15%;\n  }\n}\n.g-loader {\n  display: inline-flex;\n  align-items: center;\n}\n.g-loader__left, .g-loader__center, .g-loader__right {\n  background: var(--g-color-base-brand);\n  animation: g-pulse ease 800ms infinite;\n}\n.g-loader__left {\n  animation-delay: 200ms;\n}\n.g-loader__center {\n  animation-delay: 400ms;\n}\n.g-loader__right {\n  animation-delay: 600ms;\n}\n.g-loader_size_s .g-loader__left {\n  height: calc(20px / 1.5);\n  width: 5px;\n}\n.g-loader_size_s .g-loader__center {\n  width: 5px;\n  height: 20px;\n  margin-inline-start: 5px;\n}\n.g-loader_size_s .g-loader__right {\n  height: calc(20px / 1.5);\n  width: 5px;\n  margin-inline-start: 5px;\n}\n.g-loader_size_m .g-loader__left {\n  height: calc(28px / 1.5);\n  width: 7px;\n}\n.g-loader_size_m .g-loader__center {\n  width: 7px;\n  height: 28px;\n  margin-inline-start: 7px;\n}\n.g-loader_size_m .g-loader__right {\n  height: calc(28px / 1.5);\n  width: 7px;\n  margin-inline-start: 7px;\n}\n.g-loader_size_l .g-loader__left {\n  height: calc(36px / 1.5);\n  width: 9px;\n}\n.g-loader_size_l .g-loader__center {\n  width: 9px;\n  height: 36px;\n  margin-inline-start: 9px;\n}\n.g-loader_size_l .g-loader__right {\n  height: calc(36px / 1.5);\n  width: 9px;\n  margin-inline-start: 9px;\n}"],sourceRoot:""}]);const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[8].use[1]!../build/esm/components/SearchPage/SearchPage.css":(module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _demo_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_demo_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_demo_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_demo_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_demo_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_demo_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,"/* src/components/SearchPage/SearchPage.scss */\n.dc-search-page {\n  margin-top: 26px;\n  display: flex;\n  justify-content: center;\n}\n.dc-search-page__layout {\n  max-width: 736px;\n  width: 100%;\n}\n.dc-search-page__search-field-wrapper {\n  display: flex;\n  align-items: center;\n}\n.dc-search-page__search-button {\n  margin-left: 10px;\n}\n.dc-search-page__search-field,\n.dc-search-page__search-item {\n  margin-bottom: 36px;\n}\n.dc-search-page__subtitle {\n  margin-bottom: 18px;\n}\n.dc-search-page__paginator {\n  padding: 10px 0;\n  border-top: 1px solid var(--g-color-line-generic);\n}\n@media (max-width: 769px) {\n  .dc-search-page {\n    margin-top: 16px;\n  }\n  .dc-search-page__layout {\n    padding: 0 12px;\n  }\n  .dc-search-page__search-field {\n    margin-bottom: 24px;\n  }\n  .dc-search-page__search-item {\n    margin-bottom: 40px;\n  }\n}\n/*# sourceMappingURL=SearchPage.css.map */\n","",{version:3,sources:["webpack://./../build/esm/components/SearchPage/SearchPage.css","webpack://./../src/components/SearchPage/Users/bagautdinovrl/Desktop/projects/diplodoc-meta-3/packages/components/src/components/SearchPage/SearchPage.scss","webpack://./../src/components/SearchPage/%3Cinput%20css%20kLdFch%3E"],names:[],mappings:"AAAA,8CAA8C;ACG9C;EACI,gBAAA;EACA,aAAA;EACA,uBAAA;ACFJ;ADII;EACI,gBAAA;EACA,WAAA;ACFR;ADKI;EACI,aAAA;EACA,mBAAA;ACHR;ADMI;EACI,iBAAA;ACJR;ADQQ;;EAEI,mBAAA;ACPZ;ADWI;EACI,mBAAA;ACTR;ADYI;EACI,eAAA;EACA,iDAAA;ACVR;ADaI;EAnCJ;IAoCQ,gBAAA;ECVN;EDYM;IACI,eAAA;ECVV;EDcU;IACI,mBAAA;ECZd;EDeU;IACI,mBAAA;ECbd;AACF;AFGA,yCAAyC",sourcesContent:["/* src/components/SearchPage/SearchPage.scss */\n.dc-search-page {\n  margin-top: 26px;\n  display: flex;\n  justify-content: center;\n}\n.dc-search-page__layout {\n  max-width: 736px;\n  width: 100%;\n}\n.dc-search-page__search-field-wrapper {\n  display: flex;\n  align-items: center;\n}\n.dc-search-page__search-button {\n  margin-left: 10px;\n}\n.dc-search-page__search-field,\n.dc-search-page__search-item {\n  margin-bottom: 36px;\n}\n.dc-search-page__subtitle {\n  margin-bottom: 18px;\n}\n.dc-search-page__paginator {\n  padding: 10px 0;\n  border-top: 1px solid var(--g-color-line-generic);\n}\n@media (max-width: 769px) {\n  .dc-search-page {\n    margin-top: 16px;\n  }\n  .dc-search-page__layout {\n    padding: 0 12px;\n  }\n  .dc-search-page__search-field {\n    margin-bottom: 24px;\n  }\n  .dc-search-page__search-item {\n    margin-bottom: 40px;\n  }\n}\n/*# sourceMappingURL=SearchPage.css.map */\n","@import '../../styles/variables';\n@import '../../styles/mixins';\n\n.dc-search-page {\n    margin-top: 26px;\n    display: flex;\n    justify-content: center;\n\n    &__layout {\n        max-width: $centerBlockMaxWidth;\n        width: 100%;\n    }\n\n    &__search-field-wrapper {\n        display: flex;\n        align-items: center;\n    }\n\n    &__search-button {\n        margin-left: 10px;\n    }\n\n    &__search {\n        &-field,\n        &-item {\n            margin-bottom: 36px;\n        }\n    }\n\n    &__subtitle {\n        margin-bottom: 18px;\n    }\n\n    &__paginator {\n        padding: 10px 0;\n        border-top: 1px solid var(--g-color-line-generic);\n    }\n\n    @media (max-width: map-get($screenBreakpoints, 'md')) {\n        margin-top: 16px;\n\n        &__layout {\n            padding: 0 12px;\n        }\n\n        &__search {\n            &-field {\n                margin-bottom: 24px;\n            }\n\n            &-item {\n                margin-bottom: 40px;\n            }\n        }\n    }\n}\n",".dc-search-page {\n  margin-top: 26px;\n  display: flex;\n  justify-content: center;\n}\n.dc-search-page__layout {\n  max-width: 736px;\n  width: 100%;\n}\n.dc-search-page__search-field-wrapper {\n  display: flex;\n  align-items: center;\n}\n.dc-search-page__search-button {\n  margin-left: 10px;\n}\n.dc-search-page__search-field, .dc-search-page__search-item {\n  margin-bottom: 36px;\n}\n.dc-search-page__subtitle {\n  margin-bottom: 18px;\n}\n.dc-search-page__paginator {\n  padding: 10px 0;\n  border-top: 1px solid var(--g-color-line-generic);\n}\n@media (max-width: 769px) {\n  .dc-search-page {\n    margin-top: 16px;\n  }\n  .dc-search-page__layout {\n    padding: 0 12px;\n  }\n  .dc-search-page__search-field {\n    margin-bottom: 24px;\n  }\n  .dc-search-page__search-item {\n    margin-bottom: 40px;\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiL1VzZXJzL2JhZ2F1dGRpbm92cmwvRGVza3RvcC9wcm9qZWN0cy9kaXBsb2RvYy1tZXRhLTMvcGFja2FnZXMvY29tcG9uZW50cy9zcmMvY29tcG9uZW50cy9TZWFyY2hQYWdlIiwic291cmNlcyI6WyJTZWFyY2hQYWdlLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0E7RUFDSTtFQUNBO0VBQ0E7O0FBRUE7RUFDSTtFQUNBOztBQUdKO0VBQ0k7RUFDQTs7QUFHSjtFQUNJOztBQUlBO0VBRUk7O0FBSVI7RUFDSTs7QUFHSjtFQUNJO0VBQ0E7O0FBR0o7RUFuQ0o7SUFvQ1E7O0VBRUE7SUFDSTs7RUFJQTtJQUNJOztFQUdKO0lBQ0kiLCJzb3VyY2VzQ29udGVudCI6WyJAaW1wb3J0ICcuLi8uLi9zdHlsZXMvdmFyaWFibGVzJztcbkBpbXBvcnQgJy4uLy4uL3N0eWxlcy9taXhpbnMnO1xuXG4uZGMtc2VhcmNoLXBhZ2Uge1xuICAgIG1hcmdpbi10b3A6IDI2cHg7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcblxuICAgICZfX2xheW91dCB7XG4gICAgICAgIG1heC13aWR0aDogJGNlbnRlckJsb2NrTWF4V2lkdGg7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgIH1cblxuICAgICZfX3NlYXJjaC1maWVsZC13cmFwcGVyIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICB9XG5cbiAgICAmX19zZWFyY2gtYnV0dG9uIHtcbiAgICAgICAgbWFyZ2luLWxlZnQ6IDEwcHg7XG4gICAgfVxuXG4gICAgJl9fc2VhcmNoIHtcbiAgICAgICAgJi1maWVsZCxcbiAgICAgICAgJi1pdGVtIHtcbiAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDM2cHg7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19zdWJ0aXRsZSB7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDE4cHg7XG4gICAgfVxuXG4gICAgJl9fcGFnaW5hdG9yIHtcbiAgICAgICAgcGFkZGluZzogMTBweCAwO1xuICAgICAgICBib3JkZXItdG9wOiAxcHggc29saWQgdmFyKC0tZy1jb2xvci1saW5lLWdlbmVyaWMpO1xuICAgIH1cblxuICAgIEBtZWRpYSAobWF4LXdpZHRoOiBtYXAtZ2V0KCRzY3JlZW5CcmVha3BvaW50cywgJ21kJykpIHtcbiAgICAgICAgbWFyZ2luLXRvcDogMTZweDtcblxuICAgICAgICAmX19sYXlvdXQge1xuICAgICAgICAgICAgcGFkZGluZzogMCAxMnB4O1xuICAgICAgICB9XG5cbiAgICAgICAgJl9fc2VhcmNoIHtcbiAgICAgICAgICAgICYtZmllbGQge1xuICAgICAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDI0cHg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICYtaXRlbSB7XG4gICAgICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogNDBweDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ== */"],sourceRoot:""}]);const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___}}]);