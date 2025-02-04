import { createTestingPinia } from "@pinia/testing";
import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { useRoute } from "vue-router";

import HeaderNavbar from "@/components/Sidebar/HeaderNavbar.vue";

// 🛠 Mock do Vue Router, incluindo `useRoute` e `RouterLink`
vi.mock("vue-router", () => ({
  useRoute: () => ({
    path: "/", // Simulando uma rota válida
  }),
  RouterLink: { template: "<a><slot /></a>" }, // Mock para evitar erro de importação
}));

describe("HeaderNavbar.vue", () => {
  it("deve renderizar o componente sem erros", () => {
    const wrapper = mount(HeaderNavbar, {
      global: {
        plugins: [
          createTestingPinia({ createSpy: vi.fn }) // Injeta Pinia no teste
        ],
        stubs: {
          Icon: { template: "<svg></svg>" }, // Stub para evitar erro de importação
          NavLink: { template: "<div></div>" }, // Stub para componentes filhos
          AccountMenu: { template: "<div></div>" } // Stub para evitar erros
        },
      },
    });

    // Verifica se o componente foi renderizado corretamente
    expect(wrapper.exists()).toBe(true);
  });
});
