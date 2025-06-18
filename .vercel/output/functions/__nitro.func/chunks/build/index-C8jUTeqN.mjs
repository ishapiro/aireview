import { _ as __nuxt_component_0 } from './nuxt-link-C9HRXqxW.mjs';
import { withAsyncContext, resolveComponent, mergeProps, unref, withCtx, createTextVNode, createVNode, createBlock, openBlock, Fragment, renderList, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { format } from 'date-fns';
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
import 'perfect-debounce';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const client = useSupabaseClient();
    const { data: stats } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("admin-stats", async () => {
      const [
        { count: totalReviews },
        { count: totalUsers },
        { count: premiumUsers },
        { count: totalComments }
      ] = await Promise.all([
        client.from("reviews").select("*", { count: "exact", head: true }),
        client.from("profiles").select("*", { count: "exact", head: true }),
        client.from("profiles").select("*", { count: "exact", head: true }).eq("is_premium", true),
        client.from("comments").select("*", { count: "exact", head: true })
      ]);
      return {
        totalReviews,
        totalUsers,
        premiumUsers,
        totalComments
      };
    })), __temp = await __temp, __restore(), __temp);
    const { data: recentActivity } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("recent-activity", async () => {
      const { data } = await client.from("activity_log").select("*").order("created_at", { ascending: false }).limit(5);
      return data;
    })), __temp = await __temp, __restore(), __temp);
    const { data: recentReviews } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("recent-reviews", async () => {
      const { data } = await client.from("reviews").select(`
      *,
      author:profiles(*)
    `).order("created_at", { ascending: false }).limit(5);
      return data;
    })), __temp = await __temp, __restore(), __temp);
    const formatDate = (date) => {
      return format(new Date(date), "MMM d, yyyy");
    };
    const getActivityIcon = (type) => {
      const icons = {
        review_created: "pi pi-file",
        review_updated: "pi pi-pencil",
        user_registered: "pi pi-user",
        comment_added: "pi pi-comment"
      };
      return icons[type] || "pi pi-info-circle";
    };
    const handleDeleteReview = async (reviewId) => {
      if (!confirm("Are you sure you want to delete this review?")) return;
      try {
        await client.from("reviews").delete().eq("id", reviewId);
        (void 0).location.reload();
      } catch (error) {
        console.error("Error deleting review:", error);
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Card = resolveComponent("Card");
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-7xl mx-auto" }, _attrs))}><h1 class="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"><div class="card"><h3 class="text-lg font-medium text-gray-900 mb-2">Total Reviews</h3><p class="text-3xl font-bold text-primary-600">${ssrInterpolate(unref(stats).totalReviews)}</p></div><div class="card"><h3 class="text-lg font-medium text-gray-900 mb-2">Total Users</h3><p class="text-3xl font-bold text-primary-600">${ssrInterpolate(unref(stats).totalUsers)}</p></div><div class="card"><h3 class="text-lg font-medium text-gray-900 mb-2">Premium Users</h3><p class="text-3xl font-bold text-primary-600">${ssrInterpolate(unref(stats).premiumUsers)}</p></div><div class="card"><h3 class="text-lg font-medium text-gray-900 mb-2">Total Comments</h3><p class="text-3xl font-bold text-primary-600">${ssrInterpolate(unref(stats).totalComments)}</p></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">`);
      _push(ssrRenderComponent(_component_Card, null, {
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}><h3 class="text-lg font-medium text-gray-900"${_scopeId}>Quick Actions</h3><div class="space-y-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/admin/reviews/new",
              class: "btn-primary block text-center"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Create New Review `);
                } else {
                  return [
                    createTextVNode(" Create New Review ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/admin/categories",
              class: "btn-secondary block text-center"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Manage Categories `);
                } else {
                  return [
                    createTextVNode(" Manage Categories ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/admin/users",
              class: "btn-secondary block text-center"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Manage Users `);
                } else {
                  return [
                    createTextVNode(" Manage Users ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                createVNode("h3", { class: "text-lg font-medium text-gray-900" }, "Quick Actions"),
                createVNode("div", { class: "space-y-4" }, [
                  createVNode(_component_NuxtLink, {
                    to: "/admin/reviews/new",
                    class: "btn-primary block text-center"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Create New Review ")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_NuxtLink, {
                    to: "/admin/categories",
                    class: "btn-secondary block text-center"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Manage Categories ")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_NuxtLink, {
                    to: "/admin/users",
                    class: "btn-secondary block text-center"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Manage Users ")
                    ]),
                    _: 1
                  })
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Card, null, {
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}><h3 class="text-lg font-medium text-gray-900"${_scopeId}>Recent Activity</h3><div class="space-y-4"${_scopeId}><!--[-->`);
            ssrRenderList(unref(recentActivity), (activity) => {
              _push2(`<div class="flex items-start"${_scopeId}><div class="flex-shrink-0"${_scopeId}><i class="${ssrRenderClass([getActivityIcon(activity.type), "text-gray-400"])}"${_scopeId}></i></div><div class="ml-3"${_scopeId}><p class="text-sm text-gray-900"${_scopeId}>${ssrInterpolate(activity.description)}</p><p class="text-xs text-gray-500"${_scopeId}>${ssrInterpolate(formatDate(activity.created_at))}</p></div></div>`);
            });
            _push2(`<!--]--></div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                createVNode("h3", { class: "text-lg font-medium text-gray-900" }, "Recent Activity"),
                createVNode("div", { class: "space-y-4" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(recentActivity), (activity) => {
                    return openBlock(), createBlock("div", {
                      key: activity.id,
                      class: "flex items-start"
                    }, [
                      createVNode("div", { class: "flex-shrink-0" }, [
                        createVNode("i", {
                          class: [getActivityIcon(activity.type), "text-gray-400"]
                        }, null, 2)
                      ]),
                      createVNode("div", { class: "ml-3" }, [
                        createVNode("p", { class: "text-sm text-gray-900" }, toDisplayString(activity.description), 1),
                        createVNode("p", { class: "text-xs text-gray-500" }, toDisplayString(formatDate(activity.created_at)), 1)
                      ])
                    ]);
                  }), 128))
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_Card, null, {
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-6"${_scopeId}><div class="flex justify-between items-center"${_scopeId}><h3 class="text-lg font-medium text-gray-900"${_scopeId}>Recent Reviews</h3>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/admin/reviews",
              class: "text-primary-600 hover:text-primary-700"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` View All `);
                } else {
                  return [
                    createTextVNode(" View All ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="overflow-x-auto"${_scopeId}><table class="min-w-full divide-y divide-gray-200"${_scopeId}><thead${_scopeId}><tr${_scopeId}><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"${_scopeId}> Title </th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"${_scopeId}> Author </th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"${_scopeId}> Rating </th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"${_scopeId}> Created </th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"${_scopeId}> Actions </th></tr></thead><tbody class="bg-white divide-y divide-gray-200"${_scopeId}><!--[-->`);
            ssrRenderList(unref(recentReviews), (review) => {
              _push2(`<tr${_scopeId}><td class="px-6 py-4 whitespace-nowrap"${_scopeId}><div class="text-sm font-medium text-gray-900"${_scopeId}>${ssrInterpolate(review.title)}</div></td><td class="px-6 py-4 whitespace-nowrap"${_scopeId}><div class="text-sm text-gray-900"${_scopeId}>${ssrInterpolate(review.author.full_name)}</div></td><td class="px-6 py-4 whitespace-nowrap"${_scopeId}><div class="star-rating"${_scopeId}><i class="pi pi-star-fill mr-1"${_scopeId}></i> ${ssrInterpolate(review.rating)}</div></td><td class="px-6 py-4 whitespace-nowrap"${_scopeId}><div class="text-sm text-gray-500"${_scopeId}>${ssrInterpolate(formatDate(review.created_at))}</div></td><td class="px-6 py-4 whitespace-nowrap text-sm"${_scopeId}>`);
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
            _push2(`<!--]--></tbody></table></div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-6" }, [
                createVNode("div", { class: "flex justify-between items-center" }, [
                  createVNode("h3", { class: "text-lg font-medium text-gray-900" }, "Recent Reviews"),
                  createVNode(_component_NuxtLink, {
                    to: "/admin/reviews",
                    class: "text-primary-600 hover:text-primary-700"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" View All ")
                    ]),
                    _: 1
                  })
                ]),
                createVNode("div", { class: "overflow-x-auto" }, [
                  createVNode("table", { class: "min-w-full divide-y divide-gray-200" }, [
                    createVNode("thead", null, [
                      createVNode("tr", null, [
                        createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, " Title "),
                        createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, " Author "),
                        createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, " Rating "),
                        createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, " Created "),
                        createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, " Actions ")
                      ])
                    ]),
                    createVNode("tbody", { class: "bg-white divide-y divide-gray-200" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(recentReviews), (review) => {
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
                            createVNode("div", { class: "star-rating" }, [
                              createVNode("i", { class: "pi pi-star-fill mr-1" }),
                              createTextVNode(" " + toDisplayString(review.rating), 1)
                            ])
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
                              onClick: ($event) => handleDeleteReview(review.id),
                              class: "text-red-600 hover:text-red-900"
                            }, " Delete ", 8, ["onClick"])
                          ])
                        ]);
                      }), 128))
                    ])
                  ])
                ])
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-C8jUTeqN.mjs.map
