import { createTestingPinia } from "@pinia/testing";
import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";

import UserTable from "@/components/form/UserTable.vue";
import { useUsersStore } from "@/stores/users";

describe("UserTable.vue", () => {
  it("deve renderizar corretamente", async () => {
    // Mock de dados iniciais para o teste
    const wrapper = mount(UserTable, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              users: [{ id: "1", name: "João Silva", email: "joao@email.com" }],
              currentPage: 1,
              pageSize: 5,
            },
            createSpy: vi.fn, // Usando vi.fn para o createSpy
          }),
        ],
      },
    });

    // Verificar se a tabela foi renderizada corretamente
    expect(wrapper.find("table").exists()).toBe(true);
    expect(wrapper.findAll("tr").length).toBe(2); // Contando o cabeçalho e uma linha de usuário
  });

  it("deve chamar initUsers ao montar o componente", async () => {
    // Espionar a função initUsers
    const initUsersSpy = vi.fn();
    const wrapper = mount(UserTable, {
      global: {
        plugins: [
          createTestingPinia({
            actions: {
              initUsers: initUsersSpy, // Mock da função initUsers
            },
            createSpy: vi.fn, // Definindo createSpy novamente
          }),
        ],
      },
    });

    // Espera o próximo ciclo de atualização do Vue
    await nextTick();

    // Verificar se initUsers foi chamado
    expect(initUsersSpy).toHaveBeenCalled();
  });

  it("deve abrir o modal de adicionar usuário ao clicar no botão", async () => {
    const wrapper = mount(UserTable, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              users: [{ id: "1", name: "João Silva", email: "joao@email.com" }],
              currentPage: 1,
              pageSize: 5,
            },
            createSpy: vi.fn, // Usando vi.fn
          }),
        ],
      },
    });

    const addButton = wrapper.find("button"); // O primeiro botão (Adicionar Usuário)
    await addButton.trigger("click");

    // Verificar se o modal foi aberto (verificando a visibilidade do modal)
    expect(wrapper.vm.isAddModalOpen).toBe(true);
  });

  it("deve deletar um usuário ao clicar no ícone de excluir", async () => {
    const deleteUserSpy = vi.fn();
    const wrapper = mount(UserTable, {
      global: {
        plugins: [
          createTestingPinia({
            actions: {
              deleteUser: deleteUserSpy,
            },
            initialState: {
              users: [{ id: "1", name: "João Silva", email: "joao@email.com" }],
            },
            createSpy: vi.fn, // Usando vi.fn
          }),
        ],
      },
    });

    const deleteButton = wrapper.findAll("button").at(1); // O botão de excluir
    await deleteButton.trigger("click");

    // Verificar se a função de exclusão foi chamada
    expect(deleteUserSpy).toHaveBeenCalledWith("1");
  });

  it("deve exibir mensagem quando não houver usuários", async () => {
    const wrapper = mount(UserTable, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              users: [],
              currentPage: 1,
              pageSize: 5,
            },
            createSpy: vi.fn, // Usando vi.fn para o createSpy
          }),
        ],
      },
    });

    // Verificar se a mensagem "Nenhum usuário encontrado" está sendo exibida
    expect(wrapper.text()).toContain("Nenhum usuário encontrado.");
  });
});
