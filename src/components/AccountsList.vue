<template>
  <div class="accounts">
    <header class="accounts__header">
   <div class="container">
     <div class="accounts__header-wrapper">
        <h1 class="accounts__title">Учётные записи</h1>
      <button type="button" class="accounts__add-btn" @click="addAccount">
        +
      </button>
     </div>
   </div>
    </header>

  <main>
   <section class="accounts__section">
    <div class="container">
         <div class="accounts__hint">
      <span class="accounts__hint-icon">?</span>
      <span class="accounts__hint-text">
        Для указания нескольких меток для одной пары логин/пароль используйте
        разделитель ;
      </span>
    </div>

    <table class="accounts__table">
      <thead class="accounts__table-head">
        <tr class="accounts__table-row">
          <th class="accounts__table-header">Метки</th>
          <th class="accounts__table-header">Тип записи</th>
          <th class="accounts__table-header">Логин</th>
          <th class="accounts__table-header">Пароль</th>
          <th class="accounts__table-header"></th>
        </tr>
      </thead>
      <tbody class="accounts__table-body">
        <AccountForm
          v-for="acc in store.accounts"
          :key="acc.id"
          :account="acc"
          @update="onUpdate"
          @remove="onRemove"
        />
      </tbody>
    </table>
    </div>
   </section>
  </main>
  </div>
</template>

<script setup lang="ts">
import AccountForm from './AccountForm.vue';
import { useAccountsStore } from '@/stores/accounts';
import type { Account } from '@/stores/accounts';

const store = useAccountsStore();

function addAccount() {
  store.addAccount();
}

function onUpdate(account: Account) {
  console.log('[AccountsList] onUpdate', account.id);
  store.updateAccount(account);
}

function onRemove(id: number) {
  console.log('[AccountsList] onRemove', id);
  store.removeAccount(id);
}
</script>

<style scoped>
.accounts {
  width: 100%;
}

.accounts__header {
  padding: 20px 10px;
  margin-bottom: 30px;
  border-bottom: 1px solid rgb(0, 0, 0);
}

.accounts__header-wrapper {
 display: flex;
  align-items: flex-start;
  gap: 20px;
}

.accounts__title {
  margin: 0;
  font-size: 19px;
}

.accounts__add-btn {
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  background: #007bff;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
}

.accounts__add-btn:hover {
  background: #0056b3;
}

.accounts__hint {
  background: #f5f7fb;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 13px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.accounts__hint-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ddd;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.accounts__hint-text {
  flex: 1;
  font-size: 14px;
  line-height: 20px;
}

.accounts__table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;
}

.accounts__table-header,
.accounts__table td {
  padding: 10px 8px;
  text-align: left;
  vertical-align: middle;
  word-break: break-word;
  line-height: 20px;
  font-size: 14px;
}

.accounts__table-header {
  font-weight: 600;
}

.accounts__table input,
.accounts__table select {
  width: 100%;
  min-width: 100px;
  box-sizing: border-box;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.accounts__table input.error,
.accounts__table select.error {
  border-color: red;
}
</style>
