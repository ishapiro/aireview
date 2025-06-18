import { _ as __nuxt_component_0 } from './nuxt-link-C9HRXqxW.mjs';
import { ref, watch, resolveComponent, mergeProps, withCtx, createTextVNode, createVNode, withModifiers, createBlock, openBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderStyle } from 'vue/server-renderer';
import { b as useSupabaseUser, c as useToast, d as useConfirm, n as navigateTo } from './server.mjs';
import { u as useSupabaseClient } from './useSupabaseClient-BMmqXcE2.mjs';
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

const _sfc_main = {
  __name: "profile",
  __ssrInlineRender: true,
  setup(__props) {
    const client = useSupabaseClient();
    const user = useSupabaseUser();
    const toast = useToast();
    useConfirm();
    const profile = ref({});
    const error = ref("");
    const isSubmitting = ref(false);
    const isChangingPassword = ref(false);
    const form = ref({
      fullName: "",
      email: "",
      bio: "",
      avatar_url: ""
    });
    const passwordForm = ref({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    if (!user.value) {
      navigateTo("/auth/login");
    }
    const fetchProfile = async () => {
      var _a;
      try {
        const { data, error: error2 } = await client.from("profiles").select("*").eq("id", (_a = user.value) == null ? void 0 : _a.id).single();
        if (error2) throw error2;
        profile.value = data;
        form.value = {
          fullName: data.full_name,
          email: data.email,
          bio: data.bio || "",
          avatar_url: data.avatar_url
        };
        console.log("Fetched profile:", JSON.parse(JSON.stringify(data)));
        console.log("Assigned to form.value:", JSON.parse(JSON.stringify(form.value)));
      } catch (err) {
        console.error("Error fetching profile:", err);
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to load profile",
          life: 3e3
        });
      }
    };
    watch(user, (newUser) => {
      if (newUser) {
        fetchProfile();
      } else {
        profile.value = {};
        form.value = {
          fullName: "",
          email: "",
          bio: "",
          avatar_url: ""
        };
      }
    });
    const handleSubmit = async () => {
      isSubmitting.value = true;
      error.value = "";
      try {
        const { error: updateError } = await client.from("profiles").update({
          full_name: form.value.fullName,
          bio: form.value.bio,
          avatar_url: form.value.avatar_url
        }).eq("id", user.value.id);
        if (updateError) throw updateError;
        toast.add({ severity: "success", summary: "Success", detail: "Profile updated successfully!", life: 3e3 });
        await fetchProfile();
        console.log("Profile updated and refetched");
      } catch (err) {
        error.value = err.message;
        toast.add({ severity: "error", summary: "Error", detail: err.message, life: 3e3 });
      } finally {
        isSubmitting.value = false;
      }
    };
    const handlePasswordChange = async () => {
      if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        toast.add({ severity: "error", summary: "Error", detail: "New passwords do not match", life: 3e3 });
        return;
      }
      isChangingPassword.value = true;
      error.value = "";
      try {
        const { error: updateError } = await client.auth.updateUser({
          password: passwordForm.value.newPassword
        });
        if (updateError) throw updateError;
        toast.add({ severity: "success", summary: "Success", detail: "Password changed successfully!", life: 3e3 });
        passwordForm.value = {
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        };
      } catch (err) {
        error.value = err.message;
        toast.add({ severity: "error", summary: "Error", detail: err.message, life: 3e3 });
      } finally {
        isChangingPassword.value = false;
      }
    };
    const handleUpgrade = () => {
      toast.add({ severity: "info", summary: "Coming Soon", detail: "Subscription upgrade functionality to be implemented", life: 3e3 });
    };
    const handleManageSubscription = () => {
      toast.add({ severity: "info", summary: "Coming Soon", detail: "Subscription management functionality to be implemented", life: 3e3 });
    };
    const handleDeleteAccount = async () => {
      const confirmed = await new Promise((resolve) => {
        useConfirm();
      });
      if (!confirmed) return;
      try {
        const { error: deleteError } = await client.auth.admin.deleteUser(user.value.id);
        if (deleteError) throw deleteError;
        await client.auth.signOut();
        navigateTo("/");
      } catch (err) {
        error.value = err.message;
        toast.add({ severity: "error", summary: "Error", detail: err.message, life: 3e3 });
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Card = resolveComponent("Card");
      const _component_InputText = resolveComponent("InputText");
      const _component_Textarea = resolveComponent("Textarea");
      const _component_Button = resolveComponent("Button");
      const _component_Password = resolveComponent("Password");
      const _component_Tag = resolveComponent("Tag");
      const _component_NuxtLink = __nuxt_component_0;
      const _component_Toast = resolveComponent("Toast");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-4xl mx-auto" }, _attrs))}><h1 class="text-3xl font-bold text-gray-900 mb-8">Profile Settings</h1><div class="grid grid-cols-1 md:grid-cols-3 gap-6"><div class="md:col-span-2">`);
      _push(ssrRenderComponent(_component_Card, null, {
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-6"${_scopeId}><h2 class="text-xl font-semibold text-gray-900"${_scopeId}>Profile Information</h2><form class="space-y-6"${_scopeId}><div class="field"${_scopeId}><label for="fullName" class="block text-sm font-medium text-gray-700"${_scopeId}>Full Name</label>`);
            _push2(ssrRenderComponent(_component_InputText, {
              id: "fullName",
              modelValue: form.value.fullName,
              "onUpdate:modelValue": ($event) => form.value.fullName = $event,
              class: "w-full"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="field"${_scopeId}><label for="email" class="block text-sm font-medium text-gray-700"${_scopeId}>Email</label>`);
            _push2(ssrRenderComponent(_component_InputText, {
              id: "email",
              modelValue: form.value.email,
              "onUpdate:modelValue": ($event) => form.value.email = $event,
              type: "email",
              class: "w-full",
              disabled: ""
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="field"${_scopeId}><label for="bio" class="block text-sm font-medium text-gray-700"${_scopeId}>Bio</label>`);
            _push2(ssrRenderComponent(_component_Textarea, {
              id: "bio",
              modelValue: form.value.bio,
              "onUpdate:modelValue": ($event) => form.value.bio = $event,
              rows: "4",
              class: "w-full"
            }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Button, {
              type: "submit",
              loading: isSubmitting.value,
              class: "w-full"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Save Changes `);
                } else {
                  return [
                    createTextVNode(" Save Changes ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></form></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-6" }, [
                createVNode("h2", { class: "text-xl font-semibold text-gray-900" }, "Profile Information"),
                createVNode("form", {
                  onSubmit: withModifiers(handleSubmit, ["prevent"]),
                  class: "space-y-6"
                }, [
                  createVNode("div", { class: "field" }, [
                    createVNode("label", {
                      for: "fullName",
                      class: "block text-sm font-medium text-gray-700"
                    }, "Full Name"),
                    createVNode(_component_InputText, {
                      id: "fullName",
                      modelValue: form.value.fullName,
                      "onUpdate:modelValue": ($event) => form.value.fullName = $event,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  createVNode("div", { class: "field" }, [
                    createVNode("label", {
                      for: "email",
                      class: "block text-sm font-medium text-gray-700"
                    }, "Email"),
                    createVNode(_component_InputText, {
                      id: "email",
                      modelValue: form.value.email,
                      "onUpdate:modelValue": ($event) => form.value.email = $event,
                      type: "email",
                      class: "w-full",
                      disabled: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  createVNode("div", { class: "field" }, [
                    createVNode("label", {
                      for: "bio",
                      class: "block text-sm font-medium text-gray-700"
                    }, "Bio"),
                    createVNode(_component_Textarea, {
                      id: "bio",
                      modelValue: form.value.bio,
                      "onUpdate:modelValue": ($event) => form.value.bio = $event,
                      rows: "4",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  createVNode("div", null, [
                    createVNode(_component_Button, {
                      type: "submit",
                      loading: isSubmitting.value,
                      class: "w-full"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Save Changes ")
                      ]),
                      _: 1
                    }, 8, ["loading"])
                  ])
                ], 32)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Card, { class: "mt-6" }, {
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-6"${_scopeId}><h2 class="text-xl font-semibold text-gray-900"${_scopeId}>Change Password</h2><form class="space-y-6"${_scopeId}><input type="email"${ssrRenderAttr("value", form.value.email)} autocomplete="username" style="${ssrRenderStyle({ "display": "none" })}"${_scopeId}><div class="field"${_scopeId}><label for="currentPassword" class="block text-sm font-medium text-gray-700"${_scopeId}>Current Password</label>`);
            _push2(ssrRenderComponent(_component_Password, {
              id: "currentPassword",
              modelValue: passwordForm.value.currentPassword,
              "onUpdate:modelValue": ($event) => passwordForm.value.currentPassword = $event,
              feedback: false,
              toggleMask: "",
              inputProps: { autocomplete: "current-password" },
              class: "w-full"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="field"${_scopeId}><label for="newPassword" class="block text-sm font-medium text-gray-700"${_scopeId}>New Password</label>`);
            _push2(ssrRenderComponent(_component_Password, {
              id: "newPassword",
              modelValue: passwordForm.value.newPassword,
              "onUpdate:modelValue": ($event) => passwordForm.value.newPassword = $event,
              feedback: false,
              toggleMask: "",
              inputProps: { autocomplete: "new-password" },
              class: "w-full"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="field"${_scopeId}><label for="confirmPassword" class="block text-sm font-medium text-gray-700"${_scopeId}>Confirm New Password</label>`);
            _push2(ssrRenderComponent(_component_Password, {
              id: "confirmPassword",
              modelValue: passwordForm.value.confirmPassword,
              "onUpdate:modelValue": ($event) => passwordForm.value.confirmPassword = $event,
              feedback: false,
              toggleMask: "",
              inputProps: { autocomplete: "new-password" },
              class: "w-full"
            }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Button, {
              type: "submit",
              loading: isChangingPassword.value,
              severity: "secondary",
              class: "w-full"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Change Password `);
                } else {
                  return [
                    createTextVNode(" Change Password ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></form></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-6" }, [
                createVNode("h2", { class: "text-xl font-semibold text-gray-900" }, "Change Password"),
                createVNode("form", {
                  onSubmit: withModifiers(handlePasswordChange, ["prevent"]),
                  class: "space-y-6"
                }, [
                  createVNode("input", {
                    type: "email",
                    value: form.value.email,
                    autocomplete: "username",
                    style: { "display": "none" }
                  }, null, 8, ["value"]),
                  createVNode("div", { class: "field" }, [
                    createVNode("label", {
                      for: "currentPassword",
                      class: "block text-sm font-medium text-gray-700"
                    }, "Current Password"),
                    createVNode(_component_Password, {
                      id: "currentPassword",
                      modelValue: passwordForm.value.currentPassword,
                      "onUpdate:modelValue": ($event) => passwordForm.value.currentPassword = $event,
                      feedback: false,
                      toggleMask: "",
                      inputProps: { autocomplete: "current-password" },
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  createVNode("div", { class: "field" }, [
                    createVNode("label", {
                      for: "newPassword",
                      class: "block text-sm font-medium text-gray-700"
                    }, "New Password"),
                    createVNode(_component_Password, {
                      id: "newPassword",
                      modelValue: passwordForm.value.newPassword,
                      "onUpdate:modelValue": ($event) => passwordForm.value.newPassword = $event,
                      feedback: false,
                      toggleMask: "",
                      inputProps: { autocomplete: "new-password" },
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  createVNode("div", { class: "field" }, [
                    createVNode("label", {
                      for: "confirmPassword",
                      class: "block text-sm font-medium text-gray-700"
                    }, "Confirm New Password"),
                    createVNode(_component_Password, {
                      id: "confirmPassword",
                      modelValue: passwordForm.value.confirmPassword,
                      "onUpdate:modelValue": ($event) => passwordForm.value.confirmPassword = $event,
                      feedback: false,
                      toggleMask: "",
                      inputProps: { autocomplete: "new-password" },
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  createVNode("div", null, [
                    createVNode(_component_Button, {
                      type: "submit",
                      loading: isChangingPassword.value,
                      severity: "secondary",
                      class: "w-full"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Change Password ")
                      ]),
                      _: 1
                    }, 8, ["loading"])
                  ])
                ], 32)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="space-y-6">`);
      _push(ssrRenderComponent(_component_Card, null, {
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d, _e, _f;
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}><h2 class="text-xl font-semibold text-gray-900"${_scopeId}>Subscription</h2><div class="flex items-center justify-between"${_scopeId}><span class="text-gray-700"${_scopeId}>Status</span>`);
            _push2(ssrRenderComponent(_component_Tag, {
              value: ((_a = profile.value) == null ? void 0 : _a.is_premium) ? "Premium" : "Free",
              severity: ((_b = profile.value) == null ? void 0 : _b.is_premium) ? "success" : "info"
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            if (!((_c = profile.value) == null ? void 0 : _c.is_premium)) {
              _push2(`<div${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Button, {
                onClick: handleUpgrade,
                class: "w-full",
                label: "Upgrade to Premium"
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<div${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Button, {
                onClick: handleManageSubscription,
                class: "w-full",
                severity: "secondary",
                label: "Manage Subscription"
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                createVNode("h2", { class: "text-xl font-semibold text-gray-900" }, "Subscription"),
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("span", { class: "text-gray-700" }, "Status"),
                  createVNode(_component_Tag, {
                    value: ((_d = profile.value) == null ? void 0 : _d.is_premium) ? "Premium" : "Free",
                    severity: ((_e = profile.value) == null ? void 0 : _e.is_premium) ? "success" : "info"
                  }, null, 8, ["value", "severity"])
                ]),
                !((_f = profile.value) == null ? void 0 : _f.is_premium) ? (openBlock(), createBlock("div", { key: 0 }, [
                  createVNode(_component_Button, {
                    onClick: handleUpgrade,
                    class: "w-full",
                    label: "Upgrade to Premium"
                  })
                ])) : (openBlock(), createBlock("div", { key: 1 }, [
                  createVNode(_component_Button, {
                    onClick: handleManageSubscription,
                    class: "w-full",
                    severity: "secondary",
                    label: "Manage Subscription"
                  })
                ]))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Card, null, {
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}><h2 class="text-xl font-semibold text-gray-900"${_scopeId}>Account Actions</h2><div class="space-y-4"${_scopeId}>`);
            if ((_a = profile.value) == null ? void 0 : _a.is_admin) {
              _push2(ssrRenderComponent(_component_NuxtLink, {
                to: "/admin",
                class: "block w-full"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_Button, {
                      class: "w-full",
                      severity: "secondary",
                      label: "Admin Dashboard",
                      icon: "pi pi-cog"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_Button, {
                        class: "w-full",
                        severity: "secondary",
                        label: "Admin Dashboard",
                        icon: "pi pi-cog"
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_component_Button, {
              onClick: handleDeleteAccount,
              class: "w-full",
              severity: "danger",
              label: "Delete Account"
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                createVNode("h2", { class: "text-xl font-semibold text-gray-900" }, "Account Actions"),
                createVNode("div", { class: "space-y-4" }, [
                  ((_b = profile.value) == null ? void 0 : _b.is_admin) ? (openBlock(), createBlock(_component_NuxtLink, {
                    key: 0,
                    to: "/admin",
                    class: "block w-full"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_Button, {
                        class: "w-full",
                        severity: "secondary",
                        label: "Admin Dashboard",
                        icon: "pi pi-cog"
                      })
                    ]),
                    _: 1
                  })) : createCommentVNode("", true),
                  createVNode(_component_Button, {
                    onClick: handleDeleteAccount,
                    class: "w-full",
                    severity: "danger",
                    label: "Delete Account"
                  })
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      _push(ssrRenderComponent(_component_Toast, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profile.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=profile-CuwrB_bV.mjs.map
