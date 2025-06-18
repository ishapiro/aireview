import { _ as __nuxt_component_0 } from './nuxt-link-C9HRXqxW.mjs';
import { withAsyncContext, resolveComponent, mergeProps, withCtx, createVNode, unref, createTextVNode, createBlock, openBlock, Fragment, renderList, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { format } from 'date-fns';
import { c as useToast, d as useConfirm } from './server.mjs';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';
import '@supabase/ssr';
import 'perfect-debounce';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const client = useSupabaseClient();
    const toast = useToast();
    const confirm = useConfirm();
    const { data: reviews } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("admin-reviews", async () => {
      const { data } = await client.from("reviews").select(`
      *,
      author:profiles(*),
      category:categories(*)
    `).order("created_at", { ascending: false });
      return data;
    })), __temp = await __temp, __restore(), __temp);
    const formatDate = (date) => {
      return format(new Date(date), "MMM d, yyyy");
    };
    const handleDelete = (id) => {
      confirm.require({
        message: "Are you sure you want to delete this review?",
        header: "Confirm Deletion",
        icon: "pi pi-exclamation-triangle",
        accept: async () => {
          try {
            const { error } = await client.from("reviews").delete().eq("id", id);
            if (error) throw error;
            reviews.value = reviews.value.filter((review) => review.id !== id);
            toast.add({
              severity: "success",
              summary: "Success",
              detail: "Review deleted successfully",
              life: 3e3
            });
          } catch (error) {
            toast.add({
              severity: "error",
              summary: "Error",
              detail: error.message,
              life: 3e3
            });
          }
        }
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_Button = resolveComponent("Button");
      const _component_Card = resolveComponent("Card");
      const _component_Tag = resolveComponent("Tag");
      const _component_Toast = resolveComponent("Toast");
      const _component_ConfirmDialog = resolveComponent("ConfirmDialog");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-7xl mx-auto" }, _attrs))}><div class="flex items-center justify-between mb-8"><h1 class="text-3xl font-bold text-gray-900">Reviews</h1>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/admin/reviews/new" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Button, {
              label: "Create New Review",
              icon: "pi pi-plus"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Button, {
                label: "Create New Review",
                icon: "pi pi-plus"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_Card, null, {
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="overflow-x-auto"${_scopeId}><table class="min-w-full divide-y divide-gray-200"${_scopeId}><thead${_scopeId}><tr${_scopeId}><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"${_scopeId}> Title </th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"${_scopeId}> Author </th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"${_scopeId}> Category </th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"${_scopeId}> Rating </th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"${_scopeId}> Status </th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"${_scopeId}> Created </th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"${_scopeId}> Actions </th></tr></thead><tbody class="bg-white divide-y divide-gray-200"${_scopeId}><!--[-->`);
            ssrRenderList(unref(reviews), (review) => {
              var _a;
              _push2(`<tr${_scopeId}><td class="px-6 py-4 whitespace-nowrap"${_scopeId}><div class="text-sm font-medium text-gray-900"${_scopeId}>${ssrInterpolate(review.title)}</div></td><td class="px-6 py-4 whitespace-nowrap"${_scopeId}><div class="text-sm text-gray-900"${_scopeId}>${ssrInterpolate(review.author.full_name)}</div></td><td class="px-6 py-4 whitespace-nowrap"${_scopeId}><div class="text-sm text-gray-900"${_scopeId}>${ssrInterpolate((_a = review.category) == null ? void 0 : _a.name)}</div></td><td class="px-6 py-4 whitespace-nowrap"${_scopeId}><div class="star-rating"${_scopeId}><i class="pi pi-star-fill mr-1"${_scopeId}></i> ${ssrInterpolate(review.rating)}</div></td><td class="px-6 py-4 whitespace-nowrap"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Tag, {
                value: review.is_published ? "Published" : "Draft",
                severity: review.is_published ? "success" : "warning"
              }, null, _parent2, _scopeId));
              _push2(`</td><td class="px-6 py-4 whitespace-nowrap"${_scopeId}><div class="text-sm text-gray-500"${_scopeId}>${ssrInterpolate(formatDate(review.created_at))}</div></td><td class="px-6 py-4 whitespace-nowrap text-sm"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_NuxtLink, {
                to: `/admin/reviews/${review.id}`,
                class: "text-primary-600 hover:text-primary-900 mr-4"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Edit `);
                  } else {
                    return [
                      createTextVNode(" Edit ")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`<button class="text-red-600 hover:text-red-900"${_scopeId}> Delete </button></td></tr>`);
            });
            _push2(`<!--]--></tbody></table></div>`);
          } else {
            return [
              createVNode("div", { class: "overflow-x-auto" }, [
                createVNode("table", { class: "min-w-full divide-y divide-gray-200" }, [
                  createVNode("thead", null, [
                    createVNode("tr", null, [
                      createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, " Title "),
                      createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, " Author "),
                      createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, " Category "),
                      createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, " Rating "),
                      createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, " Status "),
                      createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, " Created "),
                      createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, " Actions ")
                    ])
                  ]),
                  createVNode("tbody", { class: "bg-white divide-y divide-gray-200" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(reviews), (review) => {
                      var _a;
                      return openBlock(), createBlock("tr", {
                        key: review.id
                      }, [
                        createVNode("td", { class: "px-6 py-4 whitespace-nowrap" }, [
                          createVNode("div", { class: "text-sm font-medium text-gray-900" }, toDisplayString(review.title), 1)
                        ]),
                        createVNode("td", { class: "px-6 py-4 whitespace-nowrap" }, [
                          createVNode("div", { class: "text-sm text-gray-900" }, toDisplayString(review.author.full_name), 1)
                        ]),
                        createVNode("td", { class: "px-6 py-4 whitespace-nowrap" }, [
                          createVNode("div", { class: "text-sm text-gray-900" }, toDisplayString((_a = review.category) == null ? void 0 : _a.name), 1)
                        ]),
                        createVNode("td", { class: "px-6 py-4 whitespace-nowrap" }, [
                          createVNode("div", { class: "star-rating" }, [
                            createVNode("i", { class: "pi pi-star-fill mr-1" }),
                            createTextVNode(" " + toDisplayString(review.rating), 1)
                          ])
                        ]),
                        createVNode("td", { class: "px-6 py-4 whitespace-nowrap" }, [
                          createVNode(_component_Tag, {
                            value: review.is_published ? "Published" : "Draft",
                            severity: review.is_published ? "success" : "warning"
                          }, null, 8, ["value", "severity"])
                        ]),
                        createVNode("td", { class: "px-6 py-4 whitespace-nowrap" }, [
                          createVNode("div", { class: "text-sm text-gray-500" }, toDisplayString(formatDate(review.created_at)), 1)
                        ]),
                        createVNode("td", { class: "px-6 py-4 whitespace-nowrap text-sm" }, [
                          createVNode(_component_NuxtLink, {
                            to: `/admin/reviews/${review.id}`,
                            class: "text-primary-600 hover:text-primary-900 mr-4"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Edit ")
                            ]),
                            _: 2
                          }, 1032, ["to"]),
                          createVNode("button", {
                            onClick: ($event) => handleDelete(review.id),
                            class: "text-red-600 hover:text-red-900"
                          }, " Delete ", 8, ["onClick"])
                        ])
                      ]);
                    }), 128))
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Toast, null, null, _parent));
      _push(ssrRenderComponent(_component_ConfirmDialog, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/reviews/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Ow75swXF.mjs.map
