// test/components/NavLink.test.js

import { createTestingPinia } from "@pinia/testing";
import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import NavigationLink from "@/components/Sidebar/NavLink.vue"; // ajuste o caminho conforme sua estrutura

// --- Criando um fakeRouter para simular o comportamento do vue-router ---
const fakeRouter = {
  currentRoute: ref({ name: "Dashboard", path: "/" }),
};

// --- Mock parcial do "vue-router" ---
vi.mock("vue-router", async () => {
  const actual = await vi.importActual("vue-router");
  return {
    ...actual,
    useRouter: () => fakeRouter,
    // Stub do RouterLink para renderizar um elemento <a> com slot
    RouterLink: {
      name: "RouterLink",
      template: "<a><slot /></a>",
    },
  };
});

describe("NavigationLink.vue", () => {
  // Reseta a rota antes de cada teste, se necessário
  beforeEach(() => {
    fakeRouter.currentRoute.value = { name: "Dashboard", path: "/" };
  });

  it("deve renderizar corretamente o label e o ícone", () => {
    const wrapper = mount(NavigationLink, {
      props: {
        link: "/dashboard",
        icon: "some-icon",  // valor fictício para o ícone
        label: "Dashboard",
        page: "Dashboard",
      },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
        stubs: {
          // Stub do RouterLink para garantir a renderização
          RouterLink: {
            name: "RouterLink",
            template: "<a><slot /></a>",
          },
          // Stub customizado para o componente Icon com nome explícito
          Icon: {
            name: "Icon",
            template: "<svg class=\"text-lg\"></svg>",
          },
        },
      },
    });

    // Verifica se o label está renderizado
    expect(wrapper.text()).toContain("Dashboard");
    // Verifica se o componente Icon (stub customizado) está presente
    expect(wrapper.findComponent({ name: "Icon" }).exists()).toBe(true);
  });
});
