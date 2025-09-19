<template>
  <div>
    <h2>Учетные записи</h2>
    <button @click="store.addAccount">+</button>

    <AccountForm
      v-for="acc in store.accounts"
      :key="acc.id"
      :account="acc"
      @update="store.updateAccount"
      @remove="store.removeAccount"
    />
  </div>
</template>

<script lang="ts" setup>
import { useAccountsStore } from '@/stores/accounts';
import AccountForm from './AccountForm.vue';

const store = useAccountsStore();
</script>
