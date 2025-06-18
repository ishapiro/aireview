import { n as executeAsync } from '../nitro/nitro.mjs';
import { h as defineNuxtRouteMiddleware, b as useSupabaseUser, n as navigateTo } from './server.mjs';
import { u as useSupabaseClient } from './useSupabaseClient-BMmqXcE2.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'vue';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'vue/server-renderer';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';
import '@supabase/ssr';

const admin = defineNuxtRouteMiddleware(async (to) => {
  let __temp, __restore;
  const user = useSupabaseUser();
  if (!user.value) {
    return navigateTo("/auth/login");
  }
  const client = useSupabaseClient();
  const { data: profile } = ([__temp, __restore] = executeAsync(() => client.from("profiles").select("is_admin").eq("id", user.value.id).single()), __temp = await __temp, __restore(), __temp);
  if (!(profile == null ? void 0 : profile.is_admin)) {
    return navigateTo("/");
  }
});

export { admin as default };
//# sourceMappingURL=admin-BKnFFXXf.mjs.map
