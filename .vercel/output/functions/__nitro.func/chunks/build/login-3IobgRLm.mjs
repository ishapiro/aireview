import { _ as __nuxt_component_0 } from './nuxt-link-C9HRXqxW.mjs';
import { ref, resolveComponent, mergeProps, withCtx, createTextVNode, unref, createVNode, withModifiers, createBlock, createCommentVNode, openBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { b as useSupabaseUser, c as useToast, n as navigateTo } from './server.mjs';
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
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    console.log("Login page script loaded");
    const client = useSupabaseClient();
    const user = useSupabaseUser();
    const toast = useToast();
    console.log("User value at script start:", user.value);
    if (user.value) {
      console.log("Redirecting to home because user is logged in");
      navigateTo("/");
    }
    const form = ref({
      email: "",
      password: "",
      remember: false
    });
    const submitted = ref(false);
    const isLoading = ref(false);
    const isValidEmail = (email) => {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      return emailPattern.test(email);
    };
    const handleSubmit = async () => {
      console.log("Form submitted", form.value);
      submitted.value = true;
      if (!form.value.email || !form.value.password || !isValidEmail(form.value.email) || form.value.password.length < 6) {
        console.log("Form validation failed");
        return;
      }
      isLoading.value = true;
      try {
        const { error } = await client.auth.signInWithPassword({
          email: form.value.email,
          password: form.value.password
        });
        if (error) throw error;
        console.log("Login successful, redirecting to home");
        navigateTo("/");
      } catch (error) {
        console.log("Login error:", error);
        toast.add({
          severity: "error",
          summary: "Error",
          detail: error.message,
          life: 3e3
        });
      } finally {
        isLoading.value = false;
      }
    };
    const handleGoogleSignIn = async () => {
      try {
        const { error } = await client.auth.signInWithOAuth({ provider: "google" });
        if (error) throw error;
      } catch (error) {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: error.message,
          life: 3e3
        });
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Card = resolveComponent("Card");
      const _component_NuxtLink = __nuxt_component_0;
      const _component_InputText = resolveComponent("InputText");
      const _component_Password = resolveComponent("Password");
      const _component_Checkbox = resolveComponent("Checkbox");
      const _component_Button = resolveComponent("Button");
      const _component_Toast = resolveComponent("Toast");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex items-center justify-center bg-gray-50 p-4" }, _attrs))}><div class="max-w-md w-full">`);
      _push(ssrRenderComponent(_component_Card, null, {
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-6"${_scopeId}><div class="text-center"${_scopeId}><h1 class="text-2xl font-bold text-gray-900"${_scopeId}>Sign in to your account</h1><p class="mt-2 text-sm text-gray-600"${_scopeId}> Or `);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/auth/register",
              class: "text-primary-600 hover:text-primary-500"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` create a new account `);
                } else {
                  return [
                    createTextVNode(" create a new account ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</p></div><form class="space-y-4"${_scopeId}><div${_scopeId}><label for="email" class="block text-sm text-gray-600 mb-1"${_scopeId}>Email</label>`);
            _push2(ssrRenderComponent(_component_InputText, {
              id: "email",
              modelValue: unref(form).email,
              "onUpdate:modelValue": ($event) => unref(form).email = $event,
              type: "email",
              placeholder: "Your Email",
              class: [{ "p-invalid": unref(submitted) && !unref(form).email }, "w-full"]
            }, null, _parent2, _scopeId));
            if (unref(submitted) && !unref(form).email) {
              _push2(`<small class="text-red-500"${_scopeId}>Email is required</small>`);
            } else if (unref(submitted) && !isValidEmail(unref(form).email)) {
              _push2(`<small class="text-red-500"${_scopeId}>Please enter a valid email</small>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><div class="flex items-center justify-between mb-1"${_scopeId}><label for="password" class="block text-sm text-gray-600"${_scopeId}>Password</label>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/auth/forgot-password",
              class: "text-sm text-primary-600 hover:text-primary-700"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Forgot password? `);
                } else {
                  return [
                    createTextVNode(" Forgot password? ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_Password, {
              id: "password",
              modelValue: unref(form).password,
              "onUpdate:modelValue": ($event) => unref(form).password = $event,
              placeholder: "Your Password",
              feedback: false,
              toggleMask: "",
              class: [{ "p-invalid": unref(submitted) && !unref(form).password }, "w-full"]
            }, null, _parent2, _scopeId));
            if (unref(submitted) && !unref(form).password) {
              _push2(`<small class="text-red-500"${_scopeId}>Password is required</small>`);
            } else if (unref(submitted) && unref(form).password.length < 6) {
              _push2(`<small class="text-red-500"${_scopeId}>Password must be at least 6 characters</small>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex items-center justify-between"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Checkbox, {
              modelValue: unref(form).remember,
              "onUpdate:modelValue": ($event) => unref(form).remember = $event,
              binary: true,
              inputId: "remember-me"
            }, null, _parent2, _scopeId));
            _push2(`<label for="remember-me" class="ml-2 text-sm text-gray-600"${_scopeId}>Remember me</label></div>`);
            _push2(ssrRenderComponent(_component_Button, {
              type: "submit",
              label: "Sign In",
              class: "w-full p-button-primary",
              loading: unref(isLoading)
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Button, {
              label: "Sign in with Google",
              icon: "pi pi-google",
              class: "w-full p-button-primary mt-2",
              onClick: handleGoogleSignIn,
              type: "button"
            }, null, _parent2, _scopeId));
            _push2(`<div class="text-center text-sm"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/auth/register",
              class: "text-primary-600 hover:text-primary-500"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Don&#39;t have an account? Sign up `);
                } else {
                  return [
                    createTextVNode(" Don't have an account? Sign up ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></form></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-6" }, [
                createVNode("div", { class: "text-center" }, [
                  createVNode("h1", { class: "text-2xl font-bold text-gray-900" }, "Sign in to your account"),
                  createVNode("p", { class: "mt-2 text-sm text-gray-600" }, [
                    createTextVNode(" Or "),
                    createVNode(_component_NuxtLink, {
                      to: "/auth/register",
                      class: "text-primary-600 hover:text-primary-500"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" create a new account ")
                      ]),
                      _: 1
                    })
                  ])
                ]),
                createVNode("form", {
                  onSubmit: withModifiers(handleSubmit, ["prevent"]),
                  class: "space-y-4"
                }, [
                  createVNode("div", null, [
                    createVNode("label", {
                      for: "email",
                      class: "block text-sm text-gray-600 mb-1"
                    }, "Email"),
                    createVNode(_component_InputText, {
                      id: "email",
                      modelValue: unref(form).email,
                      "onUpdate:modelValue": ($event) => unref(form).email = $event,
                      type: "email",
                      placeholder: "Your Email",
                      class: [{ "p-invalid": unref(submitted) && !unref(form).email }, "w-full"]
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                    unref(submitted) && !unref(form).email ? (openBlock(), createBlock("small", {
                      key: 0,
                      class: "text-red-500"
                    }, "Email is required")) : unref(submitted) && !isValidEmail(unref(form).email) ? (openBlock(), createBlock("small", {
                      key: 1,
                      class: "text-red-500"
                    }, "Please enter a valid email")) : createCommentVNode("", true)
                  ]),
                  createVNode("div", null, [
                    createVNode("div", { class: "flex items-center justify-between mb-1" }, [
                      createVNode("label", {
                        for: "password",
                        class: "block text-sm text-gray-600"
                      }, "Password"),
                      createVNode(_component_NuxtLink, {
                        to: "/auth/forgot-password",
                        class: "text-sm text-primary-600 hover:text-primary-700"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Forgot password? ")
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode(_component_Password, {
                      id: "password",
                      modelValue: unref(form).password,
                      "onUpdate:modelValue": ($event) => unref(form).password = $event,
                      placeholder: "Your Password",
                      feedback: false,
                      toggleMask: "",
                      class: [{ "p-invalid": unref(submitted) && !unref(form).password }, "w-full"]
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                    unref(submitted) && !unref(form).password ? (openBlock(), createBlock("small", {
                      key: 0,
                      class: "text-red-500"
                    }, "Password is required")) : unref(submitted) && unref(form).password.length < 6 ? (openBlock(), createBlock("small", {
                      key: 1,
                      class: "text-red-500"
                    }, "Password must be at least 6 characters")) : createCommentVNode("", true)
                  ]),
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode(_component_Checkbox, {
                      modelValue: unref(form).remember,
                      "onUpdate:modelValue": ($event) => unref(form).remember = $event,
                      binary: true,
                      inputId: "remember-me"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode("label", {
                      for: "remember-me",
                      class: "ml-2 text-sm text-gray-600"
                    }, "Remember me")
                  ]),
                  createVNode(_component_Button, {
                    type: "submit",
                    label: "Sign In",
                    class: "w-full p-button-primary",
                    loading: unref(isLoading)
                  }, null, 8, ["loading"]),
                  createVNode(_component_Button, {
                    label: "Sign in with Google",
                    icon: "pi pi-google",
                    class: "w-full p-button-primary mt-2",
                    onClick: handleGoogleSignIn,
                    type: "button"
                  }),
                  createVNode("div", { class: "text-center text-sm" }, [
                    createVNode(_component_NuxtLink, {
                      to: "/auth/register",
                      class: "text-primary-600 hover:text-primary-500"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Don't have an account? Sign up ")
                      ]),
                      _: 1
                    })
                  ])
                ], 32)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Toast, { position: "top-center" }, null, _parent));
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/auth/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-3IobgRLm.mjs.map
