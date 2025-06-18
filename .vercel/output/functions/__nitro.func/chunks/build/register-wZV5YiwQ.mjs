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
  __name: "register",
  __ssrInlineRender: true,
  setup(__props) {
    const client = useSupabaseClient();
    const user = useSupabaseUser();
    const toast = useToast();
    if (user.value) {
      navigateTo("/");
    }
    const form = ref({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      website: "",
      password: "",
      confirmPassword: "",
      terms: false
    });
    const submitted = ref(false);
    const isLoading = ref(false);
    const isValidEmail = (email) => {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      return emailPattern.test(email);
    };
    const handleSubmit = async () => {
      submitted.value = true;
      if (!form.value.firstName || !form.value.lastName || !form.value.email || !form.value.password || !form.value.confirmPassword || !form.value.terms || !isValidEmail(form.value.email) || form.value.password.length < 6 || form.value.password !== form.value.confirmPassword) {
        return;
      }
      isLoading.value = true;
      try {
        const { error: signUpError, data } = await client.auth.signUp({
          email: form.value.email,
          password: form.value.password,
          options: {
            data: {
              first_name: form.value.firstName,
              last_name: form.value.lastName,
              phone: form.value.phone,
              website: form.value.website
            }
          }
        });
        if (signUpError) throw signUpError;
        const { error: profileError } = await client.from("profiles").insert({
          id: data.user.id,
          first_name: form.value.firstName,
          last_name: form.value.lastName,
          email: form.value.email,
          phone: form.value.phone,
          website: form.value.website
        });
        if (profileError) throw profileError;
        navigateTo("/auth/verify-email");
      } catch (error) {
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
    const handleGoogleSignUp = async () => {
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
            _push2(`<div class="space-y-6"${_scopeId}><div class="text-center"${_scopeId}><h1 class="text-2xl font-bold text-gray-900"${_scopeId}>Create your account</h1><p class="mt-2 text-sm text-gray-600"${_scopeId}> Or `);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/auth/login",
              class: "text-primary-600 hover:text-primary-500"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` sign in to your account `);
                } else {
                  return [
                    createTextVNode(" sign in to your account ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</p></div><form class="space-y-4"${_scopeId}><div${_scopeId}><label for="first-name" class="block text-sm text-gray-600 mb-1"${_scopeId}>First Name</label>`);
            _push2(ssrRenderComponent(_component_InputText, {
              id: "first-name",
              modelValue: unref(form).firstName,
              "onUpdate:modelValue": ($event) => unref(form).firstName = $event,
              placeholder: "Your First Name",
              class: [{ "p-invalid": unref(submitted) && !unref(form).firstName }, "w-full"]
            }, null, _parent2, _scopeId));
            if (unref(submitted) && !unref(form).firstName) {
              _push2(`<small class="text-red-500"${_scopeId}>First name is required</small>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label for="last-name" class="block text-sm text-gray-600 mb-1"${_scopeId}>Last Name</label>`);
            _push2(ssrRenderComponent(_component_InputText, {
              id: "last-name",
              modelValue: unref(form).lastName,
              "onUpdate:modelValue": ($event) => unref(form).lastName = $event,
              placeholder: "Your Last Name",
              class: [{ "p-invalid": unref(submitted) && !unref(form).lastName }, "w-full"]
            }, null, _parent2, _scopeId));
            if (unref(submitted) && !unref(form).lastName) {
              _push2(`<small class="text-red-500"${_scopeId}>Last name is required</small>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label for="email" class="block text-sm text-gray-600 mb-1"${_scopeId}>Email</label>`);
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
            _push2(`</div><div${_scopeId}><label for="phone" class="block text-sm text-gray-600 mb-1"${_scopeId}>Phone (Optional)</label>`);
            _push2(ssrRenderComponent(_component_InputText, {
              id: "phone",
              modelValue: unref(form).phone,
              "onUpdate:modelValue": ($event) => unref(form).phone = $event,
              placeholder: "Your Phone Number",
              class: "w-full"
            }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}><label for="website" class="block text-sm text-gray-600 mb-1"${_scopeId}>Website (Optional)</label>`);
            _push2(ssrRenderComponent(_component_InputText, {
              id: "website",
              modelValue: unref(form).website,
              "onUpdate:modelValue": ($event) => unref(form).website = $event,
              placeholder: "Your Website",
              class: "w-full"
            }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}><label for="password" class="block text-sm text-gray-600 mb-1"${_scopeId}>Password</label>`);
            _push2(ssrRenderComponent(_component_Password, {
              id: "password",
              modelValue: unref(form).password,
              "onUpdate:modelValue": ($event) => unref(form).password = $event,
              placeholder: "Your Password",
              feedback: true,
              toggleMask: "",
              class: [{ "p-invalid": unref(submitted) && !unref(form).password }, "w-full"],
              inputProps: { autocomplete: "new-password" }
            }, null, _parent2, _scopeId));
            if (unref(submitted) && !unref(form).password) {
              _push2(`<small class="text-red-500"${_scopeId}>Password is required</small>`);
            } else if (unref(submitted) && unref(form).password.length < 6) {
              _push2(`<small class="text-red-500"${_scopeId}>Password must be at least 6 characters</small>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label for="confirm-password" class="block text-sm text-gray-600 mb-1"${_scopeId}>Confirm Password</label>`);
            _push2(ssrRenderComponent(_component_Password, {
              id: "confirm-password",
              modelValue: unref(form).confirmPassword,
              "onUpdate:modelValue": ($event) => unref(form).confirmPassword = $event,
              placeholder: "Confirm Password",
              feedback: false,
              toggleMask: "",
              class: [{ "p-invalid": unref(submitted) && !unref(form).confirmPassword }, "w-full"],
              inputProps: { autocomplete: "new-password" }
            }, null, _parent2, _scopeId));
            if (unref(submitted) && !unref(form).confirmPassword) {
              _push2(`<small class="text-red-500"${_scopeId}>Please confirm your password</small>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex items-start space-x-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Checkbox, {
              modelValue: unref(form).terms,
              "onUpdate:modelValue": ($event) => unref(form).terms = $event,
              binary: true,
              inputId: "terms"
            }, null, _parent2, _scopeId));
            _push2(`<label for="terms" class="text-sm text-gray-600"${_scopeId}> I agree to the `);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/terms",
              class: "text-primary hover:text-primary-600"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Terms of Service`);
                } else {
                  return [
                    createTextVNode("Terms of Service")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(` and `);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/privacy",
              class: "text-primary hover:text-primary-600"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Privacy Policy`);
                } else {
                  return [
                    createTextVNode("Privacy Policy")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</label></div>`);
            _push2(ssrRenderComponent(_component_Button, {
              type: "submit",
              label: "Create Account",
              class: "w-full bg-primary hover:bg-primary-600 text-white",
              loading: unref(isLoading)
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Button, {
              label: "Sign up with Google",
              icon: "pi pi-google",
              class: "w-full p-button-outlined p-button-secondary mt-2",
              onClick: handleGoogleSignUp,
              type: "button"
            }, null, _parent2, _scopeId));
            _push2(`<div class="text-center text-sm"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/auth/login",
              class: "text-primary-600 hover:text-primary-500"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Already have an account? Sign in `);
                } else {
                  return [
                    createTextVNode(" Already have an account? Sign in ")
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
                  createVNode("h1", { class: "text-2xl font-bold text-gray-900" }, "Create your account"),
                  createVNode("p", { class: "mt-2 text-sm text-gray-600" }, [
                    createTextVNode(" Or "),
                    createVNode(_component_NuxtLink, {
                      to: "/auth/login",
                      class: "text-primary-600 hover:text-primary-500"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" sign in to your account ")
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
                      for: "first-name",
                      class: "block text-sm text-gray-600 mb-1"
                    }, "First Name"),
                    createVNode(_component_InputText, {
                      id: "first-name",
                      modelValue: unref(form).firstName,
                      "onUpdate:modelValue": ($event) => unref(form).firstName = $event,
                      placeholder: "Your First Name",
                      class: [{ "p-invalid": unref(submitted) && !unref(form).firstName }, "w-full"]
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                    unref(submitted) && !unref(form).firstName ? (openBlock(), createBlock("small", {
                      key: 0,
                      class: "text-red-500"
                    }, "First name is required")) : createCommentVNode("", true)
                  ]),
                  createVNode("div", null, [
                    createVNode("label", {
                      for: "last-name",
                      class: "block text-sm text-gray-600 mb-1"
                    }, "Last Name"),
                    createVNode(_component_InputText, {
                      id: "last-name",
                      modelValue: unref(form).lastName,
                      "onUpdate:modelValue": ($event) => unref(form).lastName = $event,
                      placeholder: "Your Last Name",
                      class: [{ "p-invalid": unref(submitted) && !unref(form).lastName }, "w-full"]
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                    unref(submitted) && !unref(form).lastName ? (openBlock(), createBlock("small", {
                      key: 0,
                      class: "text-red-500"
                    }, "Last name is required")) : createCommentVNode("", true)
                  ]),
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
                    createVNode("label", {
                      for: "phone",
                      class: "block text-sm text-gray-600 mb-1"
                    }, "Phone (Optional)"),
                    createVNode(_component_InputText, {
                      id: "phone",
                      modelValue: unref(form).phone,
                      "onUpdate:modelValue": ($event) => unref(form).phone = $event,
                      placeholder: "Your Phone Number",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", {
                      for: "website",
                      class: "block text-sm text-gray-600 mb-1"
                    }, "Website (Optional)"),
                    createVNode(_component_InputText, {
                      id: "website",
                      modelValue: unref(form).website,
                      "onUpdate:modelValue": ($event) => unref(form).website = $event,
                      placeholder: "Your Website",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", {
                      for: "password",
                      class: "block text-sm text-gray-600 mb-1"
                    }, "Password"),
                    createVNode(_component_Password, {
                      id: "password",
                      modelValue: unref(form).password,
                      "onUpdate:modelValue": ($event) => unref(form).password = $event,
                      placeholder: "Your Password",
                      feedback: true,
                      toggleMask: "",
                      class: [{ "p-invalid": unref(submitted) && !unref(form).password }, "w-full"],
                      inputProps: { autocomplete: "new-password" }
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                    unref(submitted) && !unref(form).password ? (openBlock(), createBlock("small", {
                      key: 0,
                      class: "text-red-500"
                    }, "Password is required")) : unref(submitted) && unref(form).password.length < 6 ? (openBlock(), createBlock("small", {
                      key: 1,
                      class: "text-red-500"
                    }, "Password must be at least 6 characters")) : createCommentVNode("", true)
                  ]),
                  createVNode("div", null, [
                    createVNode("label", {
                      for: "confirm-password",
                      class: "block text-sm text-gray-600 mb-1"
                    }, "Confirm Password"),
                    createVNode(_component_Password, {
                      id: "confirm-password",
                      modelValue: unref(form).confirmPassword,
                      "onUpdate:modelValue": ($event) => unref(form).confirmPassword = $event,
                      placeholder: "Confirm Password",
                      feedback: false,
                      toggleMask: "",
                      class: [{ "p-invalid": unref(submitted) && !unref(form).confirmPassword }, "w-full"],
                      inputProps: { autocomplete: "new-password" }
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                    unref(submitted) && !unref(form).confirmPassword ? (openBlock(), createBlock("small", {
                      key: 0,
                      class: "text-red-500"
                    }, "Please confirm your password")) : createCommentVNode("", true)
                  ]),
                  createVNode("div", { class: "flex items-start space-x-2" }, [
                    createVNode(_component_Checkbox, {
                      modelValue: unref(form).terms,
                      "onUpdate:modelValue": ($event) => unref(form).terms = $event,
                      binary: true,
                      inputId: "terms"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode("label", {
                      for: "terms",
                      class: "text-sm text-gray-600"
                    }, [
                      createTextVNode(" I agree to the "),
                      createVNode(_component_NuxtLink, {
                        to: "/terms",
                        class: "text-primary hover:text-primary-600"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Terms of Service")
                        ]),
                        _: 1
                      }),
                      createTextVNode(" and "),
                      createVNode(_component_NuxtLink, {
                        to: "/privacy",
                        class: "text-primary hover:text-primary-600"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Privacy Policy")
                        ]),
                        _: 1
                      })
                    ])
                  ]),
                  createVNode(_component_Button, {
                    type: "submit",
                    label: "Create Account",
                    class: "w-full bg-primary hover:bg-primary-600 text-white",
                    loading: unref(isLoading)
                  }, null, 8, ["loading"]),
                  createVNode(_component_Button, {
                    label: "Sign up with Google",
                    icon: "pi pi-google",
                    class: "w-full p-button-outlined p-button-secondary mt-2",
                    onClick: handleGoogleSignUp,
                    type: "button"
                  }),
                  createVNode("div", { class: "text-center text-sm" }, [
                    createVNode(_component_NuxtLink, {
                      to: "/auth/login",
                      class: "text-primary-600 hover:text-primary-500"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Already have an account? Sign in ")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/auth/register.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=register-wZV5YiwQ.mjs.map
