import { _ as __nuxt_component_0 } from './nuxt-link-C9HRXqxW.mjs';
import { mergeProps, withCtx, createBlock, createCommentVNode, createVNode, openBlock, toDisplayString, createTextVNode, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { format } from 'date-fns';

const _sfc_main = {
  __name: "ReviewCard",
  __ssrInlineRender: true,
  props: {
    review: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const handleCardClick = (event) => {
      console.log("[ReviewCard] Card clicked, navigating to review:", props.review.slug);
    };
    const formatDate = (date) => {
      return format(new Date(date), "MMM d, yyyy");
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "card review-card" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/reviews/${__props.review.slug}`,
        onClick: handleCardClick
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            if (__props.review.thumbnail_url) {
              _push2(`<img${ssrRenderAttr("src", __props.review.thumbnail_url)}${ssrRenderAttr("alt", __props.review.title)} class="w-full h-48 object-cover rounded-lg mb-4"${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<h3 class="text-xl font-semibold text-gray-900 mb-2"${_scopeId}>${ssrInterpolate(__props.review.title)}</h3><p class="text-gray-600 mb-4 line-clamp-3"${_scopeId}>${ssrInterpolate((_a = __props.review.content) == null ? void 0 : _a.substring(0, 200))}...</p><div class="flex items-center justify-between"${_scopeId}><div class="flex items-center"${_scopeId}>`);
            if (__props.review.author && __props.review.author.avatar_url) {
              _push2(`<img${ssrRenderAttr("src", __props.review.author.avatar_url)}${ssrRenderAttr("alt", __props.review.author.full_name || "Author")} class="w-8 h-8 rounded-full mr-2"${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.review.author && __props.review.author.full_name) {
              _push2(`<span class="text-sm text-gray-600"${_scopeId}>${ssrInterpolate(__props.review.author.full_name)}</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex items-center"${_scopeId}>`);
            if (__props.review.rating > 1) {
              _push2(`<div class="star-rating mr-2"${_scopeId}><i class="pi pi-star-fill mr-1"${_scopeId}></i> ${ssrInterpolate(__props.review.rating)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<span class="text-sm text-gray-500"${_scopeId}>${ssrInterpolate(formatDate(__props.review.created_at))}</span></div></div><div class="mt-4 flex items-center justify-end text-sm text-gray-500 space-x-4 min-h-[1.5rem]"${_scopeId}>`);
            if (__props.review.views_count > 0) {
              _push2(`<span${_scopeId}><i class="pi pi-eye mr-1"${_scopeId}></i> ${ssrInterpolate(__props.review.views_count)} views </span>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.review.helpful_count > 0) {
              _push2(`<span${_scopeId}><i class="pi pi-thumbs-up mr-1"${_scopeId}></i> ${ssrInterpolate(__props.review.helpful_count)} found helpful </span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (Array.isArray(__props.review.categories)) {
              _push2(`<div class="mt-4 flex flex-wrap gap-2"${_scopeId}><!--[-->`);
              ssrRenderList(__props.review.categories, (category) => {
                _push2(`<span class="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"${_scopeId}>${ssrInterpolate(category.name)}</span>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.review.ai_generated) {
              _push2(`<div class="mt-4"${_scopeId}><span class="text-sm text-blue-600"${_scopeId}><i class="pi pi-robot mr-1"${_scopeId}></i> AI Assisted Review </span></div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              __props.review.thumbnail_url ? (openBlock(), createBlock("img", {
                key: 0,
                src: __props.review.thumbnail_url,
                alt: __props.review.title,
                class: "w-full h-48 object-cover rounded-lg mb-4"
              }, null, 8, ["src", "alt"])) : createCommentVNode("", true),
              createVNode("h3", { class: "text-xl font-semibold text-gray-900 mb-2" }, toDisplayString(__props.review.title), 1),
              createVNode("p", { class: "text-gray-600 mb-4 line-clamp-3" }, toDisplayString((_b = __props.review.content) == null ? void 0 : _b.substring(0, 200)) + "...", 1),
              createVNode("div", { class: "flex items-center justify-between" }, [
                createVNode("div", { class: "flex items-center" }, [
                  __props.review.author && __props.review.author.avatar_url ? (openBlock(), createBlock("img", {
                    key: 0,
                    src: __props.review.author.avatar_url,
                    alt: __props.review.author.full_name || "Author",
                    class: "w-8 h-8 rounded-full mr-2"
                  }, null, 8, ["src", "alt"])) : createCommentVNode("", true),
                  __props.review.author && __props.review.author.full_name ? (openBlock(), createBlock("span", {
                    key: 1,
                    class: "text-sm text-gray-600"
                  }, toDisplayString(__props.review.author.full_name), 1)) : createCommentVNode("", true)
                ]),
                createVNode("div", { class: "flex items-center" }, [
                  __props.review.rating > 1 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "star-rating mr-2"
                  }, [
                    createVNode("i", { class: "pi pi-star-fill mr-1" }),
                    createTextVNode(" " + toDisplayString(__props.review.rating), 1)
                  ])) : createCommentVNode("", true),
                  createVNode("span", { class: "text-sm text-gray-500" }, toDisplayString(formatDate(__props.review.created_at)), 1)
                ])
              ]),
              createVNode("div", { class: "mt-4 flex items-center justify-end text-sm text-gray-500 space-x-4 min-h-[1.5rem]" }, [
                __props.review.views_count > 0 ? (openBlock(), createBlock("span", { key: 0 }, [
                  createVNode("i", { class: "pi pi-eye mr-1" }),
                  createTextVNode(" " + toDisplayString(__props.review.views_count) + " views ", 1)
                ])) : createCommentVNode("", true),
                __props.review.helpful_count > 0 ? (openBlock(), createBlock("span", { key: 1 }, [
                  createVNode("i", { class: "pi pi-thumbs-up mr-1" }),
                  createTextVNode(" " + toDisplayString(__props.review.helpful_count) + " found helpful ", 1)
                ])) : createCommentVNode("", true)
              ]),
              Array.isArray(__props.review.categories) ? (openBlock(), createBlock("div", {
                key: 1,
                class: "mt-4 flex flex-wrap gap-2"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(__props.review.categories, (category) => {
                  return openBlock(), createBlock("span", {
                    key: category.id,
                    class: "px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                  }, toDisplayString(category.name), 1);
                }), 128))
              ])) : createCommentVNode("", true),
              __props.review.ai_generated ? (openBlock(), createBlock("div", {
                key: 2,
                class: "mt-4"
              }, [
                createVNode("span", { class: "text-sm text-blue-600" }, [
                  createVNode("i", { class: "pi pi-robot mr-1" }),
                  createTextVNode(" AI Assisted Review ")
                ])
              ])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ReviewCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=ReviewCard-Crg3uSg8.mjs.map
