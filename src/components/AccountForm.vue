<template>
  <tr class="accounts__row">
    <!-- Метки -->
    <td class="accounts__cell">
      <div class="accounts__field-wrapper">
        <input
          class="accounts__input-field"
          v-model="labelsInput"
          @blur="handleLabels"
          placeholder="Введите метки через ;"
          maxlength="50"
          :class="{ 'accounts__input-field--error': errors.labels }"
        />
        <span class="accounts__tooltip-icon">?</span>
        <span class="accounts__tooltip-text">
          Для указания нескольких меток используйте разделитель ;
          <br />
          Максимум 50 символов суммарно
        </span>
      </div>
    </td>

    <!-- Тип -->
    <td class="accounts__cell">
      <div class="accounts__field-wrapper">
        <select
          class="accounts__select"
          v-model="localAccount.type"
          @change="handleTypeChange"
          :class="{ 'accounts__select--error': errors.type }"
        >
          <option value="Локальная">Локальная</option>
          <option value="LDAP">LDAP</option>
        </select>
      </div>
    </td>

    <!-- Логин -->
    <td class="accounts__cell" :colspan="localAccount.type === 'LDAP' ? 2 : 1">
      <div class="accounts__field-wrapper">
        <input
          class="accounts__input-field"
          v-model="localAccount.login"
          @blur="validate"
          placeholder="Логин"
          maxlength="100"
          :class="{ 'accounts__input-field--error': errors.login }"
        />
        <span v-if="errors.login" class="accounts__error-text">
          Логин обязателен, максимум 100 символов
        </span>
      </div>
    </td>

    <!-- Пароль (если Локальная) -->
    <td
      v-if="localAccount.type === 'Локальная'"
      class="accounts__cell accounts__password-cell"
    >
      <div class="accounts__field-wrapper">
        <input
          class="accounts__input-field"
          v-model="localAccount.password"
          :type="showPassword ? 'text' : 'password'"
          @blur="validate"
          placeholder="Пароль"
          maxlength="100"
          :class="{ 'accounts__input-field--error': errors.password }"
        />
        <button
          type="button"
          class="accounts__show-pass-btn"
          @click="togglePassword"
        >
          {{ showPassword ? '🙈' : '👁' }}
        </button>
        <span v-if="errors.password" class="accounts__error-text">
          Пароль обязателен, максимум 100 символов
        </span>
      </div>
    </td>

    <!-- Кнопка удаления -->
    <td class="accounts__cell">
      <button
        class="accounts__delete-btn"
        type="button"
        @click="$emit('remove', localAccount.id)"
      >
        🗑
      </button>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import type { Account } from '@/stores/accounts';

const props = defineProps<{ account: Account }>();
const emit = defineEmits(['update', 'remove']);

const localAccount = reactive({ ...props.account });
const labelsInput = ref(localAccount.labels.map((l) => l.text).join('; '));
const showPassword = ref(false);

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
  type: false,
});

function handleLabels() {
  const raw = labelsInput.value;
  if (raw.length > 50) {
    errors.labels = true;
  } else {
    errors.labels = false;
    localAccount.labels = raw
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((text) => ({ text }));
  }
  validate();
}

function handleTypeChange() {
  if (localAccount.type === 'LDAP') {
    localAccount.password = null;
    errors.password = false;
  }
  validate();
}

function validate() {
  errors.login = !localAccount.login || localAccount.login.length > 100;
  errors.password =
    localAccount.type === 'Локальная' &&
    (!localAccount.password || localAccount.password.length > 100);
  emit('update', localAccount);
}

function togglePassword() {
  showPassword.value = !showPassword.value;
}
</script>

<style scoped>
.accounts__cell {
  padding: 5px;
  position: relative;
}

.accounts__field-wrapper {
  position: relative;
  width: 100%;
}

.accounts__input-field,
.accounts__select {
  width: 100%;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 14px;
}

.accounts__input-field--error,
.accounts__select--error {
  border-color: red;
}

.accounts__error-text {
  color: red;
  font-size: 12px;
  margin-top: 2px;
  display: block;
  /* position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%); */
}

.accounts__delete-btn {
  color: red;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 19px;
}

.accounts__password-cell {
  display: flex;
  align-items: center;
}

.accounts__show-pass-btn {
  margin-left: 5px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 16px;
  position: absolute;
  top: 2px;
  right: 10px;
}

.accounts__tooltip-icon {
  margin-left: 5px;
  cursor: pointer;
  font-weight: bold;
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
}

.accounts__tooltip-text {
  visibility: hidden;
  position: absolute;
  top: 24px;
  left: 0;
  background: #333;
  color: #fff;
  padding: 5px 8px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 10;
  white-space: nowrap;
}

.accounts__field-wrapper:hover .accounts__tooltip-text {
  visibility: visible;
}
</style>
