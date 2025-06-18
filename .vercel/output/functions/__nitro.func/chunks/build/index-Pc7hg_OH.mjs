import { withAsyncContext, resolveComponent, mergeProps, withCtx, unref, createVNode, createBlock, openBlock, Fragment, renderList, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { format } from 'date-fns';
import { d as useConfirm } from './server.mjs';
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
    const { data: users } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("admin-users", async () => {
      const { data } = await client.from("profiles").select("*").order("created_at", { ascending: false });
      return data;
    })), __temp = await __temp, __restore(), __temp);
    const formatDate = (date) => {
      return format(new Date(date), "MMM d, yyyy");
    };
    const handleToggleAdmin = async (user) => {
      try {
        const { error } = await client.from("profiles").update({ is_admin: !user.is_admin }).eq("id", user.id);
        if (error) throw error;
        const userIndex = users.value.findIndex((u) => u.id === user.id);
        if (userIndex !== -1) {
          users.value[userIndex].is_admin = !user.is_admin;
        }
        toast.add({
          severity: "success",
          summary: "Success",
          detail: `User ${user.is_admin ? "removed from" : "made"} admin successfully`,
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
    };
    const handleDelete = (id) => {
      confirm.require({
        message: "Are you sure you want to delete this user? This action cannot be undone.",
        header: "Confirm Deletion",
        icon: "pi pi-exclamation-triangle",
        accept: async () => {
          try {
            const { error } = await client.from("profiles").delete().eq("id", id);
            if (error) throw error;
            users.value = users.value.filter((user) => user.id !== id);
            toast.add({
              severity: "success",
              summary: "Success",
              detail: "User deleted successfully",
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
      const _component_Card = resolveComponent("Card");
      const _component_Tag = resolveComponent("Tag");
      const _component_Toast = resolveComponent("Toast");
      const _component_ConfirmDialog = resolveComponent("ConfirmDialog");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-7xl mx-auto" }, _attrs))}><h1 class="text-3xl font-bold text-gray-900 mb-8">Users</h1>`);
      _push(ssrRenderComponent(_component_Card, null, {
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="overflow-x-auto"${_scopeId}><table class="min-w-full divide-y divide-gray-200"${_scopeId}><thead${_scopeId}><tr${_scopeId}><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"${_scopeId}> Name </th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"${_scopeId}> Email </th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"${_scopeId}> Role </th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"${_scopeId}> Status </th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"${_scopeId}> Joined </th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"${_scopeId}> Actions </th></tr></thead><tbody class="bg-white divide-y divide-gray-200"${_scopeId}><!--[-->`);
            ssrRenderList(unref(users), (user) => {
              _push2(`<tr${_scopeId}><td class="px-6 py-4 whitespace-nowrap"${_scopeId}><div class="flex items-center"${_scopeId}><div class="flex-shrink-0 h-10 w-10"${_scopeId}>`);
              if (user.avatar_url) {
                _push2(`<img${ssrRenderAttr("src", user.avatar_url)} class="h-10 w-10 rounded-full object-cover"${_scopeId}>`);
              } else {
                _push2(`<div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center"${_scopeId}><i class="pi pi-user text-gray-400"${_scopeId}></i></div>`);
              }
              _push2(`</div><div class="ml-4"${_scopeId}><div class="text-sm font-medium text-gray-900"${_scopeId}>${ssrInterpolate(user.full_name)}</div></div></div></td><td class="px-6 py-4 whitespace-nowrap"${_scopeId}><div class="text-sm text-gray-900"${_scopeId}>${ssrInterpolate(user.email)}</div></td><td class="px-6 py-4 whitespace-nowrap"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Tag, {
                value: user.is_admin ? "Admin" : "User",
                severity: user.is_admin ? "danger" : "info"
              }, null, _parent2, _scopeId));
              _push2(`</td><td class="px-6 py-4 whitespace-nowrap"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Tag, {
                value: user.is_premium ? "Premium" : "Free",
                severity: user.is_premium ? "success" : "warning"
              }, null, _parent2, _scopeId));
              _push2(`</td><td class="px-6 py-4 whitespace-nowrap"${_scopeId}><div class="text-sm text-gray-500"${_scopeId}>${ssrInterpolate(formatDate(user.created_at))}</div></td><td class="px-6 py-4 whitespace-nowrap text-sm"${_scopeId}><button class="text-primary-600 hover:text-primary-900 mr-4"${_scopeId}>${ssrInterpolate(user.is_admin ? "Remove Admin" : "Make Admin")}</button><button class="text-red-600 hover:text-red-900"${_scopeId}> Delete </button></td></tr>`);
            });
            _push2(`<!--]--></tbody></table></div>`);
          } else {
            return [
              createVNode("div", { class: "overflow-x-auto" }, [
                createVNode("table", { class: "min-w-full divide-y divide-gray-200" }, [
                  createVNode("thead", null, [
                    createVNode("tr", null, [
                      createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, " Name "),
                      createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, " Email "),
                      createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, " Role "),
                      createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, " Status "),
                      createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, " Joined "),
                      createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, " Actions ")
                    ])
                  ]),
                  createVNode("tbody", { class: "bg-white divide-y divide-gray-200" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(users), (user) => {
                      return openBlock(), createBlock("tr", {
                        key: user.id
                      }, [
                        createVNode("td", { class: "px-6 py-4 whitespace-nowrap" }, [
                          createVNode("div", { class: "flex items-center" }, [
                            createVNode("div", { class: "flex-shrink-0 h-10 w-10" }, [
                              user.avatar_url ? (openBlock(), createBlock("img", {
                                key: 0,
                                src: user.avatar_url,
                                class: "h-10 w-10 rounded-full object-cover"
                              }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
                                key: 1,
                                class: "h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center"
                              }, [
                                createVNode("i", { class: "pi pi-user text-gray-400" })
                              ]))
                            ]),
                            createVNode("div", { class: "ml-4" }, [
                              createVNode("div", { class: "text-sm font-medium text-gray-900" }, toDisplayString(user.full_name), 1)
                            ])
                          ])
                        ]),
                        createVNode("td", { class: "px-6 py-4 whitespace-nowrap" }, [
                          createVNode("div", { class: "text-sm text-gray-900" }, toDisplayString(user.email), 1)
                        ]),
                        createVNode("td", { class: "px-6 py-4 whitespace-nowrap" }, [
                          createVNode(_component_Tag, {
                            value: user.is_admin ? "Admin" : "User",
                            severity: user.is_admin ? "danger" : "info"
                          }, null, 8, ["value", "severity"])
                        ]),
                        createVNode("td", { class: "px-6 py-4 whitespace-nowrap" }, [
                          createVNode(_component_Tag, {
                            value: user.is_premium ? "Premium" : "Free",
                            severity: user.is_premium ? "success" : "warning"
                          }, null, 8, ["value", "severity"])
                        ]),
                        createVNode("td", { class: "px-6 py-4 whitespace-nowrap" }, [
                          createVNode("div", { class: "text-sm text-gray-500" }, toDisplayString(formatDate(user.created_at)), 1)
                        ]),
                        createVNode("td", { class: "px-6 py-4 whitespace-nowrap text-sm" }, [
                          createVNode("button", {
                            onClick: ($event) => handleToggleAdmin(user),
                            class: "text-primary-600 hover:text-primary-900 mr-4"
                          }, toDisplayString(user.is_admin ? "Remove Admin" : "Make Admin"), 9, ["onClick"]),
                          createVNode("button", {
                            onClick: ($event) => handleDelete(user.id),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/users/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Pc7hg_OH.mjs.map
