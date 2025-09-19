<template>
  <div class="account-form">
    <!-- Метки -->
    <input
      v-model="labelsInput"
      @blur="handleLabels"
      placeholder="Метки (через ;)"
      maxlength="50"
      :class="{ error: errors.labels }"
    />

    <!-- Тип -->
    <select v-model="localAccount.type" @change="handleTypeChange">
      <option value="Локальная">Локальная</option>
      <option value="LDAP">LDAP</option>
    </select>

    <!-- Логин -->
    <input
      v-model="localAccount.login"
      @blur="validate"
      placeholder="Логин"
      maxlength="100"
      :class="{ error: errors.login }"
    />

    <!-- Пароль (если Локальная) -->
    <input
      v-if="localAccount.type === 'Локальная'"
      v-model="localAccount.password"
      type="password"
      @blur="validate"
      placeholder="Пароль"
      maxlength="100"
      :class="{ error: errors.password }"
    />

    <!-- Кнопка удаления -->
    <button
      class="delete"
      type="button"
      @click="$emit('remove', localAccount.id)"
    >
      🗑
    </button>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';
import type { Account } from '@/stores/accounts';

const props = defineProps<{ account: Account }>();
const emit = defineEmits(['update', 'remove']);

const localAccount = reactive({ ...props.account });

// отображаем labels как строку через ;
const labelsInput = ref(localAccount.labels.map((l) => l.text).join('; '));

// при изменении пропсов — обновляем локальную копию
watch(
  () => props.account,
  (newVal) => {
    Object.assign(localAccount, newVal);
    labelsInput.value = newVal.labels.map((l) => l.text).join('; ');
  },
  { deep: true }
);

const errors = reactive({
  labels: false,
  login: false,
  password: false,
});

function handleLabels() {
  localAccount.labels = labelsInput.value
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((text) => ({ text }));

  errors.labels = false;
  validate();
}

function handleTypeChange() {
  if (localAccount.type === 'LDAP') {
    localAccount.password = '';
    errors.password = false;
  }
  validate();
}

function validate() {
  errors.login = !localAccount.login;
  errors.password = localAccount.type === 'Локальная' && !localAccount.password;

  emit('update', localAccount);
}
</script>

<style scoped>
.account-form {
  display: grid;
  grid-template-columns: 2fr 1fr 2fr 2fr auto;
  gap: 0.5rem;
  align-items: center;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fafafa;
}

.account-form input,
.account-form select {
  padding: 0.4rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.account-form input.error,
.account-form select.error {
  border-color: red;
}

.delete {
  color: red;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
}
</style>
