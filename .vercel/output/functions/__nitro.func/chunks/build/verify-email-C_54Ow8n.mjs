import { ref, resolveComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { u as useSupabaseClient } from './useSupabaseClient-BMmqXcE2.mjs';
import { b as useSupabaseUser, n as navigateTo } from './server.mjs';
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
  __name: "verify-email",
  __ssrInlineRender: true,
  setup(__props) {
    const client = useSupabaseClient();
    const user = useSupabaseUser();
    const toast = useToast();
    if (!user.value) {
      navigateTo("/auth/login");
    }
    const isResending = ref(false);
    const handleResendEmail = async () => {
      isResending.value = true;
      try {
        const { error } = await client.auth.resend({
          type: "signup",
          email: user.value.email
        });
        if (error) throw error;
        toast.add({
          severity: "success",
          summary: "Success",
          detail: "Verification email sent!",
          life: 3e3
        });
      } catch (error) {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: error.message,
          life: 3e3
        });
      } finally {
        isResending.value = false;
      }
    };
    const handleSignOut = async () => {
      await client.auth.signOut();
      navigateTo("/auth/login");
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Button = resolveComponent("Button");
      const _component_Toast = resolveComponent("Toast");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex items-center justify-center bg-white p-4" }, _attrs))}><div class="max-w-xl w-full"><div class="text-center mb-8"><h1 class="text-3xl font-semibold text-gray-800 mb-3">Check your email</h1><p class="text-gray-500">We&#39;ve sent you a verification link.</p></div><div class="space-y-8"><div class="flex justify-center"><div class="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center"><i class="pi pi-envelope text-4xl text-primary-600"></i></div></div><div class="text-center space-y-4"><p class="text-gray-600"> Please check your inbox and click the verification link to verify your account. </p><p class="text-gray-600"> If you haven&#39;t received the email, click below to resend. </p></div><div class="space-y-4">`);
      _push(ssrRenderComponent(_component_Button, {
        onClick: handleResendEmail,
        loading: unref(isResending),
        label: "Resend verification email",
        class: "w-full p-button-primary"
      }, null, _parent));
      _push(ssrRenderComponent(_component_Button, {
        onClick: handleSignOut,
        severity: "secondary",
        label: "Sign out",
        class: "w-full p-button-outlined"
      }, null, _parent));
      _push(`</div></div>`);
      _push(ssrRenderComponent(_component_Toast, { position: "top-center" }, null, _parent));
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/auth/verify-email.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=verify-email-C_54Ow8n.mjs.map
