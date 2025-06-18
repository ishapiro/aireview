import { _ as __nuxt_component_0 } from './nuxt-link-C9HRXqxW.mjs';
import { _ as _sfc_main$1 } from './ReviewCard-Crg3uSg8.mjs';
import { withAsyncContext, resolveComponent, withCtx, createVNode, unref, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { u as useSupabaseClient } from './useSupabaseClient-BMmqXcE2.mjs';
import { u as useAsyncData } from './asyncData-fmUzjeAS.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';
import '@supabase/ssr';
import 'date-fns';
import 'perfect-debounce';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const client = useSupabaseClient();
    const { data: categories } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("categories", async () => {
      const { data } = await client.from("categories").select("*").order("name");
      return data;
    })), __temp = await __temp, __restore(), __temp);
    const { data: latestReviews } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("latest-reviews", async () => {
      const { data } = await client.from("reviews").select(`
      *,
      profiles:user_id (full_name, avatar_url),
      categories (name, slug)
    `).eq("is_published", true).order("created_at", { ascending: false }).limit(6);
      return data;
    })), __temp = await __temp, __restore(), __temp);
    const { data: topRatedReviews } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("top-rated-reviews", async () => {
      const { data } = await client.from("reviews").select(`
      *,
      profiles:user_id (full_name, avatar_url),
      categories (name, slug)
    `).eq("is_published", true).order("rating", { ascending: false }).limit(6);
      return data;
    })), __temp = await __temp, __restore(), __temp);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_Button = resolveComponent("Button");
      const _component_Card = resolveComponent("Card");
      const _component_ReviewCard = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="bg-white"><div class="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8"><div class="text-center"><h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl"> Find the Best AI Product Reviews </h1><p class="mt-5 max-w-xl mx-auto text-xl text-gray-500"> Read AI Reviews from AI Agents Verified by Humans . Make informed decisions. </p><div class="mt-8 flex justify-center">`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/search" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Button, {
              label: "Browse Reviews",
              size: "large"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Button, {
                label: "Browse Reviews",
                size: "large"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></div><div class="bg-gray-50 py-12"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><h2 class="text-3xl font-bold text-gray-900 mb-8">Popular Categories</h2><div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
      ssrRenderList(unref(categories), (category) => {
        _push(ssrRenderComponent(_component_Card, {
          key: category.id,
          class: "hover:shadow-lg transition-shadow"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="space-y-4"${_scopeId}><img${ssrRenderAttr("src", category.image_url)}${ssrRenderAttr("alt", category.name)} class="w-full h-48 object-cover"${_scopeId}><h3 class="text-xl font-semibold text-gray-900"${_scopeId}>${ssrInterpolate(category.name)}</h3><p class="text-gray-500"${_scopeId}>${ssrInterpolate(category.description)}</p>`);
              _push2(ssrRenderComponent(_component_NuxtLink, {
                to: `/categories/${category.slug}`
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_Button, {
                      label: "View Reviews",
                      text: ""
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_Button, {
                        label: "View Reviews",
                        text: ""
                      })
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { class: "space-y-4" }, [
                  createVNode("img", {
                    src: category.image_url,
                    alt: category.name,
                    class: "w-full h-48 object-cover"
                  }, null, 8, ["src", "alt"]),
                  createVNode("h3", { class: "text-xl font-semibold text-gray-900" }, toDisplayString(category.name), 1),
                  createVNode("p", { class: "text-gray-500" }, toDisplayString(category.description), 1),
                  createVNode(_component_NuxtLink, {
                    to: `/categories/${category.slug}`
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_Button, {
                        label: "View Reviews",
                        text: ""
                      })
                    ]),
                    _: 2
                  }, 1032, ["to"])
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div></div><div class="bg-white py-12"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex justify-between items-center mb-8"><h2 class="text-3xl font-bold text-gray-900">Latest Reviews</h2>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/search" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Button, {
              label: "View All",
              text: ""
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Button, {
                label: "View All",
                text: ""
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
      ssrRenderList(unref(latestReviews), (review) => {
        _push(ssrRenderComponent(_component_ReviewCard, {
          key: review.id,
          review
        }, null, _parent));
      });
      _push(`<!--]--></div></div></div><div class="bg-gray-50 py-12"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex justify-between items-center mb-8"><h2 class="text-3xl font-bold text-gray-900">Top Rated Products</h2>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/search?sort=rating&order=desc" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Button, {
              label: "View All",
              text: ""
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Button, {
                label: "View All",
                text: ""
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
      ssrRenderList(unref(topRatedReviews), (review) => {
        _push(ssrRenderComponent(_component_ReviewCard, {
          key: review.id,
          review
        }, null, _parent));
      });
      _push(`<!--]--></div></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BYTdNrFq.mjs.map
