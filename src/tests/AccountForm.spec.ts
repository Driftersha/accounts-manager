/// <reference types="vitest" />

import { render, fireEvent } from '@testing-library/vue';
import AccountForm from '../components/AccountForm.vue';
import type { Account } from '@/types';
import { describe, it, expect } from 'vitest';


describe('AccountForm.vue', () => {
  const initialAccount: Account = {
    id: 1,
    type: 'Локальная',
    login: 'user1',
    password: 'pass1',
    labels: [{ text: 'tag1' }, { text: 'tag2' }],
  };

  it('скрывает пароль при выборе LDAP', async () => {
    const { getByTestId, queryByTestId } = render(AccountForm, {
      props: { account: initialAccount },
    });

    // Проверяем, что поле пароля изначально существует
    const passwordInput = getByTestId(`password-input-${initialAccount.id}`);
    expect(passwordInput).toBeTruthy();

    // Меняем тип учётной записи на LDAP
    const select = getByTestId(`type-select-${initialAccount.id}`) as HTMLSelectElement;
    await fireEvent.update(select, 'LDAP');

    // После выбора LDAP поле пароля должно исчезнуть
    expect(queryByTestId(`password-input-${initialAccount.id}`)).toBeNull();
  });

  it('удаляет учетную запись и эмитит событие remove', async () => {
    const { getByTestId, emitted } = render(AccountForm, {
      props: { account: initialAccount },
    });

    const deleteBtn = getByTestId(`delete-btn-${initialAccount.id}`);
    await fireEvent.click(deleteBtn);

    const emittedEvents = emitted();
    expect(emittedEvents.remove).toBeTruthy();
    expect(emittedEvents.remove?.[0]).toEqual([initialAccount.id]);
  });

  it('валидирует логин', async () => {
    const { getByTestId } = render(AccountForm, {
      props: { account: initialAccount },
    });

    const loginInput = getByTestId(`login-input-${initialAccount.id}`);
    await fireEvent.update(loginInput, '');
    await fireEvent.blur(loginInput);

    const errorMessage = getByTestId(`login-error-${initialAccount.id}`);
    expect(errorMessage).toBeTruthy();
  });
});
