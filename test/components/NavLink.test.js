// NavigationLink.spec.js
import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import NavigationLink from "@/components/Sidebar/NavLink.vue";

// Crie um objeto fake para o router
const fakeRouter = {
  // Inicia com uma rota cujo nome é "home"
  currentRoute: ref({ name: "home" }),
};

// Mock do módulo 'vue-router'
vi.mock("vue-router", () => {
  return {
    // Quando o componente chamar useRouter, retorna o fakeRouter
    useRouter: () => fakeRouter,
    // Stub do RouterLink para não depender do funcionamento real do Vue Router
    RouterLink: {
      name: "RouterLink",
      template: "<a><slot /></a>",
    },
  };
});

describe("NavigationLink.vue", () => {
  // Antes de cada teste, podemos resetar a rota se necessário
  beforeEach(() => {
    fakeRouter.currentRoute.value = { name: "home" };
  });

  it("deve definir data-current como 'true' quando currentRoute.name for igual a page", () => {
    const wrapper = mount(NavigationLink, {
      props: {
        link: "/home",
        icon: "mdi-home",
        label: "Home",
        page: "home", // mesmo nome da rota atual
      },
    });

    // Como usamos um stub para RouterLink, ele será renderizado como um <a>
    const linkEl = wrapper.find("a");
    expect(linkEl.attributes("data-current")).toBe("true");
  });

  it("deve definir data-current como 'false' quando currentRoute.name for diferente de page", () => {
    // Altera a rota atual para 'dashboard'
    fakeRouter.currentRoute.value = { name: "dashboard" };

    const wrapper = mount(NavigationLink, {
      props: {
        link: "/home",
        icon: "mdi-home",
        label: "Home",
        page: "home", // page diferente de 'dashboard'
      },
    });

    const linkEl = wrapper.find("a");
    expect(linkEl.attributes("data-current")).toBe("false");
  });

  it("deve renderizar corretamente o label e o ícone", () => {
    const wrapper = mount(NavigationLink, {
      props: {
        link: "/home",
        icon: "mdi-home",
        label: "Home",
        page: "home",
      },
    });

    // Verifica se o texto label está renderizado
    expect(wrapper.text()).toContain("Home");
    // Verifica se o componente Icon foi renderizado
    // Como não testamos o conteúdo interno do Icon, basta verificar se existe um elemento com a classe que definimos para o ícone
    expect(wrapper.findComponent({ name: "Icon" }).exists()).toBe(true);
  });
});
